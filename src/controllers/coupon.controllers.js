// ael_backend/src/controllers/coupon.controllers.js
import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// In-memory rate limiting map for coupon validation to prevent brute force
const validationAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS_PER_WINDOW = 25; // max 25 attempts / IP / minute

const checkRateLimit = (ip) => {
  const now = Date.now();
  const record = validationAttempts.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  record.count += 1;
  validationAttempts.set(ip, record);

  // Clean old entries periodically
  if (validationAttempts.size > 2000) {
    for (const [key, val] of validationAttempts.entries()) {
      if (now > val.resetAt) validationAttempts.delete(key);
    }
  }

  return record.count <= MAX_ATTEMPTS_PER_WINDOW;
};

/**
 * Public/Learner: Validate and calculate discount for a coupon
 * POST /api/v1/coupons/validate
 */
export const validateCoupon = asyncHandler(async (req, res) => {
  const clientIp = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
  if (!checkRateLimit(clientIp)) {
    throw new ApiError(429, "Too many coupon validation attempts. Please try again in a minute.");
  }

  const { code, basePrice = 0, courseId, planKey } = req.body;

  if (!code || typeof code !== "string" || !code.trim()) {
    throw new ApiError(400, "Coupon code is required");
  }

  const normalizedCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true });

  if (!coupon) {
    throw new ApiError(404, "Invalid or inactive coupon code");
  }

  const now = new Date();

  // 1. Check expiration (if coupon is not configured to never expire)
  if (!coupon.isNeverExpires) {
    if (coupon.validFrom && now < new Date(coupon.validFrom)) {
      throw new ApiError(400, "This coupon is not active yet");
    }
    if (coupon.validUntil && now > new Date(coupon.validUntil)) {
      throw new ApiError(400, "This coupon has expired");
    }
  }

  // 2. Check total usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new ApiError(400, "This coupon has reached its maximum total redemption limit");
  }

  // 3. Check per-user usage limit if user is authenticated
  const currentUserId = req.user?._id?.toString();
  const currentUserPhone = req.user?.phone?.trim();
  const currentUserEmail = req.user?.email?.trim()?.toLowerCase();

  if (currentUserId || currentUserPhone || currentUserEmail) {
    const userUsages = (coupon.usedBy || []).filter((u) => {
      if (currentUserId && u.userId && u.userId.toString() === currentUserId) return true;
      if (currentUserPhone && u.userPhone && u.userPhone.trim() === currentUserPhone) return true;
      if (currentUserEmail && u.userEmail && u.userEmail.trim().toLowerCase() === currentUserEmail)
        return true;
      return false;
    });

    if (userUsages.length >= (coupon.perUserLimit || 1)) {
      throw new ApiError(
        400,
        `You have already redeemed this coupon the maximum allowed times (${coupon.perUserLimit || 1} time)`
      );
    }
  }

  // 4. Check applicability target (course vs subscription)
  const isCourseCheckout = Boolean(courseId);

  if (coupon.targetType === "course" && !isCourseCheckout) {
    throw new ApiError(400, "This coupon can only be used for course enrollments");
  }

  if (coupon.targetType === "subscription" && isCourseCheckout) {
    throw new ApiError(400, "This coupon can only be used for subscription packages");
  }

  if (coupon.targetItems && coupon.targetItems.length > 0) {
    const itemTarget = isCourseCheckout ? String(courseId) : String(planKey || "").toLowerCase();
    const isTargetMatched = coupon.targetItems.some(
      (ti) => String(ti).trim().toLowerCase() === itemTarget.trim().toLowerCase()
    );
    if (!isTargetMatched) {
      throw new ApiError(400, "This coupon is not applicable to the selected item");
    }
  }

  // 5. Minimum purchase spend check
  const numBasePrice = Number(basePrice) || 0;
  if (coupon.minPurchaseAmount && numBasePrice < coupon.minPurchaseAmount) {
    throw new ApiError(
      400,
      `Minimum purchase amount of ৳${coupon.minPurchaseAmount} is required to apply this coupon`
    );
  }

  // 6. Calculate authoritative discount
  let discountAmount = 0;

  if (coupon.discountType === "free_access") {
    // 100% Free Gift Voucher
    discountAmount = numBasePrice;
  } else if (coupon.discountType === "percentage") {
    let calc = Math.round((numBasePrice * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && calc > coupon.maxDiscountAmount) {
      calc = coupon.maxDiscountAmount;
    }
    discountAmount = Math.min(numBasePrice, calc);
  } else if (coupon.discountType === "fixed") {
    discountAmount = Math.min(numBasePrice, Math.round(coupon.discountValue));
  }

  const finalPrice = Math.max(0, numBasePrice - discountAmount);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        valid: true,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount),
        finalPrice: Math.round(finalPrice),
        isLifetimeAccess: Boolean(coupon.isLifetimeAccess),
        message:
          coupon.discountType === "free_access" || finalPrice === 0
            ? "🎉 100% Gift Coupon applied! Free Access Activated."
            : `🎉 Coupon applied successfully! ৳${discountAmount} discount.`,
      },
      "Coupon validated successfully"
    )
  );
});

/**
 * Admin: Get all coupons with filters and aggregate metrics
 * GET /api/v1/coupons
 */
export const getCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status = "all", targetType = "all" } = req.query;

  const query = {};

  if (search) {
    const s = search.trim();
    query.$or = [{ code: { $regex: s, $options: "i" } }, { title: { $regex: s, $options: "i" } }];
  }

  if (status === "active") query.isActive = true;
  if (status === "inactive") query.isActive = false;

  if (targetType !== "all" && ["course", "subscription"].includes(targetType)) {
    query.targetType = targetType;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [coupons, total, totalActive, totalRedemptionsAgg] = await Promise.all([
    Coupon.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Coupon.countDocuments(query),
    Coupon.countDocuments({ isActive: true }),
    Coupon.aggregate([{ $group: { _id: null, totalUsed: { $sum: "$usageCount" } } }]),
  ]);

  const totalRedemptions = totalRedemptionsAgg?.[0]?.totalUsed || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        coupons,
        pagination: {
          total,
          page: pageNum,
          totalPages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
        stats: {
          totalCoupons: total,
          activeCoupons: totalActive,
          totalRedemptions,
        },
      },
      "Coupons retrieved successfully"
    )
  );
});

/**
 * Admin: Get single coupon details
 * GET /api/v1/coupons/:id
 */
export const getCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id).populate("createdBy", "fullName userName email");

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res.status(200).json(new ApiResponse(200, coupon, "Coupon details retrieved"));
});

/**
 * Admin: Create a new dynamic coupon / gift voucher
 * POST /api/v1/coupons
 */
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    title,
    description = "",
    discountType = "percentage",
    discountValue = 0,
    targetType = "all",
    targetItems = [],
    isLifetimeAccess = false,
    isNeverExpires = false,
    validFrom,
    validUntil,
    minPurchaseAmount = 0,
    maxDiscountAmount = null,
    usageLimit = null,
    perUserLimit = 1,
    isActive = true,
  } = req.body;

  if (!code || !code.trim()) {
    throw new ApiError(400, "Coupon code is required");
  }
  if (!title || !title.trim()) {
    throw new ApiError(400, "Coupon title is required");
  }

  const normalizedCode = code.trim().toUpperCase();

  const existing = await Coupon.findOne({ code: normalizedCode });
  if (existing) {
    throw new ApiError(409, `A coupon with code "${normalizedCode}" already exists`);
  }

  const newCoupon = await Coupon.create({
    code: normalizedCode,
    title: title.trim(),
    description: description.trim(),
    discountType,
    discountValue: discountType === "free_access" ? 100 : Math.max(0, Number(discountValue) || 0),
    targetType,
    targetItems: Array.isArray(targetItems) ? targetItems : [],
    isLifetimeAccess: Boolean(isLifetimeAccess),
    isNeverExpires: Boolean(isNeverExpires),
    validFrom: validFrom ? new Date(validFrom) : new Date(),
    validUntil: !isNeverExpires && validUntil ? new Date(validUntil) : null,
    minPurchaseAmount: Math.max(0, Number(minPurchaseAmount) || 0),
    maxDiscountAmount: maxDiscountAmount ? Math.max(0, Number(maxDiscountAmount)) : null,
    usageLimit: usageLimit ? Math.max(1, Number(usageLimit)) : null,
    perUserLimit: Math.max(1, Number(perUserLimit) || 1),
    isActive: Boolean(isActive),
    createdBy: req.user?._id,
  });

  return res.status(201).json(new ApiResponse(201, newCoupon, "Coupon created successfully"));
});

/**
 * Admin: Update an existing coupon
 * PATCH /api/v1/coupons/:id
 */
export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  const {
    code,
    title,
    description,
    discountType,
    discountValue,
    targetType,
    targetItems,
    isLifetimeAccess,
    isNeverExpires,
    validFrom,
    validUntil,
    minPurchaseAmount,
    maxDiscountAmount,
    usageLimit,
    perUserLimit,
    isActive,
  } = req.body;

  if (code && code.trim().toUpperCase() !== coupon.code) {
    const checkExists = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      _id: { $ne: id },
    });
    if (checkExists) {
      throw new ApiError(409, `Code "${code.trim().toUpperCase()}" is already in use`);
    }
    coupon.code = code.trim().toUpperCase();
  }

  if (title !== undefined) coupon.title = title.trim();
  if (description !== undefined) coupon.description = description.trim();
  if (discountType !== undefined) coupon.discountType = discountType;
  if (discountValue !== undefined) {
    coupon.discountValue =
      coupon.discountType === "free_access" ? 100 : Math.max(0, Number(discountValue) || 0);
  }
  if (targetType !== undefined) coupon.targetType = targetType;
  if (targetItems !== undefined) {
    coupon.targetItems = Array.isArray(targetItems) ? targetItems : [];
  }
  if (isLifetimeAccess !== undefined) coupon.isLifetimeAccess = Boolean(isLifetimeAccess);
  if (isNeverExpires !== undefined) coupon.isNeverExpires = Boolean(isNeverExpires);
  if (validFrom !== undefined) coupon.validFrom = validFrom ? new Date(validFrom) : new Date();
  if (validUntil !== undefined) {
    coupon.validUntil = !coupon.isNeverExpires && validUntil ? new Date(validUntil) : null;
  }
  if (minPurchaseAmount !== undefined) {
    coupon.minPurchaseAmount = Math.max(0, Number(minPurchaseAmount) || 0);
  }
  if (maxDiscountAmount !== undefined) {
    coupon.maxDiscountAmount = maxDiscountAmount ? Math.max(0, Number(maxDiscountAmount)) : null;
  }
  if (usageLimit !== undefined) {
    coupon.usageLimit = usageLimit ? Math.max(1, Number(usageLimit)) : null;
  }
  if (perUserLimit !== undefined) {
    coupon.perUserLimit = Math.max(1, Number(perUserLimit) || 1);
  }
  if (isActive !== undefined) coupon.isActive = Boolean(isActive);

  await coupon.save();

  return res.status(200).json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

/**
 * Admin: Toggle coupon active/inactive status
 * PATCH /api/v1/coupons/:id/toggle
 */
export const toggleCouponStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { id: coupon._id, isActive: coupon.isActive },
      `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`
    )
  );
});

/**
 * Admin: Delete a coupon
 * DELETE /api/v1/coupons/:id
 */
export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Coupon deleted successfully"));
});

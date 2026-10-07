// ael_backend/src/routes/coupon.routes.js
import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  validateCoupon,
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "../controllers/coupon.controllers.js";

const router = Router();

// 1. Public / Customer Validation route (rate-limited, optionally authenticated)
router.route("/validate").post(optionalVerifyJWT, validateCoupon);

// 2. Admin Coupon Management
router
  .route("/")
  .get(verifyJWT, checkPermission(["coupons", "subscriptions"], "view"), getCoupons)
  .post(verifyJWT, checkPermission(["coupons", "subscriptions"], "create"), createCoupon);

router
  .route("/:id")
  .get(verifyJWT, checkPermission(["coupons", "subscriptions"], "view"), getCouponById)
  .patch(verifyJWT, checkPermission(["coupons", "subscriptions"], "edit"), updateCoupon)
  .delete(verifyJWT, checkPermission(["coupons", "subscriptions"], "delete"), deleteCoupon);

router
  .route("/:id/toggle")
  .patch(verifyJWT, checkPermission(["coupons", "subscriptions"], "edit"), toggleCouponStatus);

export default router;

import mongoose from "mongoose";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const DEFAULT_SYSTEM_ROLES = [
  {
    name: "super_admin",
    label: "Super Admin",
    description: "Full unrestricted platform administrator with root master authority",
    isSystem: true,
    permissions: [
      { module: "courses", page: "/admin/courses", actions: ["view", "create", "edit", "delete"] },
      { module: "quizzes", page: "/admin/quizzes", actions: ["view", "create", "edit", "delete"] },
      { module: "certificates", page: "/admin/certificates", actions: ["view", "create", "edit", "delete"] },
      { module: "blogs", page: "/admin/blogs", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_market", page: "/admin/pages/market-updates", actions: ["view", "create", "edit", "delete"] },
      { module: "safety_guidelines", page: "/admin/safety-guidelines", actions: ["view", "create", "edit", "delete"] },
      { module: "users", page: "/admin/users", actions: ["view", "create", "edit", "delete"] },
      { module: "roles", page: "/admin/roles", actions: ["view", "create", "edit", "delete"] },
      { module: "messages", page: "/admin/messages", actions: ["view", "create", "edit", "delete"] },
      { module: "comments", page: "/admin/comments", actions: ["view", "create", "edit", "delete"] },
      { module: "advertisements", page: "/admin/advertisements", actions: ["view", "create", "edit", "delete"] },
      { module: "subscriptions", page: "/admin/subscriptions", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_home", page: "/admin/pages/home", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_about", page: "/admin/pages/about", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_contact", page: "/admin/pages/contact", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_safety", page: "/admin/pages/safety-guidelines", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_acts", page: "/admin/pages/acts-and-rules", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_terms", page: "/admin/pages/terms", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_privacy", page: "/admin/pages/privacy", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_faq", page: "/admin/pages/faq", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_subscription", page: "/admin/pages/subscription", actions: ["view", "create", "edit", "delete"] },
      { module: "analytics", page: "/admin", actions: ["view"] },
      { module: "settings", page: "/admin", actions: ["view", "edit"] },
    ],
  },
  {
    name: "admin",
    label: "Admin",
    description: "Operational administrator managing content, catalog, and platform inquiries",
    isSystem: true,
    permissions: [
      { module: "courses", page: "/admin/courses", actions: ["view", "create", "edit"] },
      { module: "blogs", page: "/admin/blogs", actions: ["view", "create", "edit", "delete"] },
      { module: "pages_market", page: "/admin/pages/market-updates", actions: ["view", "create", "edit"] },
      { module: "safety_guidelines", page: "/admin/safety-guidelines", actions: ["view", "create", "edit"] },
      { module: "messages", page: "/admin/messages", actions: ["view", "edit"] },
      { module: "comments", page: "/admin/comments", actions: ["view", "edit", "delete"] },
      { module: "subscriptions", page: "/admin/subscriptions", actions: ["view"] },
      { module: "pages_faq", page: "/admin/pages/faq", actions: ["view", "edit"] },
      { module: "pages_subscription", page: "/admin/pages/subscription", actions: ["view", "edit"] },
      { module: "analytics", page: "/admin", actions: ["view"] },
    ],
  },
  {
    name: "instructor",
    label: "Instructor",
    description: "Course instructor with access to training curricula, lessons, and student progress",
    isSystem: true,
    permissions: [
      { module: "courses", page: "/admin/courses", actions: ["view", "create", "edit"] },
    ],
  },
  {
    name: "subscriber",
    label: "Subscriber",
    description: "Paid subscription tier member with access to certified modules, training, and reports",
    isSystem: true,
    permissions: [],
  },
  {
    name: "user",
    label: "General Citizen / User",
    description: "Standard registered citizen user with public platform access",
    isSystem: true,
    permissions: [],
  },
];

/**
 * Get all configured roles and their permission matrices
 */
export const getAllRoles = asyncHandler(async (req, res) => {
  let count = await Role.countDocuments();
  if (count === 0) {
    try {
      await Role.insertMany(DEFAULT_SYSTEM_ROLES);
    } catch {
      // Ignore parallel insertion conflict
    }
  }

  const roles = await Role.find().sort({ isSystem: -1, createdAt: 1 }).lean();

  // Aggregate user counts per role
  const userCounts = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);
  const countMap = {};
  userCounts.forEach((c) => {
    if (c._id) countMap[c._id.toLowerCase()] = c.count;
  });

  const enrichedRoles = roles.map((role) => ({
    ...role,
    userCount: countMap[role.name.toLowerCase()] || 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, enrichedRoles, "Roles fetched successfully"));
});

/**
 * Get single role details by ID or Name
 */
export const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let role;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    role = await Role.findById(id);
  }
  if (!role && id) {
    role = await Role.findOne({ name: id.toLowerCase().trim() });
  }

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, role, "Role details fetched successfully"));
});

/**
 * Create a new custom role (Super Admin only)
 */
export const createRole = asyncHandler(async (req, res) => {
  const { name, label, description, permissions } = req.body;

  if (!name || !label) {
    throw new ApiError(400, "Role name and display label are required");
  }

  const normalizedName = name.toLowerCase().trim().replace(/\s+/g, "_");
  const existingRole = await Role.findOne({ name: normalizedName });

  if (existingRole) {
    throw new ApiError(409, `Role '${normalizedName}' already exists`);
  }

  const role = await Role.create({
    name: normalizedName,
    label,
    description: description || "",
    isSystem: false,
    permissions: permissions || [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, role, "Custom role created successfully"));
});

/**
 * Update role permissions matrix (Super Admin only)
 */
export const updateRolePermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { label, description, permissions } = req.body;

  let role;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    role = await Role.findById(id);
  }
  if (!role && id) {
    role = await Role.findOne({ name: id.toLowerCase().trim() });
  }

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (label) role.label = label;
  if (description !== undefined) role.description = description;
  if (permissions) role.permissions = permissions;

  await role.save();

  return res
    .status(200)
    .json(new ApiResponse(200, role, "Role permissions updated successfully"));
});

/**
 * Delete a custom role (Cannot delete system roles)
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let role;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    role = await Role.findById(id);
  }
  if (!role && id) {
    role = await Role.findOne({ name: id.toLowerCase().trim() });
  }

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (role.isSystem) {
    throw new ApiError(403, "System roles cannot be deleted");
  }

  const usersWithRole = await User.countDocuments({ role: role.name });
  if (usersWithRole > 0) {
    throw new ApiError(
      400,
      `Cannot delete role '${role.label || role.name}' because ${usersWithRole} user(s) are currently assigned to this role. Please reassign those users first.`
    );
  }

  await Role.findByIdAndDelete(role._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Role deleted successfully"));
});

/**
 * Get current authenticated user's permissions
 */
export const getMyPermissions = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  // Super Admin has master permissions
  if (user.role === "super_admin") {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          role: user.role,
          isSuperAdmin: true,
          permissions: [
            { module: "courses", page: "/admin/courses", actions: ["view", "create", "edit", "delete"] },
            { module: "quizzes", page: "/admin/quizzes", actions: ["view", "create", "edit", "delete"] },
            { module: "certificates", page: "/admin/certificates", actions: ["view", "create", "edit", "delete"] },
            { module: "blogs", page: "/admin/blogs", actions: ["view", "create", "edit", "delete"] },
            { module: "market_updates", page: "/admin/pages/market-updates", actions: ["view", "create", "edit", "delete"] },
            { module: "users", page: "/admin/users", actions: ["view", "create", "edit", "delete"] },
            { module: "messages", page: "/admin/messages", actions: ["view", "create", "edit", "delete"] },
            { module: "comments", page: "/admin/comments", actions: ["view", "create", "edit", "delete"] },
            { module: "advertisements", page: "/admin/advertisements", actions: ["view", "create", "edit", "delete"] },
            { module: "archive", page: "/admin/archive", actions: ["view", "create", "edit", "delete"] },
            { module: "sms", page: "/admin/sms", actions: ["view", "create", "edit", "delete"] },
            { module: "email", page: "/admin/email", actions: ["view", "create", "edit", "delete"] },
            { module: "subscriptions", page: "/admin/subscriptions", actions: ["view", "create", "edit", "delete"] },
            { module: "database", page: "/admin/database", actions: ["view", "create", "edit", "delete"] },
            { module: "analytics", page: "/admin", actions: ["view"] },
            { module: "settings", page: "/admin", actions: ["view", "edit"] },
          ],
        },
        "User permissions resolved (Master Super Admin)"
      )
    );
  }

  // Check if user has explicit custom permissions assigned
  if (user.permissions && user.permissions.length > 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          role: user.role,
          isSuperAdmin: false,
          permissions: user.permissions,
        },
        "User specific page permissions resolved"
      )
    );
  }

  const role = await Role.findOne({ name: user.role });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        role: user.role,
        isSuperAdmin: false,
        permissions: role ? role.permissions : [],
      },
      "User permissions resolved successfully"
    )
  );
});

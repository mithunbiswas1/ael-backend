// ael_backend/src/middlewares/permission.middlewares.js

import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to enforce granular role-based permissions
 * @param {string} moduleName - The module name ('blogs', 'courses', 'roles', etc.)
 * @param {string} action - The action ('view', 'create', 'edit', 'delete')
 */
export const checkPermission = (moduleName, action) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    // Super Admin has master authority across all modules
    if (user.role === "super_admin") {
      return next();
    }

    const modules = Array.isArray(moduleName) ? moduleName : [moduleName];
    const norm = (s) => (s ? String(s).toLowerCase().replace(/[-_]/g, "") : "");

    // If user has specific granular permissions assigned (e.g. Admin with custom page control)
    if (Array.isArray(user.permissions) && user.permissions.length > 0) {
      const userPerm = user.permissions.find(
        (p) =>
          modules.some((m) => norm(p.module) === norm(m)) ||
          modules.some((m) => p.page && (norm(p.page).includes(norm(m)) || p.page === `/admin/${m}`))
      );

      if (userPerm && userPerm.actions && userPerm.actions.includes(action)) {
        return next();
      }

      // If user is admin and requested module is subscriptions or coupons or roles, allow access
      if (user.role === "admin" && (modules.includes("subscriptions") || modules.includes("coupons") || modules.includes("roles"))) {
        return next();
      }

      throw new ApiError(
        403,
        `Permission denied: Insufficient privileges to perform '${action}' on '${Array.isArray(moduleName) ? moduleName.join("/") : moduleName}'`
      );
    }

    // If admin without specific custom permission restrictions, allow standard admin access
    if (user.role === "admin") {
      return next();
    }

    // Resolve user's role configuration from DB
    const userRole = await Role.findOne({ name: user.role });

    if (!userRole) {
      throw new ApiError(403, "Access denied: Role definition not found");
    }

    // Find permissions for the requested module or page
    const modulePermission = userRole.permissions.find(
      (p) =>
        modules.some((m) => norm(p.module) === norm(m)) ||
        modules.some((m) => p.page && (norm(p.page).includes(norm(m)) || p.page === `/admin/${m}`))
    );

    if (!modulePermission || !modulePermission.actions.includes(action)) {
      throw new ApiError(
        403,
        `Permission denied: Insufficient privileges to perform '${action}' on '${Array.isArray(moduleName) ? moduleName.join("/") : moduleName}'`
      );
    }

    next();
  });
};

/**
 * Middleware to require specific role(s)
 * @param  {...string} roles
 */
export const requireRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    if (user.role === "super_admin" || roles.includes(user.role)) {
      return next();
    }

    throw new ApiError(
      403,
      `Access denied: Required role is [${roles.join(", ")}]`
    );
  });
};

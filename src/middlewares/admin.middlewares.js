// src/middlewares/admin.middlewares.js

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized access");
  }

  if (user.role === "admin" || user.role === "super_admin") {
    return next();
  }

  // Allow instructors and authorized staff with custom page permissions
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return next();
  }

  throw new ApiError(403, "Admin access required");
});

export { verifyAdmin };

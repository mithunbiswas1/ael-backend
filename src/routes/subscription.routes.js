// ael_backend/src/routes/subscription.routes.js

import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getSubscriptionPlans,
  getAdminSubscriptionPlans,
  createSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  initiateCheckout,
  getMySubscriptionDetails,
  assignUserSubscription,
  revokeUserSubscription,
  getAdminSubscriptions,
  refundSubscription,
} from "../controllers/subscription.controllers.js";

const router = Router();

// Public / User routes
router.route("/plans").get(getSubscriptionPlans);
router.route("/checkout").post(optionalVerifyJWT, initiateCheckout);
router.route("/my").get(verifyJWT, getMySubscriptionDetails);

// Admin Plans Management
router
  .route("/admin/plans")
  .get(verifyJWT, checkPermission(["subscriptions", "roles"], "view"), getAdminSubscriptionPlans)
  .post(verifyJWT, checkPermission(["subscriptions", "roles"], "create"), createSubscriptionPlan);

router
  .route("/admin/plans/:id")
  .get(verifyJWT, checkPermission(["subscriptions", "roles"], "view"), getSubscriptionPlanById)
  .patch(verifyJWT, checkPermission(["subscriptions", "roles"], "edit"), updateSubscriptionPlan)
  .delete(verifyJWT, checkPermission(["subscriptions", "roles"], "delete"), deleteSubscriptionPlan);

// Admin User Subscription Manual Assignment & Revocation
router
  .route("/admin/assign")
  .post(verifyJWT, checkPermission(["subscriptions", "roles"], "edit"), assignUserSubscription);

router
  .route("/admin/revoke/:userId")
  .post(verifyJWT, checkPermission(["subscriptions", "roles"], "edit"), revokeUserSubscription);

// Root admin alias
router
  .route("/")
  .get(verifyJWT, checkPermission(["subscriptions", "roles"], "view"), getAdminSubscriptions);

// Admin Transactions & Audit
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission(["subscriptions", "roles"], "view"), getAdminSubscriptions);

router
  .route("/admin/:id/refund")
  .post(verifyJWT, checkPermission(["subscriptions", "roles"], "edit"), refundSubscription);

export default router;

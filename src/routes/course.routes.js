// ael_backend/src/routes/course.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getCourses,
  getAdminCourses,
  getCourseEnrollmentHistory,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyEnrolledCourses,
  enrollInCourse,
  uploadCourseVideo,
  uploadCourseImage,
  uploadCoursePdf,
  updateCourseProgress,
  submitModuleQuiz,
} from "../controllers/course.controllers.js";
import { upload, uploadVideo } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes
router.route("/").get(getCourses);

// Admin / Instructor courses management
router
  .route("/admin-list")
  .get(verifyJWT, checkPermission("courses", "view"), getAdminCourses);

// Instructor / Admin enrollment and sales history
router
  .route("/instructor/enrollments")
  .get(verifyJWT, checkPermission("courses", "view"), getCourseEnrollmentHistory);

// Media Upload Routes (Admin only)
router
  .route("/upload-image")
  .post(
    verifyJWT,
    checkPermission("courses", "create"),
    upload.single("image"),
    uploadCourseImage
  );

router
  .route("/upload-video")
  .post(
    verifyJWT,
    checkPermission("courses", "create"),
    (req, res, next) => {
      // Allow up to 15 minutes for large 1GB video uploads without timeout
      req.setTimeout(15 * 60 * 1000);
      res.setTimeout(15 * 60 * 1000);
      uploadVideo.single("video")(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              statusCode: 400,
              data: null,
              message: "ভিডিও ফাইল সাইজ সর্বোচ্চ ১জিবি (1GB) হতে পারবে। / Video file exceeds 1GB limit.",
              success: false,
            });
          }
          return res.status(400).json({
            statusCode: 400,
            data: null,
            message: err.message || "ভিডিও ফাইল আপলোড ব্যর্থ হয়েছে। / Failed to upload video.",
            success: false,
          });
        }
        next();
      });
    },
    uploadCourseVideo
  );

router
  .route("/upload-pdf")
  .post(
    verifyJWT,
    checkPermission("courses", "create"),
    upload.single("pdf"),
    uploadCoursePdf
  );

// Subscriber / Learner authenticated routes
router.route("/subscriber/my-learning").get(verifyJWT, getMyEnrolledCourses);
router.route("/subscriber/enroll").post(verifyJWT, enrollInCourse);
router.route("/:id/progress").post(verifyJWT, updateCourseProgress);
router.route("/:id/module-quiz").post(verifyJWT, submitModuleQuiz);

// Single course details (after explicit static routes)
router.route("/:id").get(getCourseById);

// Admin routes
router
  .route("/")
  .post(verifyJWT, checkPermission("courses", "create"), createCourse);

router
  .route("/:id")
  .patch(verifyJWT, checkPermission("courses", "edit"), updateCourse)
  .delete(verifyJWT, checkPermission("courses", "delete"), deleteCourse);

export default router;

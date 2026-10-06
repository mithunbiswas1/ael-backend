// ael_backend/src/routes/quiz.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getQuizByCourseId,
  getQuizForAttempt,
  submitQuiz,
  saveQuiz,
  getAllQuizzes,
  deleteQuiz,
  getQuestionBank,
  addQuestionToBank,
  updateQuestionInBank,
  deleteQuestionFromBank,
  updateQuizSettings,
} from "../controllers/quiz.controllers.js";

const router = Router();

// Public / Learner routes
router.route("/course/:courseId").get(getQuizByCourseId);
router.route("/course/:courseId/attempt").get(verifyJWT, getQuizForAttempt);
router.route("/submit").post(verifyJWT, submitQuiz);

// Admin Question Bank & Configuration routes
router
  .route("/admin/:courseId/questions")
  .get(verifyJWT, checkPermission("quizzes", "view"), getQuestionBank)
  .post(verifyJWT, checkPermission("quizzes", "create"), addQuestionToBank);

router
  .route("/admin/:courseId/questions/:questionId")
  .put(verifyJWT, checkPermission("quizzes", "edit"), updateQuestionInBank)
  .delete(verifyJWT, checkPermission("quizzes", "delete"), deleteQuestionFromBank);

router
  .route("/admin/:courseId/settings")
  .put(verifyJWT, checkPermission("quizzes", "edit"), updateQuizSettings);

// General Admin routes
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission("quizzes", "view"), getAllQuizzes);

router
  .route("/save")
  .post(verifyJWT, checkPermission("quizzes", "create"), saveQuiz);

router
  .route("/:id")
  .delete(verifyJWT, checkPermission("quizzes", "delete"), deleteQuiz);

export default router;

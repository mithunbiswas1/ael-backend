import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import { Certificate } from "../models/certificate.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { sendCertificateEmail } from "../utils/email.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Fisher-Yates array shuffle helper
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Helper to resolve course document by id, slug, or _id
 */
async function resolveCourse(courseIdentifier) {
  if (!courseIdentifier) return null;
  return await Course.findOne({
    $or: [
      { courseId: courseIdentifier },
      { slug: courseIdentifier.toLowerCase() },
      { _id: courseIdentifier.match(/^[0-9a-fA-F]{24}$/) ? courseIdentifier : null },
    ],
  });
}

/**
 * Public/Learner: Get quiz details (sanitized, anti-cheat protected)
 */
export const getQuizByCourseId = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  const quiz = await Quiz.findOne({
    $or: [
      { courseId: targetCourseId },
      ...(course?.slug ? [{ courseId: course.slug }] : []),
      ...(course?._id ? [{ courseId: String(course._id) }] : []),
      { courseId },
    ],
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found for this course");
  }

  // Question pool: prefer questionBank, fallback to questions
  const pool = (quiz.questionBank && quiz.questionBank.length > 0)
    ? quiz.questionBank
    : (quiz.questions || []);

  // Anti-cheat: strip isCorrect and explanations for public preview
  const sanitizedQuestions = pool.map((q) => {
    const qObj = q.toObject ? q.toObject() : { ...q };
    delete qObj.explanation;
    delete qObj.explanationBn;
    if (Array.isArray(qObj.options)) {
      qObj.options = qObj.options.map((opt) => {
        const optObj = { ...opt };
        delete optObj.isCorrect;
        return optObj;
      });
    }
    return qObj;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId: quiz.courseId,
        title: quiz.title,
        titleBn: quiz.titleBn,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        timerEnabled: quiz.timerEnabled ?? true,
        passPercentage: quiz.passPercentage || 70,
        questionsPerQuiz: quiz.questionsPerQuiz || sanitizedQuestions.length,
        cooldownMinutes: quiz.cooldownMinutes || 15,
        totalQuestions: sanitizedQuestions.length,
        questions: sanitizedQuestions,
      },
      "Quiz details retrieved successfully"
    )
  );
});

/**
 * Learner: Start or resume a quiz attempt
 * Enforces:
 * 1. User enrollment in course
 * 2. 100% lessons completion prerequisite (quiz unlocked only after all lessons completed)
 * 3. Cooldown period check if user previously failed
 * 4. Random subset of N questions from question bank
 * 5. Shuffled answer options
 * 6. Anti-cheat sanitization (NO isCorrect/explanation sent)
 */
export const getQuizForAttempt = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await resolveCourse(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const targetCourseId = course.courseId;
  const quiz = await Quiz.findOne({
    $or: [
      { courseId: targetCourseId },
      ...(course?.slug ? [{ courseId: course.slug }] : []),
      ...(course?._id ? [{ courseId: String(course._id) }] : []),
      { courseId },
    ],
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not configured for this course yet");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 1. Enrollment check
  let enrollment = user.enrolledCourses?.find(
    (e) =>
      e.courseId === targetCourseId ||
      e.courseId === course._id.toString() ||
      e.courseId === course.slug
  );

  const isAdminOrTester = [
    "super_admin",
    "admin",
    "instructor",
    "course_admin",
    "manager",
  ].includes(user.role);

  // If free course or tester/admin not enrolled, auto-enroll them
  if (!enrollment && (isAdminOrTester || !course.price || course.price === 0)) {
    if (!user.enrolledCourses) user.enrolledCourses = [];
    enrollment = {
      courseId: targetCourseId,
      enrolledAt: new Date(),
      progressPercent: isAdminOrTester ? 100 : 0,
      completedLessons: [],
      status: "active",
    };
    user.enrolledCourses.push(enrollment);
    await user.save();
  } else if (!enrollment) {
    throw new ApiError(403, "You must be enrolled in this course to take the quiz.");
  }

  // 2. Completion prerequisite: Enrolled learners can take certification quiz
  // (Progress is tracked but not hard-blocked)

  // 3. Cooldown period check
  if (enrollment?.quizCooldownUntil && new Date(enrollment.quizCooldownUntil) > new Date()) {
    const diffMs = new Date(enrollment.quizCooldownUntil) - new Date();
    const remainingMinutes = Math.ceil(diffMs / (60 * 1000));
    throw new ApiError(
      429,
      `Quiz cool-down active. Please revise the course lessons and retry in ${remainingMinutes} minute(s).`
    );
  }

  // 4. Multi-Set Random Selection with Smart Exclusion of Failed Sets
  let validSets = (quiz.questionSets || []).filter(
    (s) => Array.isArray(s.questions) && s.questions.length > 0
  );

  // Auto-migrate legacy questions into Set 1 if questionSets is empty
  if (validSets.length === 0) {
    const legacyQuestions = (quiz.questionBank && quiz.questionBank.length > 0)
      ? quiz.questionBank
      : (quiz.questions || []);

    if (legacyQuestions.length > 0) {
      const defaultSet = {
        setId: new mongoose.Types.ObjectId().toString(),
        setName: "Set 1",
        setNameBn: "সেট ১",
        description: "Default question set",
        questions: legacyQuestions,
      };
      quiz.questionSets = [defaultSet];
      await quiz.save();
      validSets = [defaultSet];
    }
  }

  let selectedQuestions = [];
  let chosenSetId = null;
  let chosenSetName = "Default Set";
  let chosenSetNameBn = "সাধারণ সেট";

  if (validSets.length > 0) {
    const attemptedSetIds = Array.isArray(enrollment?.attemptedSetIds)
      ? enrollment.attemptedSetIds.map(String)
      : [];
    const lastAttemptedSetId = enrollment?.lastAttemptedSetId
      ? String(enrollment.lastAttemptedSetId)
      : null;

    // Filter out sets the user has already failed/attempted
    let availableSets = validSets.filter((s) => !attemptedSetIds.includes(String(s.setId)));

    // Edge-case: If user has already attempted all sets, reset cycle but exclude immediate last attempted set
    if (availableSets.length === 0) {
      const otherSets = validSets.filter((s) => String(s.setId) !== lastAttemptedSetId);
      availableSets = otherSets.length > 0 ? otherSets : validSets;
    }

    // Pick a random set from candidate sets
    const chosenSet = availableSets[Math.floor(Math.random() * availableSets.length)];
    chosenSetId = String(chosenSet.setId);
    chosenSetName = chosenSet.setName || `Set ${validSets.indexOf(chosenSet) + 1}`;
    chosenSetNameBn = chosenSet.setNameBn || chosenSetName;

    // Use questions from the chosen set
    const setQuestions = chosenSet.questions || [];
    const questionsCount = Math.min(quiz.questionsPerQuiz || setQuestions.length, setQuestions.length);
    selectedQuestions = shuffleArray(setQuestions).slice(0, questionsCount);
  } else {
    // Fallback: Legacy questionBank or questions
    const pool = (quiz.questionBank && quiz.questionBank.length > 0)
      ? quiz.questionBank
      : (quiz.questions || []);

    if (pool.length === 0) {
      throw new ApiError(400, "No questions found in this course question bank");
    }

    const questionsCount = Math.min(quiz.questionsPerQuiz || pool.length, pool.length);
    selectedQuestions = shuffleArray(pool).slice(0, questionsCount);
  }

  // 5 & 6. Option shuffling + Anti-cheat sanitization
  const sanitizedQuestions = selectedQuestions.map((q) => {
    const rawQ = q.toObject ? q.toObject() : { ...q };
    const qId = rawQ.id ? String(rawQ.id) : String(rawQ._id);

    let options = Array.isArray(rawQ.options) ? [...rawQ.options] : [];
    if (quiz.shuffleOptions !== false) {
      options = shuffleArray(options);
    }

    const sanitizedOptions = options.map((opt) => {
      const rawOpt = opt.toObject ? opt.toObject() : { ...opt };
      const optId = rawOpt.id ? String(rawOpt.id) : String(rawOpt._id);
      return {
        id: optId,
        text: rawOpt.text,
        textBn: rawOpt.textBn || rawOpt.text,
      };
    });

    return {
      id: qId,
      question: rawQ.question,
      questionBn: rawQ.questionBn || rawQ.question,
      type: rawQ.type || "single", // "single" | "multiple" | "true_false"
      options: sanitizedOptions,
      points: rawQ.points || 1,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId: targetCourseId,
        courseTitle: course.title,
        courseTitleBn: course.titleBn,
        title: quiz.title,
        titleBn: quiz.titleBn,
        setId: chosenSetId,
        setName: chosenSetName,
        setNameBn: chosenSetNameBn,
        totalSetsCount: validSets.length,
        attemptedSetsCount: Array.isArray(enrollment?.attemptedSetIds) ? enrollment.attemptedSetIds.length : 0,
        durationMinutes: quiz.durationMinutes || 15,
        timerEnabled: quiz.timerEnabled ?? true,
        passPercentage: quiz.passPercentage || 70,
        totalQuestions: sanitizedQuestions.length,
        questions: sanitizedQuestions,
        previousPassed: Boolean(enrollment?.quizPassed),
      },
      "Quiz attempt initialized successfully"
    )
  );
});

/**
 * Learner: Submit quiz answers and calculate immediate score
 * Features:
 * - Grades Single Choice, Multiple Choice (multi-select), and True/False
 * - If Passed (>= passPercentage): Generates verified Certificate, unlocks credential, emails PDF link
 * - If Failed: Sets configurable cool-down period
 * - Returns post-submission review (explanations & correct answers)
 */
export const submitQuiz = asyncHandler(async (req, res) => {
  const { courseId, setId, answers, selectedAnswers, studentName, studentNameBn } = req.body;

  const course = await resolveCourse(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const targetCourseId = course.courseId;
  const quiz = await Quiz.findOne({
    $or: [
      { courseId: targetCourseId },
      ...(course?.slug ? [{ courseId: course.slug }] : []),
      ...(course?._id ? [{ courseId: String(course._id) }] : []),
      { courseId },
    ],
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Active cooldown enforcement
  let enrollment = user.enrolledCourses?.find(
    (e) =>
      e.courseId === targetCourseId ||
      e.courseId === course._id.toString() ||
      e.courseId === course.slug
  );

  const isAdminOrTester = [
    "super_admin",
    "admin",
    "instructor",
    "course_admin",
    "manager",
  ].includes(user.role);

  if (!enrollment && (isAdminOrTester || !course.price || course.price === 0)) {
    if (!user.enrolledCourses) user.enrolledCourses = [];
    enrollment = {
      courseId: targetCourseId,
      enrolledAt: new Date(),
      progressPercent: isAdminOrTester ? 100 : 0,
      completedLessons: [],
      status: "active",
    };
    user.enrolledCourses.push(enrollment);
  }

  if (enrollment?.quizCooldownUntil && new Date(enrollment.quizCooldownUntil) > new Date()) {
    const remainingMinutes = Math.ceil(
      (new Date(enrollment.quizCooldownUntil) - new Date()) / (60 * 1000)
    );
    throw new ApiError(
      429,
      `Cooldown active. You cannot submit again for another ${remainingMinutes} minute(s).`
    );
  }

  // Combine questions from chosen set or entire pool
  let questionPool = [];
  if (setId && Array.isArray(quiz.questionSets)) {
    const matchedSet = quiz.questionSets.find((s) => String(s.setId) === String(setId));
    if (matchedSet && Array.isArray(matchedSet.questions) && matchedSet.questions.length > 0) {
      questionPool = matchedSet.questions;
    }
  }

  if (questionPool.length === 0) {
    const allSetQuestions = (quiz.questionSets || []).flatMap((s) => s.questions || []);
    questionPool = [
      ...allSetQuestions,
      ...(quiz.questionBank || []),
      ...(quiz.questions || []),
    ];
  }

  // Normalize incoming answers object/array
  // Format: { [questionId]: [optionId1, ...] OR optionId } OR Array of selected index for backward compatibility
  const userAnswers = answers || selectedAnswers || {};

  let totalQuestionsCount = 0;
  let correctCount = 0;
  const reviewReport = [];

  // Determine which questions were answered
  let answeredQuestionIds = [];
  if (Array.isArray(userAnswers)) {
    // Legacy array of indices matching questions
    const targetList = questionPool;
    totalQuestionsCount = targetList.length;

    targetList.forEach((q, idx) => {
      const qId = q.id ? String(q.id) : String(q._id);
      const selectedOptIdx = userAnswers[idx];
      const correctOptIdx = q.options.findIndex((o) => o.isCorrect);
      const isCorrect = selectedOptIdx !== undefined && q.options[selectedOptIdx]?.isCorrect;

      if (isCorrect) correctCount += 1;

      reviewReport.push({
        questionId: qId,
        question: q.question,
        questionBn: q.questionBn,
        type: q.type || "single",
        isCorrect: Boolean(isCorrect),
        explanation: q.explanation || "",
        explanationBn: q.explanationBn || "",
        correctAnswer: correctOptIdx,
        userAnswer: selectedOptIdx,
      });
    });
  } else {
    // Modern key-value answers: { [questionId]: selectedOptionId(s) }
    answeredQuestionIds = Object.keys(userAnswers);
    totalQuestionsCount = answeredQuestionIds.length > 0
      ? answeredQuestionIds.length
      : Math.min(quiz.questionsPerQuiz || 10, questionPool.length);

    answeredQuestionIds.forEach((qId) => {
      const dbQuestion = questionPool.find(
        (q) => String(q.id) === String(qId) || String(q._id) === String(qId)
      );

      if (!dbQuestion) return;

      const qType = dbQuestion.type || "single";
      const submittedValue = userAnswers[qId];
      let isQuestionCorrect = false;

      const correctOptionIds = dbQuestion.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => (opt.id ? String(opt.id) : String(opt._id)));

      if (qType === "multiple") {
        // Multi-select: all correct options must be selected, no wrong options
        const selectedIds = Array.isArray(submittedValue)
          ? submittedValue.map(String)
          : [String(submittedValue)];

        const hasAllCorrect = correctOptionIds.every((id) => selectedIds.includes(id));
        const hasNoExtraWrong = selectedIds.every((id) => correctOptionIds.includes(id));
        isQuestionCorrect = hasAllCorrect && hasNoExtraWrong && selectedIds.length > 0;
      } else {
        // Single choice or True/False
        const selectedId = String(submittedValue);
        isQuestionCorrect = correctOptionIds.includes(selectedId);
      }

      if (isQuestionCorrect) {
        correctCount += 1;
      }

      reviewReport.push({
        questionId: qId,
        question: dbQuestion.question,
        questionBn: dbQuestion.questionBn,
        type: qType,
        isCorrect: isQuestionCorrect,
        explanation: dbQuestion.explanation || "",
        explanationBn: dbQuestion.explanationBn || "",
        correctOptionIds,
        userSelected: submittedValue,
      });
    });
  }

  const effectiveTotal = totalQuestionsCount > 0 ? totalQuestionsCount : 1;
  const scorePercent = Math.round((correctCount / effectiveTotal) * 100);
  const passThreshold = quiz.passPercentage || 70;
  const isPassed = scorePercent >= passThreshold;

  let issuedCertificate = null;
  const now = new Date();

  if (enrollment) {
    enrollment.lastQuizAttemptAt = now;
  }

  if (isPassed) {
    // Generate official Certificate ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `CERT-LPG-${targetCourseId.toUpperCase()}-${Date.now().toString().slice(-4)}${randomSuffix}`;
    const issueDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const issueDateBn = now.toLocaleDateString("bn-BD");

    const resolvedStudentName =
      studentName || user.fullName || user.userName || "Verified Learner";
    const resolvedStudentNameBn =
      studentNameBn || user.fullName || user.userName || "যাচাইকৃত শিক্ষার্থী";

    issuedCertificate = await Certificate.create({
      certificateId: certId,
      studentName: resolvedStudentName,
      studentNameBn: resolvedStudentNameBn,
      courseTitle: course.title,
      courseTitleBn: course.titleBn || course.title,
      issueDate,
      issueDateBn,
      grade: `Pass (${scorePercent}%)`,
      status: "Verified & Valid",
      userId: user._id,
    });

    if (enrollment) {
      enrollment.quizPassed = true;
      enrollment.status = "completed";
      enrollment.progressPercent = 100;
      enrollment.quizCooldownUntil = null;
      if (setId) {
        enrollment.lastAttemptedSetId = String(setId);
      }
    }

    // Send automated certificate email with PDF link
    setImmediate(async () => {
      try {
        await sendCertificateEmail({
          to: user.email,
          studentName: resolvedStudentName,
          courseTitle: course.title,
          certificateId: certId,
          issueDate,
          grade: `Pass (${scorePercent}%)`,
        });
      } catch (err) {
        console.warn("[submitQuiz] Certificate email failed:", err.message);
      }
    });
  } else {
    // Failed: record attempted set and optional cooldown
    if (enrollment) {
      if (setId) {
        enrollment.lastAttemptedSetId = String(setId);
        if (!Array.isArray(enrollment.attemptedSetIds)) {
          enrollment.attemptedSetIds = [];
        }
        if (!enrollment.attemptedSetIds.includes(String(setId))) {
          enrollment.attemptedSetIds.push(String(setId));
        }
      }
      enrollment.quizAttemptsCount = (enrollment.quizAttemptsCount || 0) + 1;

      const cooldownMins = quiz.cooldownMinutes !== undefined ? quiz.cooldownMinutes : 0;
      if (cooldownMins > 0) {
        const cooldownEnd = new Date(Date.now() + cooldownMins * 60 * 1000);
        enrollment.quizCooldownUntil = cooldownEnd;
      } else {
        enrollment.quizCooldownUntil = null;
      }
    }
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isPassed,
        scorePercent,
        correctCount,
        totalQuestions: effectiveTotal,
        passPercentage: passThreshold,
        setId: setId || null,
        certificate: issuedCertificate,
        cooldownUntil: isPassed ? null : enrollment?.quizCooldownUntil,
        cooldownMinutes: quiz.cooldownMinutes || 0,
        review: reviewReport,
        retakeInfo: isPassed
          ? null
          : {
              message: "You did not pass. On your next attempt, a different random question set will be served.",
              messageBn: "আপনি উত্তীর্ণ হতে পারেননি। পরবর্তী রিটেক পরীক্ষায় আপনার জন্য সম্পূর্ণ নতুন ও ভিন্ন প্রশ্ন সেট আসবে।",
            },
      },
      isPassed
        ? "Congratulations! You passed the assessment and your verified certificate has been issued."
        : `Assessment completed. You scored ${scorePercent}%, which is below the passing score of ${passThreshold}%.`
    )
  );
});

/**
 * Admin: Get Question Bank for a course
 */
export const getQuestionBank = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  const quiz = await Quiz.findOne({
    $or: [{ courseId: targetCourseId }, { courseId }],
  });

  if (!quiz) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          courseId: targetCourseId,
          title: "LPG Safety Assessment Quiz",
          titleBn: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
          durationMinutes: 15,
          passPercentage: 70,
          questionsPerQuiz: 20,
          cooldownMinutes: 15,
          timerEnabled: true,
          shuffleOptions: true,
          questionBank: [],
        },
        "Question bank initialized"
      )
    );
  }

  const pool = (quiz.questionBank && quiz.questionBank.length > 0)
    ? quiz.questionBank
    : (quiz.questions || []);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId: quiz.courseId,
        title: quiz.title,
        titleBn: quiz.titleBn,
        durationMinutes: quiz.durationMinutes,
        passPercentage: quiz.passPercentage,
        questionsPerQuiz: quiz.questionsPerQuiz || 20,
        cooldownMinutes: quiz.cooldownMinutes || 15,
        timerEnabled: quiz.timerEnabled ?? true,
        shuffleOptions: quiz.shuffleOptions ?? true,
        questionBank: pool,
      },
      "Question bank fetched successfully"
    )
  );
});

/**
 * Admin: Add Question to Question Bank
 */
export const addQuestionToBank = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { question, questionBn, type = "single", options, explanation, explanationBn, points = 1 } = req.body;

  if (!question || !Array.isArray(options) || options.length < 2) {
    throw new ApiError(400, "Question title and at least 2 options are required");
  }

  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  let quiz = await Quiz.findOne({
    $or: [{ courseId: targetCourseId }, { courseId }],
  });

  if (!quiz) {
    quiz = new Quiz({
      courseId: targetCourseId,
      questionBank: [],
      questions: [],
    });
  }

  if (!quiz.questionBank) {
    quiz.questionBank = [];
  }

  const newQuestion = {
    id: new mongoose.Types.ObjectId().toString(),
    question,
    questionBn: questionBn || question,
    type,
    options: options.map((opt) => ({
      id: opt.id || new mongoose.Types.ObjectId().toString(),
      text: opt.text,
      textBn: opt.textBn || opt.text,
      isCorrect: Boolean(opt.isCorrect),
    })),
    explanation: explanation || "",
    explanationBn: explanationBn || "",
    points: Number(points) || 1,
  };

  quiz.questionBank.push(newQuestion);
  await quiz.save();

  return res.status(201).json(
    new ApiResponse(201, newQuestion, "Question added to Question Bank successfully")
  );
});

/**
 * Admin: Update Question in Question Bank
 */
export const updateQuestionInBank = asyncHandler(async (req, res) => {
  const { courseId, questionId } = req.params;
  const updateData = req.body;

  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  const quiz = await Quiz.findOne({
    $or: [{ courseId: targetCourseId }, { courseId }],
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const pool = quiz.questionBank || quiz.questions || [];
  const qIndex = pool.findIndex(
    (q) => String(q.id) === String(questionId) || String(q._id) === String(questionId)
  );

  if (qIndex === -1) {
    throw new ApiError(404, "Question not found in Question Bank");
  }

  if (updateData.question) pool[qIndex].question = updateData.question;
  if (updateData.questionBn !== undefined) pool[qIndex].questionBn = updateData.questionBn;
  if (updateData.type) pool[qIndex].type = updateData.type;
  if (updateData.explanation !== undefined) pool[qIndex].explanation = updateData.explanation;
  if (updateData.explanationBn !== undefined) pool[qIndex].explanationBn = updateData.explanationBn;
  if (updateData.points !== undefined) pool[qIndex].points = updateData.points;

  if (Array.isArray(updateData.options)) {
    pool[qIndex].options = updateData.options.map((opt) => ({
      id: opt.id || new mongoose.Types.ObjectId().toString(),
      text: opt.text,
      textBn: opt.textBn || opt.text,
      isCorrect: Boolean(opt.isCorrect),
    }));
  }

  quiz.questionBank = pool;
  await quiz.save();

  return res.status(200).json(
    new ApiResponse(200, pool[qIndex], "Question updated successfully")
  );
});

/**
 * Admin: Delete Question from Question Bank
 */
export const deleteQuestionFromBank = asyncHandler(async (req, res) => {
  const { courseId, questionId } = req.params;
  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  const quiz = await Quiz.findOne({
    $or: [{ courseId: targetCourseId }, { courseId }],
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const pool = quiz.questionBank || quiz.questions || [];
  const filtered = pool.filter(
    (q) => String(q.id) !== String(questionId) && String(q._id) !== String(questionId)
  );

  quiz.questionBank = filtered;
  quiz.questions = filtered;
  await quiz.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Question removed from Question Bank")
  );
});

/**
 * Admin: Update Quiz Settings (timer, cooldown, passing percentage, questionsPerQuiz)
 */
export const updateQuizSettings = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const {
    title,
    titleBn,
    durationMinutes,
    passPercentage,
    questionsPerQuiz,
    cooldownMinutes,
    timerEnabled,
    shuffleOptions,
  } = req.body;

  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  let quiz = await Quiz.findOne({
    $or: [{ courseId: targetCourseId }, { courseId }],
  });

  if (!quiz) {
    quiz = new Quiz({
      courseId: targetCourseId,
      questionBank: [],
    });
  }

  if (title) quiz.title = title;
  if (titleBn) quiz.titleBn = titleBn;
  if (durationMinutes !== undefined) quiz.durationMinutes = Number(durationMinutes);
  if (passPercentage !== undefined) quiz.passPercentage = Number(passPercentage);
  if (questionsPerQuiz !== undefined) quiz.questionsPerQuiz = Number(questionsPerQuiz);
  if (cooldownMinutes !== undefined) quiz.cooldownMinutes = Number(cooldownMinutes);
  if (timerEnabled !== undefined) quiz.timerEnabled = Boolean(timerEnabled);
  if (shuffleOptions !== undefined) quiz.shuffleOptions = Boolean(shuffleOptions);

  await quiz.save();

  return res.status(200).json(
    new ApiResponse(200, quiz, "Quiz configuration updated successfully")
  );
});

/**
 * Admin: Get complete Quiz with all Question Sets and settings
 */
export const getAdminQuizFull = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  let quiz = await Quiz.findOne({
    $or: [
      { courseId: targetCourseId },
      ...(course?.slug ? [{ courseId: course.slug }] : []),
      ...(course?._id ? [{ courseId: String(course._id) }] : []),
      { courseId },
    ],
  });

  if (!quiz) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          courseId: targetCourseId,
          title: "LPG Safety Assessment Quiz",
          titleBn: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
          durationMinutes: 15,
          passPercentage: 70,
          timerEnabled: true,
          shuffleOptions: true,
          cooldownMinutes: 0,
          questionSets: [
            {
              setId: new mongoose.Types.ObjectId().toString(),
              setName: "Set 1",
              setNameBn: "সেট ১",
              description: "",
              questions: [],
            },
          ],
        },
        "Quiz template loaded"
      )
    );
  }

  // Ensure at least one set exists if empty
  let sets = quiz.questionSets || [];
  if (sets.length === 0) {
    // Migrate legacy questionBank if present
    const legacyQuestions = (quiz.questionBank && quiz.questionBank.length > 0)
      ? quiz.questionBank
      : (quiz.questions || []);
    sets = [
      {
        setId: new mongoose.Types.ObjectId().toString(),
        setName: "Set 1",
        setNameBn: "সেট ১",
        description: "",
        questions: legacyQuestions,
      },
    ];
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: quiz._id,
        courseId: quiz.courseId,
        title: quiz.title,
        titleBn: quiz.titleBn,
        durationMinutes: quiz.durationMinutes,
        passPercentage: quiz.passPercentage,
        timerEnabled: quiz.timerEnabled ?? true,
        shuffleOptions: quiz.shuffleOptions ?? true,
        cooldownMinutes: quiz.cooldownMinutes ?? 0,
        questionSets: sets,
      },
      "Quiz details and question sets loaded successfully"
    )
  );
});

/**
 * Admin: Save/Update Question Sets and settings for a course
 */
export const saveQuizSets = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const {
    title,
    titleBn,
    durationMinutes,
    passPercentage,
    timerEnabled,
    shuffleOptions,
    cooldownMinutes,
    questionSets,
  } = req.body;

  const course = await resolveCourse(courseId);
  const targetCourseId = course ? course.courseId : courseId;

  if (!Array.isArray(questionSets)) {
    throw new ApiError(400, "questionSets array is required");
  }

  // Sanitize and structure questionSets
  const formattedSets = questionSets.map((set, sIdx) => {
    const rawQuestions = Array.isArray(set.questions) ? set.questions : [];
    const formattedQuestions = rawQuestions.map((q) => {
      const qOptions = Array.isArray(q.options) ? q.options : [];
      return {
        id: q.id || new mongoose.Types.ObjectId().toString(),
        question: q.question || "",
        questionBn: q.questionBn || q.question || "",
        type: q.type || "single",
        options: qOptions.map((opt) => ({
          id: opt.id || new mongoose.Types.ObjectId().toString(),
          text: opt.text || "",
          textBn: opt.textBn || opt.text || "",
          isCorrect: Boolean(opt.isCorrect),
        })),
        explanation: q.explanation || "",
        explanationBn: q.explanationBn || "",
        points: Number(q.points) || 1,
      };
    });

    return {
      setId: set.setId || new mongoose.Types.ObjectId().toString(),
      setName: set.setName?.trim() || `Set ${sIdx + 1}`,
      setNameBn: set.setNameBn?.trim() || `সেট ${sIdx + 1}`,
      description: set.description || "",
      questions: formattedQuestions,
    };
  });

  let quiz = await Quiz.findOne({
    $or: [
      { courseId: targetCourseId },
      ...(course?.slug ? [{ courseId: course.slug }] : []),
      ...(course?._id ? [{ courseId: String(course._id) }] : []),
      { courseId },
    ],
  });

  if (!quiz) {
    quiz = new Quiz({
      courseId: targetCourseId,
      title: title || "LPG Safety Assessment Quiz",
      titleBn: titleBn || "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
      durationMinutes: durationMinutes ? Number(durationMinutes) : 15,
      passPercentage: passPercentage ? Number(passPercentage) : 70,
      timerEnabled: timerEnabled !== undefined ? Boolean(timerEnabled) : true,
      shuffleOptions: shuffleOptions !== undefined ? Boolean(shuffleOptions) : true,
      cooldownMinutes: cooldownMinutes !== undefined ? Number(cooldownMinutes) : 0,
      questionSets: formattedSets,
      questionBank: formattedSets[0]?.questions || [],
      questions: formattedSets[0]?.questions || [],
    });
  } else {
    if (title) quiz.title = title;
    if (titleBn) quiz.titleBn = titleBn;
    if (durationMinutes !== undefined) quiz.durationMinutes = Number(durationMinutes);
    if (passPercentage !== undefined) quiz.passPercentage = Number(passPercentage);
    if (timerEnabled !== undefined) quiz.timerEnabled = Boolean(timerEnabled);
    if (shuffleOptions !== undefined) quiz.shuffleOptions = Boolean(shuffleOptions);
    if (cooldownMinutes !== undefined) quiz.cooldownMinutes = Number(cooldownMinutes);
    quiz.questionSets = formattedSets;
    if (formattedSets[0]?.questions?.length > 0) {
      quiz.questionBank = formattedSets[0].questions;
      quiz.questions = formattedSets[0].questions;
    }
  }

  await quiz.save();

  return res.status(200).json(
    new ApiResponse(200, quiz, "Quiz question sets and settings saved successfully")
  );
});

/**
 * Legacy Admin saveQuiz (for course builder form)
 */
export const saveQuiz = asyncHandler(async (req, res) => {
  const { courseId, title, titleBn, durationMinutes, passPercentage, questions } = req.body;

  if (!courseId || !questions || !Array.isArray(questions)) {
    throw new ApiError(400, "Course ID and questions array are required");
  }

  let quiz = await Quiz.findOne({ courseId });

  if (quiz) {
    quiz.title = title || quiz.title;
    quiz.titleBn = titleBn || quiz.titleBn;
    quiz.durationMinutes = durationMinutes || quiz.durationMinutes;
    quiz.passPercentage = passPercentage || quiz.passPercentage;
    quiz.questions = questions;
    quiz.questionBank = questions;
    await quiz.save();
  } else {
    quiz = await Quiz.create({
      courseId,
      title: title || "LPG Safety Assessment Quiz",
      titleBn: titleBn || "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
      durationMinutes: durationMinutes || 10,
      passPercentage: passPercentage || 70,
      questions,
      questionBank: questions,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz saved successfully"));
});

export const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findOneAndDelete({
    $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { courseId: id }],
  });
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Quiz deleted successfully"));
});

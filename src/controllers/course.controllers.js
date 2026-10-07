import { Course } from "../models/course.model.js";
import { Quiz } from "../models/quiz.model.js";
import { User } from "../models/user.model.js";
import { Certificate } from "../models/certificate.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dispatchNewsletterForNewContent } from "../utils/newsletterDispatcher.js";
import { sendPurchaseInvoiceEmail } from "../utils/email.service.js";

/**
 * Public: Get list of courses with filtering & pagination
 */
export const getCourses = asyncHandler(async (req, res) => {
  const { category, search, level, priceType, price, pricing } = req.query;

  const filter = { isPublished: true };
  const andConditions = [];

  if (category && category !== "all") {
    filter.category = category;
  }

  if (level && level !== "all") {
    filter.level = level;
  }

  const pType = (priceType || price || pricing || "").toString().trim().toLowerCase();
  if (pType === "free") {
    andConditions.push({
      $or: [
        { price: 0 },
        { price: { $lte: 0 } },
        { price: null },
        { price: { $exists: false } },
      ],
    });
  } else if (pType === "paid" || pType === "premium") {
    andConditions.push({
      price: { $gt: 0 },
    });
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    andConditions.push({
      $or: [
        { title: searchRegex },
        { titleBn: searchRegex },
        { description: searchRegex },
        { descriptionBn: searchRegex },
      ],
    });
  }

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  const courses = await Course.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

/**
 * Public: Get single course details by ID or slug
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course details fetched successfully"));
});

/**
 * Admin / Instructor: Get courses list for management dashboard
 */
export const getAdminCourses = asyncHandler(async (req, res) => {
  const { category, search, priceType } = req.query;
  const user = req.user;

  const filter = {};

  // If user is instructor, strictly limit to their own created courses
  if (user?.role === "instructor") {
    const namePrefix = (user.fullName || "").replace(/\s*\(Instructor\)\s*/i, "").trim();
    filter.$or = [
      { createdBy: user._id },
      { "instructor.name": new RegExp(namePrefix || user.userName, "i") },
      { "instructor.name": user.fullName || user.userName },
    ];
  }

  const andConditions = [];

  if (category && category !== "all") {
    andConditions.push({ category });
  }

  const pType = (priceType || "").toString().trim().toLowerCase();
  if (pType === "free") {
    andConditions.push({
      $or: [
        { price: 0 },
        { price: { $lte: 0 } },
        { price: null },
        { price: { $exists: false } },
      ],
    });
  } else if (pType === "paid" || pType === "premium") {
    andConditions.push({ price: { $gt: 0 } });
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    andConditions.push({
      $or: [
        { title: searchRegex },
        { titleBn: searchRegex },
        { description: searchRegex },
        { descriptionBn: searchRegex },
      ],
    });
  }

  if (andConditions.length > 0) {
    if (filter.$or) {
      filter.$and = andConditions;
    } else {
      andConditions.forEach((cond) => Object.assign(filter, cond));
    }
  }

  const courses = await Course.find(filter)
    .populate("createdBy", "fullName userName email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Admin courses fetched successfully"));
});

/**
 * Helper to sanitize curriculum modules, lessons, and quizzes
 * Prunes unpopulated ghost questions and guarantees consistent option arrays
 */
function sanitizeCurriculumPayload(curriculum) {
  if (!Array.isArray(curriculum)) return [];

  return curriculum.map((mod, modIdx) => {
    const lessons = Array.isArray(mod.lessons)
      ? mod.lessons.map((l, lIdx) => ({
          ...l,
          title: (l.title || l.titleBn || `Lesson ${lIdx + 1}`).trim(),
          titleBn: (l.titleBn || l.title || `পাঠ ${lIdx + 1}`).trim(),
        }))
      : [];

    let quiz = mod.quiz || {};
    let questions = Array.isArray(quiz.questions) ? quiz.questions : [];

    // Prune ghost questions that have no question statement and all empty options
    questions = questions
      .filter((q) => {
        const hasQ = Boolean(q.question?.trim() || q.questionBn?.trim());
        const hasAnyOpt =
          Array.isArray(q.options) &&
          q.options.some((opt) => opt && String(opt).trim());
        return hasQ || hasAnyOpt;
      })
      .map((q) => {
        const rawOpts = Array.isArray(q.options) ? q.options : [];
        const rawOptsBn = Array.isArray(q.optionsBn) ? q.optionsBn : [];
        const options = [0, 1, 2, 3].map((i) =>
          rawOpts[i] != null ? String(rawOpts[i]) : ""
        );
        const optionsBn = [0, 1, 2, 3].map((i) =>
          rawOptsBn[i] != null ? String(rawOptsBn[i]) : ""
        );
        return {
          ...q,
          question: q.question || "",
          questionBn: q.questionBn || "",
          options,
          optionsBn,
          correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
          explanation: q.explanation || "",
          explanationBn: q.explanationBn || "",
        };
      });

    return {
      ...mod,
      moduleTitle: (mod.moduleTitle || mod.moduleTitleBn || `Module ${modIdx + 1}`).trim(),
      moduleTitleBn: (mod.moduleTitleBn || mod.moduleTitle || `মডিউল ${modIdx + 1}`).trim(),
      lessons,
      quiz: {
        ...quiz,
        title: (quiz.title || `Module ${modIdx + 1} Quiz`).trim(),
        titleBn: (quiz.titleBn || `মডিউল ${modIdx + 1} কুইজ`).trim(),
        durationMinutes: Number(quiz.durationMinutes) || 10,
        passingScore: Number(quiz.passingScore) || 70,
        questions,
      },
    };
  });
}

/**
 * Automatically sync quiz questions from course curriculum modules into the course Quiz engine
 */
async function syncQuizFromCurriculum(course) {
  if (!course || !course.courseId) return;
  const curriculum = course.curriculum || [];
  const extractedQuestions = [];

  curriculum.forEach((mod, modIdx) => {
    if (mod.quiz?.questions && Array.isArray(mod.quiz.questions)) {
      mod.quiz.questions.forEach((q, qIdx) => {
        if (!q.question || !q.question.trim()) return;
        const optionsList = Array.isArray(q.options) ? q.options : [];
        const validOptions = optionsList.filter(
          (opt) => opt && String(opt).trim().length > 0
        );
        if (validOptions.length < 2) return;

        const formattedOptions = optionsList.map((optText, optIdx) => ({
          id: `opt_m${modIdx + 1}_q${qIdx + 1}_${optIdx + 1}`,
          text: String(optText || ""),
          textBn: q.optionsBn?.[optIdx] || String(optText || ""),
          isCorrect: q.correctAnswer === optIdx,
        }));

        extractedQuestions.push({
          id: `q_m${modIdx + 1}_${qIdx + 1}_${Date.now()}_${qIdx}`,
          question: q.question,
          questionBn: q.questionBn || q.question,
          type: "single",
          options: formattedOptions,
          explanation: q.explanation || "",
          explanationBn: q.explanationBn || "",
          points: 1,
        });
      });
    }
  });

  if (extractedQuestions.length > 0) {
    try {
      await Quiz.findOneAndUpdate(
        { courseId: course.courseId },
        {
          courseId: course.courseId,
          title: `${course.title} - Assessment Quiz`,
          titleBn: `${course.titleBn || course.title} - সমাপনী মূল্যায়ন কুইজ`,
          questionsPerQuiz: Math.min(20, extractedQuestions.length),
          questionBank: extractedQuestions,
          questions: extractedQuestions,
          isPublished: true,
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn("[syncQuizFromCurriculum] Failed to sync quiz:", err.message);
    }
  }
}

/**
 * Admin / Instructor: Create new course
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, titleBn, description, descriptionBn } = req.body;

  const engTitle = title || titleBn;
  const bnTitle = titleBn || title;

  if (!engTitle) {
    throw new ApiError(400, "Course title is required");
  }

  const generatedSlug = (req.body.slug || engTitle)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

  // Safely determine next unique courseId that does not collide with any existing courseId
  let candidateNum = (await Course.countDocuments()) + 1;
  let nextId = candidateNum.toString();
  while (await Course.exists({ courseId: nextId })) {
    candidateNum += 1;
    nextId = candidateNum.toString();
  }

  const instructorPayload = req.body.instructor || {};
  if (req.user?.role === "instructor") {
    instructorPayload.name =
      instructorPayload.name || req.user.fullName || req.user.userName;
    instructorPayload.role = instructorPayload.role || "Course Instructor";
  }

  const payload = { ...req.body };
  if (Array.isArray(payload.curriculum)) {
    payload.curriculum = sanitizeCurriculumPayload(payload.curriculum);
  }

  const course = await Course.create({
    ...payload,
    instructor: {
      ...instructorPayload,
    },
    title: engTitle,
    titleBn: bnTitle,
    description: description || descriptionBn || "",
    descriptionBn: descriptionBn || description || "",
    courseId: req.body.courseId || nextId,
    slug: req.body.slug || generatedSlug,
    createdBy: req.user?._id,
  });

  if (course.isPublished !== false) {
    dispatchNewsletterForNewContent({
      type: "course",
      item: course,
      createdBy: req.user?._id,
    });
  }

  // Auto-sync quiz questions from curriculum modules into Quiz model
  await syncQuizFromCurriculum(course);

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

/**
 * Admin / Instructor: Update course details or curriculum
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // If user is instructor, verify ownership
  if (user?.role === "instructor") {
    const isOwner =
      course.createdBy && course.createdBy.toString() === user._id.toString();
    const isNamedInstructor =
      course.instructor?.name &&
      (course.instructor.name === user.fullName ||
        course.instructor.name === user.userName);

    if (!isOwner && !isNamedInstructor) {
      throw new ApiError(403, "You can only manage your own courses");
    }
  }

  const payload = { ...req.body };
  if (payload.title && !payload.titleBn) payload.titleBn = payload.title;
  if (!payload.title && payload.titleBn) payload.title = payload.titleBn;

  if (Array.isArray(payload.curriculum)) {
    payload.curriculum = sanitizeCurriculumPayload(payload.curriculum);
  }

  Object.assign(course, payload);
  await course.save();

  // Auto-sync quiz questions from curriculum modules into Quiz model
  await syncQuizFromCurriculum(course);

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

/**
 * Admin / Instructor: Delete course
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // If user is instructor, verify ownership
  if (user?.role === "instructor") {
    const isOwner =
      course.createdBy && course.createdBy.toString() === user._id.toString();
    const isNamedInstructor =
      course.instructor?.name &&
      (course.instructor.name === user.fullName ||
        course.instructor.name === user.userName);

    if (!isOwner && !isNamedInstructor) {
      throw new ApiError(403, "You can only delete your own courses");
    }
  }

  await Course.deleteOne({ _id: course._id });

  // Clean up associated quizzes
  await Quiz.deleteMany({
    $or: [
      { courseId: course.courseId },
      { courseId: course._id.toString() },
      { courseTitle: course.title },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
});

/**
 * Admin / Instructor: Get enrollment and sales history for courses
 * If instructor: strictly shows enrollments of courses owned by this instructor
 */
export const getCourseEnrollmentHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const isInstructor = user?.role === "instructor";

  // Find relevant courses
  let courseFilter = {};
  if (isInstructor) {
    const namePrefix = (user.fullName || "").replace(/\s*\(Instructor\)\s*/i, "").trim();
    courseFilter = {
      $or: [
        { createdBy: user._id },
        { "instructor.name": new RegExp(namePrefix || user.userName, "i") },
        { "instructor.name": user.fullName || user.userName },
      ],
    };
  }

  const courses = await Course.find(courseFilter)
    .select("_id courseId title titleBn price slug createdBy")
    .lean();

  if (isInstructor && courses.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          stats: { totalStudents: 0, totalRevenue: 0, totalPaid: 0, totalFree: 0 },
          enrollments: [],
        },
        "No courses found for instructor"
      )
    );
  }

  const courseIdMap = new Map();
  courses.forEach((c) => {
    courseIdMap.set(c.courseId, c);
    courseIdMap.set(c._id.toString(), c);
    if (c.slug) courseIdMap.set(c.slug, c);
  });

  const targetCourseIds = courses.map((c) => c.courseId);
  const targetCourseObjIds = courses.map((c) => c._id.toString());
  const allTargetCourseKeys = [
    ...new Set([...targetCourseIds, ...targetCourseObjIds]),
  ];

  // 1. Fetch Subscription records for these courses
  const subQuery = {
    $or: [
      { courseId: { $in: allTargetCourseKeys } },
      { planName: { $in: courses.map((c) => `Course: ${c.title}`) } },
    ],
  };

  if (isInstructor) {
    subQuery.$or.push({ instructorId: user._id });
  }

  const subscriptions = await Subscription.find(subQuery)
    .populate("userId", "fullName userName email phone enrolledCourses")
    .sort({ createdAt: -1 })
    .lean();

  // 2. Fetch Users who have enrolled in any of these courses
  const enrolledUsers = await User.find({
    "enrolledCourses.courseId": { $in: allTargetCourseKeys },
  })
    .select("fullName userName email phone enrolledCourses createdAt")
    .lean();

  // Build unified list
  const enrollmentsMap = new Map();

  // Process subscriptions
  subscriptions.forEach((sub) => {
    const matchedCourse =
      courseIdMap.get(sub.courseId) ||
      courses.find((c) => `Course: ${c.title}` === sub.planName);

    if (matchedCourse) {
      const userRef = sub.userId || {};
      const key = `${sub.transactionId || sub._id}`;
      enrollmentsMap.set(key, {
        id: sub._id,
        userId: userRef._id || (typeof sub.userId === "string" ? sub.userId : null),
        transactionId: sub.transactionId || `TXN-${sub._id.toString().slice(-6)}`,
        studentName:
          sub.customerDetails?.fullName ||
          userRef.fullName ||
          userRef.userName ||
          "Student",
        studentPhone:
          sub.customerDetails?.phone || userRef.phone || "01XXXXXXXXX",
        studentEmail: sub.customerDetails?.email || userRef.email || "",
        courseId: matchedCourse.courseId,
        courseTitle: matchedCourse.title,
        courseTitleBn: matchedCourse.titleBn,
        courseSlug: matchedCourse.slug,
        amount: Number(sub.grandTotal || sub.amount || matchedCourse.price || 0),
        paymentMethod: sub.paymentMethod || "card",
        paymentGateway: sub.paymentGateway || "Online Payment",
        status: sub.status === "paid" ? "Paid" : "Enrolled",
        enrolledAt: sub.startDate || sub.createdAt || new Date(),
        progressPercent:
          userRef.enrolledCourses?.find(
            (e) =>
              e.courseId === matchedCourse.courseId ||
              e.courseId === matchedCourse._id.toString()
          )?.progressPercent || 0,
      });
    }
  });

  // Process user enrolledCourses that might not have a separate Subscription record
  enrolledUsers.forEach((u) => {
    (u.enrolledCourses || []).forEach((ec) => {
      const matchedCourse = courseIdMap.get(ec.courseId);
      if (matchedCourse) {
        const alreadyInList = Array.from(enrollmentsMap.values()).some(
          (item) =>
            item.studentPhone === u.phone &&
            item.courseId === matchedCourse.courseId
        );

        if (!alreadyInList) {
          const pseudoKey = `ENR-${u._id}-${matchedCourse.courseId}`;
          enrollmentsMap.set(pseudoKey, {
            id: pseudoKey,
            userId: u._id,
            transactionId: `DIRECT-${u._id.toString().slice(-4)}`,
            studentName: u.fullName || u.userName || "Student",
            studentPhone: u.phone || "01XXXXXXXXX",
            studentEmail: u.email || "",
            courseId: matchedCourse.courseId,
            courseTitle: matchedCourse.title,
            courseTitleBn: matchedCourse.titleBn,
            courseSlug: matchedCourse.slug,
            amount: Number(matchedCourse.price || 0),
            paymentMethod: matchedCourse.price > 0 ? "card" : "direct",
            paymentGateway:
              matchedCourse.price > 0 ? "Platform Gateway" : "Direct Enrollment",
            status: ec.status === "completed" ? "Completed" : "Enrolled",
            enrolledAt: ec.enrolledAt || u.createdAt || new Date(),
            progressPercent: ec.progressPercent || 0,
          });
        }
      }
    });
  });

  const enrollmentsList = Array.from(enrollmentsMap.values()).sort(
    (a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)
  );

  const totalEnrollments = enrollmentsList.length;

  // Calculate unique learners (distinct students who enrolled in courses)
  const uniqueLearnerIds = new Set();
  enrollmentsList.forEach((e) => {
    if (e.userId) {
      uniqueLearnerIds.add(e.userId.toString());
    } else if (e.studentEmail && e.studentEmail.trim()) {
      uniqueLearnerIds.add(e.studentEmail.trim().toLowerCase());
    } else if (
      e.studentPhone &&
      e.studentPhone.trim() &&
      e.studentPhone !== "01XXXXXXXXX"
    ) {
      uniqueLearnerIds.add(e.studentPhone.trim());
    } else {
      uniqueLearnerIds.add(e.studentName || e.id);
    }
  });
  const totalStudents = uniqueLearnerIds.size;

  const totalRevenue = enrollmentsList.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );
  const totalPaid = enrollmentsList.filter((e) => e.amount > 0).length;
  const totalFree = totalEnrollments - totalPaid;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          totalStudents,
          totalEnrollments,
          totalRevenue,
          totalPaid,
          totalFree,
        },
        enrollments: enrollmentsList,
      },
      "Course enrollments fetched successfully"
    )
  );
});

/**
 * Subscriber/User: Get all courses user is enrolled in
 */
export const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If user has enrolled courses in their record
  const userEnrollments = user.enrolledCourses || [];
  const enrolledCourseIds = userEnrollments.map((e) => e.courseId).filter(Boolean);

  const now = new Date();
  const sub = user.subscription;
  const hasValidExpiry = sub?.expiresAt
    ? new Date(sub.expiresAt) > now
    : sub?.planKey === "lifetime";
  const isSubActive =
    sub?.status === "active" &&
    sub?.planKey &&
    sub?.planKey !== "course_single" &&
    sub?.planKey !== "free" &&
    hasValidExpiry;

  const isAdmin = [
    "super_admin",
    "admin",
    "instructor",
    "course_admin",
    "manager",
  ].includes(user.role);

  const isSubscriber = isSubActive;

  let courses = [];
  if (isSubscriber) {
    // Subscriber with active package gets free access to ALL courses
    courses = await Course.find({ isPublished: true });
  } else if (enrolledCourseIds.length > 0) {
    // General user: ONLY explicitly enrolled courses
    const validObjectIds = enrolledCourseIds.filter(
      (id) => typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)
    );
    const validSlugs = enrolledCourseIds.map((id) =>
      typeof id === "string" ? id.toLowerCase() : ""
    );

    courses = await Course.find({
      $or: [
        { courseId: { $in: enrolledCourseIds } },
        { _id: { $in: validObjectIds } },
        { slug: { $in: validSlugs } },
      ],
    });
  } else {
    courses = [];
  }

  const result = courses.map((c) => {
    const enrollment = userEnrollments.find(
      (e) =>
        e.courseId === c.courseId ||
        e.courseId === c._id.toString() ||
        e.courseId === c.slug
    );
    return {
      ...c.toObject(),
      enrollment: enrollment || {
        progressPercent: 0,
        status: "active",
        enrolledAt: new Date(),
        completedLessons: [],
        lessonProgress: [],
        moduleQuizResults: [],
      },
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Enrolled courses retrieved successfully"));
});

/**
 * Subscriber/User: Enroll in a course
 */
export const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    throw new ApiError(400, "courseId is required");
  }

  const cIdStr = String(courseId).trim();
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(cIdStr);
  const course = await Course.findOne({
    $or: [
      { courseId: cIdStr },
      { slug: cIdStr.toLowerCase() },
      ...(isObjectId ? [{ _id: cIdStr }] : []),
    ],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPaidCourse = course.price > 0 && course.isFree !== true;
  if (isPaidCourse) {
    const now = new Date();
    const sub = user.subscription;
    const hasValidExpiry = sub?.expiresAt
      ? new Date(sub.expiresAt) > now
      : sub?.planKey === "lifetime";
    const isSubActive =
      sub?.status === "active" &&
      sub?.planKey &&
      sub?.planKey !== "course_single" &&
      sub?.planKey !== "free" &&
      hasValidExpiry;

    const isAdmin = [
      "super_admin",
      "admin",
      "instructor",
      "course_admin",
      "manager",
    ].includes(user.role);

    if (!isSubActive && !isAdmin) {
      throw new ApiError(
        403,
        "Payment or active subscription required to enroll in this paid course"
      );
    }
  }

  const existing = user.enrolledCourses?.find(
    (e) =>
      e.courseId === course.courseId ||
      e.courseId === course._id.toString() ||
      e.courseId === course.slug
  );

  if (!existing) {
    if (!user.enrolledCourses) user.enrolledCourses = [];
    user.enrolledCourses.push({
      courseId: course.courseId,
      progressPercent: 0,
      completedLessons: [],
      status: "active",
      enrolledAt: new Date(),
    });
    await user.save();

    // Also record transaction in Subscription collection for unified purchase history
    const txnId = `ENROLL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const lifetimeExpiry = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
    await Subscription.create({
      transactionId: txnId,
      plan: "course_single",
      planName: `Course: ${course.title}`,
      billingCycle: "lifetime",
      amount: course.price || 0,
      vat: 0,
      grandTotal: course.price || 0,
      paymentMethod: course.price > 0 ? "sslcommerz" : "card",
      paymentGateway: course.price > 0 ? "SSLCommerz" : "Free Direct Enrollment",
      status: "paid",
      startDate: new Date(),
      expiryDate: lifetimeExpiry,
      customerDetails: {
        fullName: user.fullName || user.userName || "Student",
        phone: user.phone || "01700000000",
        email: user.email || "",
      },
      userId: user._id,
      courseId: course.courseId,
      instructorId: course.createdBy || null,
    });

    // Dispatch invoice email asynchronously
    setImmediate(async () => {
      try {
        await sendPurchaseInvoiceEmail({
          transactionId: txnId,
          customerDetails: {
            fullName: user.fullName || user.userName || "Student",
            phone: user.phone || "01700000000",
            email: user.email || "",
          },
          customerEmail: user.email,
          customerName: user.fullName || user.userName,
          customerPhone: user.phone,
          planOrCourseTitle: `Course: ${course.title}`,
          type: "course",
          billingCycle: "lifetime",
          amount: course.price || 0,
          vat: 0,
          grandTotal: course.price || 0,
          paymentMethod: course.price > 0 ? "sslcommerz" : "card",
          paymentGateway: course.price > 0 ? "SSLCommerz" : "Free Direct Enrollment",
          startDate: new Date(),
          expiryDate: lifetimeExpiry,
        });
      } catch (e) {
        // Silently handle error
      }
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { courseId: course.courseId, enrolled: true },
      "Enrolled successfully"
    )
  );
});

/**
 * Admin: Upload video file directly for course / lesson
 */
export const uploadCourseVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No video file provided");
  }

  const backendBase = (
    process.env.BASE_URL || "https://api.charutec.com"
  ).replace(/\/$/, "");

  // Construct accessible URL path
  const videoUrl = `${backendBase}/public/upload/videos/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        videoUrl,
        relativePath: `/public/upload/videos/${req.file.filename}`,
      },
      "Course video uploaded successfully"
    )
  );
});

/**
 * Admin: Upload image file directly for course thumbnail
 */
export const uploadCourseImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const backendBase = (
    process.env.BASE_URL || "https://api.charutec.com"
  ).replace(/\/$/, "");
  const imageUrl = `${backendBase}/public/upload/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        imageUrl,
        relativePath: `/public/upload/${req.file.filename}`,
      },
      "Course image uploaded successfully"
    )
  );
});

/**
 * Admin: Upload PDF file for course study guide / resource
 */
export const uploadCoursePdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No PDF file provided");
  }

  const backendBase = (
    process.env.BASE_URL || "https://api.charutec.com"
  ).replace(/\/$/, "");
  const pdfUrl = `${backendBase}/public/upload/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        pdfUrl,
        relativePath: `/public/upload/${req.file.filename}`,
      },
      "Course PDF uploaded successfully"
    )
  );
});

/**
 * Subscriber: Update lesson viewing progress (10-second heartbeat & completion)
 */
export const updateCourseProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lessonId, watchedSeconds = 0, isCompleted = false } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const course = await Course.findOne({
    $or: [{ courseId: id }, { slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const isPaidCourse = (course.price || 0) > 0 && !course.isFree;
  const now = new Date();
  const sub = user.subscription;
  const hasValidExpiry = sub?.expiresAt
    ? new Date(sub.expiresAt) > now
    : sub?.planKey === "lifetime";
  const isSubActive =
    sub?.status === "active" &&
    sub?.planKey &&
    sub?.planKey !== "course_single" &&
    sub?.planKey !== "free" &&
    hasValidExpiry;

  const hasPaidCourseSubscription = await Subscription.exists({
    userId: user._id,
    plan: "course_single",
    courseId: { $in: [course.courseId, course._id.toString(), course.slug] },
    status: "paid",
  });

  const hasUserFullAccess = isSubActive || Boolean(hasPaidCourseSubscription);

  // Find which module contains lessonId
  let lessonModuleIdx = 0;
  if (course.curriculum && lessonId) {
    course.curriculum.forEach((mod, mIdx) => {
      if (mod.lessons?.some((l) => String(l._id) === String(lessonId) || String(l.id) === String(lessonId))) {
        lessonModuleIdx = mIdx;
      }
    });
  }

  // Strict guard: Paid course + No full access -> Module 2+ is strictly blocked!
  if (isPaidCourse && !hasUserFullAccess && lessonModuleIdx > 0) {
    throw new ApiError(403, "Payment or active subscription required to access Module 2 onwards");
  }

  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  let enrollment = user.enrolledCourses.find(
    (e) => e.courseId === course.courseId || e.courseId === course._id.toString() || e.courseId === course.slug
  );

  if (!enrollment) {
    enrollment = {
      courseId: course.courseId,
      enrolledAt: new Date(),
      progressPercent: 0,
      completedLessons: [],
      status: isPaidCourse && !hasUserFullAccess ? "preview" : "active",
      isFreePreview: Boolean(isPaidCourse && !hasUserFullAccess),
    };
    user.enrolledCourses.push(enrollment);
  } else if (isPaidCourse && !hasUserFullAccess && !hasPaidCourseSubscription) {
    enrollment.status = "preview";
    enrollment.isFreePreview = true;
  }

  if (!enrollment.lessonProgress) {
    enrollment.lessonProgress = [];
  }

  const totalLessons =
    course.curriculum?.reduce(
      (acc, mod) => acc + (mod.lessons?.length || 0),
      0
    ) || 1;

  if (lessonId) {
    const sLessonId = String(lessonId);
    const existingIndex = enrollment.lessonProgress.findIndex(
      (lp) => lp.lessonId === sLessonId
    );

    if (existingIndex > -1) {
      enrollment.lessonProgress[existingIndex].lastPositionSeconds = Number(watchedSeconds) || 0;
      enrollment.lessonProgress[existingIndex].updatedAt = new Date();
      if (isCompleted) {
        enrollment.lessonProgress[existingIndex].isCompleted = true;
      }
    } else {
      enrollment.lessonProgress.push({
        lessonId: sLessonId,
        lastPositionSeconds: Number(watchedSeconds) || 0,
        isCompleted: Boolean(isCompleted),
        updatedAt: new Date(),
      });
    }

    if (isCompleted) {
      if (!enrollment.completedLessons.includes(sLessonId)) {
        enrollment.completedLessons.push(sLessonId);
      }
    }
  }

  const completedCount = enrollment.completedLessons.length;
  enrollment.progressPercent = Math.min(
    100,
    Math.round((completedCount / totalLessons) * 100)
  );

  if (enrollment.progressPercent >= 100 && (!isPaidCourse || hasUserFullAccess)) {
    enrollment.status = "completed";
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId: course.courseId,
        progressPercent: enrollment.progressPercent,
        completedLessons: enrollment.completedLessons,
        lessonProgress: enrollment.lessonProgress,
        isCompleted: enrollment.progressPercent >= 100,
      },
      "Course progress updated successfully"
    )
  );
});

/**
 * Learner: Submit Module Quiz (or Final Exam)
 * - Updates or appends moduleQuizResults entry for moduleIdx
 * - If last module (Final Exam) and passed: generates official Certificate
 */
export const submitModuleQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { moduleIndex, scorePercent = 0, isPassed = false, submittedAnswers = {} } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const course = await Course.findOne({
    $or: [{ courseId: id }, { slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const isPaidCourse = (course.price || 0) > 0 && !course.isFree;
  const now = new Date();
  const sub = user.subscription;
  const hasValidExpiry = sub?.expiresAt
    ? new Date(sub.expiresAt) > now
    : sub?.planKey === "lifetime";
  const isSubActive =
    sub?.status === "active" &&
    sub?.planKey &&
    sub?.planKey !== "course_single" &&
    sub?.planKey !== "free" &&
    hasValidExpiry;

  const hasPaidCourseSubscription = await Subscription.exists({
    userId: user._id,
    plan: "course_single",
    courseId: { $in: [course.courseId, course._id.toString(), course.slug] },
    status: "paid",
  });

  const hasUserFullAccess = isSubActive || Boolean(hasPaidCourseSubscription);

  // Strict guard: Paid course + No full access -> Module 2+ quiz is strictly blocked!
  if (isPaidCourse && !hasUserFullAccess && Number(moduleIndex) > 0) {
    throw new ApiError(403, "Payment or active subscription required to take quizzes in Module 2 onwards");
  }

  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  let enrollment = user.enrolledCourses.find(
    (e) => e.courseId === course.courseId || e.courseId === course._id.toString() || e.courseId === course.slug
  );

  if (!enrollment) {
    enrollment = {
      courseId: course.courseId,
      enrolledAt: new Date(),
      progressPercent: 0,
      completedLessons: [],
      status: isPaidCourse && !hasUserFullAccess ? "preview" : "active",
      isFreePreview: Boolean(isPaidCourse && !hasUserFullAccess),
      moduleQuizResults: [],
    };
    user.enrolledCourses.push(enrollment);
  } else if (isPaidCourse && !hasUserFullAccess && !hasPaidCourseSubscription) {
    enrollment.status = "preview";
    enrollment.isFreePreview = true;
  }

  if (!enrollment.moduleQuizResults) {
    enrollment.moduleQuizResults = [];
  }

  const existingResultIdx = enrollment.moduleQuizResults.findIndex(
    (r) => Number(r.moduleIndex) === Number(moduleIndex)
  );

  const quizResultData = {
    moduleIndex: Number(moduleIndex),
    scorePercent: Number(scorePercent),
    isPassed: Boolean(isPassed),
    submittedAnswers: submittedAnswers || {},
    attemptedAt: new Date(),
  };

  if (existingResultIdx > -1) {
    enrollment.moduleQuizResults[existingResultIdx] = quizResultData;
  } else {
    enrollment.moduleQuizResults.push(quizResultData);
  }

  // Check if this is the final exam module
  const totalModules = course.curriculum?.length || 1;
  const isFinalExam = Number(moduleIndex) >= totalModules - 1;
  let certificate = null;

  if (isFinalExam && isPassed && (!isPaidCourse || hasUserFullAccess)) {
    enrollment.quizPassed = true;
    enrollment.status = "completed";
    enrollment.progressPercent = 100;

    let existingCert = await Certificate.findOne({
      userId: user._id,
      courseTitle: course.title,
    });

    if (!existingCert) {
      const now = new Date();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const certId = `CERT-LPG-${(course.courseId || "1").toUpperCase()}-${Date.now().toString().slice(-4)}${randomSuffix}`;
      const issueDate = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const issueDateBn = now.toLocaleDateString("bn-BD");
      const resolvedStudentName = user.fullName || user.userName || "Verified Learner";

      existingCert = await Certificate.create({
        certificateId: certId,
        studentName: resolvedStudentName,
        studentNameBn: resolvedStudentName,
        courseTitle: course.title,
        courseTitleBn: course.titleBn || course.title,
        issueDate,
        issueDateBn,
        grade: `Pass (${scorePercent}%)`,
        status: "Verified & Valid",
        userId: user._id,
      });
    }
    certificate = existingCert;
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId: course.courseId,
        moduleIndex: Number(moduleIndex),
        scorePercent: Number(scorePercent),
        isPassed: Boolean(isPassed),
        certificate,
        moduleQuizResults: enrollment.moduleQuizResults,
      },
      isPassed
        ? "Module assessment passed successfully!"
        : "Module assessment submitted."
    )
  );
});



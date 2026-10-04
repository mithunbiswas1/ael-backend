// comprehensive_sqa.mjs
import mongoose from "mongoose";
import fs from "fs";

const FRONTEND_BASE = "http://localhost:3000";
const BACKEND_BASE = "http://localhost:8005/api/v1";

const auditResults = {
  timestamp: new Date().toISOString(),
  backendCrud: [],
  frontendRoutes: [],
  errorsFound: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
  }
};

function recordTest(category, name, passed, details = "", error = null) {
  auditResults.summary.totalTests++;
  if (passed) {
    auditResults.summary.passed++;
    console.log(`[PASS] [${category}] ${name} ${details ? "- " + details : ""}`);
  } else {
    auditResults.summary.failed++;
    console.error(`[FAIL] [${category}] ${name} ${details ? "- " + details : ""}`);
    if (error) {
      console.error(`       Error details:`, error);
      auditResults.errorsFound.push({ category, name, details, error: String(error) });
    }
  }
  if (category === "BACKEND_CRUD") {
    auditResults.backendCrud.push({ name, passed, details, error: error ? String(error) : null });
  } else if (category === "FRONTEND_ROUTE") {
    auditResults.frontendRoutes.push({ name, passed, details, error: error ? String(error) : null });
  }
}

async function run() {
  console.log("=================================================================");
  console.log("🔥 STARTING FULL SYSTEM END-TO-END SQA AUDIT & HEALTH VERIFICATION");
  console.log("=================================================================\n");

  await mongoose.connect("mongodb://localhost:27017/ael");
  console.log("✅ Connected to MongoDB (ael database)\n");

  // Fetch samples for dynamic slugs
  const db = mongoose.connection.db;
  const sampleBlog = await db.collection("blogs").findOne({});
  const sampleCourse = await db.collection("courses").findOne({});
  const sampleMarketUpdate = await db.collection("marketupdates").findOne({});
  const sampleUser = await db.collection("users").findOne({ role: { $in: ["admin", "super_admin"] } });

  console.log("Loaded Sample Data for dynamic routes:");
  console.log(" - Blog slug:", sampleBlog?.slug);
  console.log(" - Course slug:", sampleCourse?.slug);
  console.log(" - Market Update slug:", sampleMarketUpdate?.slug);
  console.log(" - Admin User ID:", sampleUser?._id?.toString());
  console.log("\n-----------------------------------------------------------------");
  console.log("PHASE 1: AUTHENTICATION & TOKEN ACQUISITION");
  console.log("-----------------------------------------------------------------");

  let adminToken = "";
  let instructorToken = "";

  // 1. Super Admin / Admin Login
  try {
    const res = await fetch(`${BACKEND_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "superadmin@ael.com", password: "password123" }),
    });
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      adminToken = data.data.accessToken;
      recordTest("BACKEND_CRUD", "Super Admin Login", true, `Logged in as ${data.data.user?.fullName}`);
    } else {
      recordTest("BACKEND_CRUD", "Super Admin Login", false, data.message || "No access token");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Super Admin Login", false, "Connection error", err);
  }

  // 2. Instructor Login
  try {
    const res = await fetch(`${BACKEND_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "instructor@ael.com", password: "password123" }),
    });
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      instructorToken = data.data.accessToken;
      recordTest("BACKEND_CRUD", "Instructor Login", true, `Logged in as ${data.data.user?.fullName}`);
    } else {
      recordTest("BACKEND_CRUD", "Instructor Login", false, data.message || "No access token");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Instructor Login", false, "Connection error", err);
  }

  console.log("\n-----------------------------------------------------------------");
  console.log("PHASE 2: FULL CRUD LIFECYCLE TESTS (CREATE, EDIT, DELETE)");
  console.log("-----------------------------------------------------------------");

  // --- CRUD 1: BLOGS ---
  let createdBlogId = null;
  const blogTitle = `SQA Test Blog ${Date.now()}`;
  try {
    const createRes = await fetch(`${BACKEND_BASE}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titleEn: blogTitle,
        titleBn: "এসকিউএ টেস্ট ব্লগ",
        contentEn: "<p>Comprehensive SQA testing automated blog content verification.</p>",
        contentBn: "<p>এসকিউএ টেস্ট বিস্তারিত ব্লগ কন্টেন্ট।</p>",
        category: "General",
        authorEn: "SQA Lead Inspector",
        authorBn: "এসকিউএ প্রধান পরীক্ষক",
        tags: ["sqa", "automated-test"],
        status: "published",
      }),
    });
    const createData = await createRes.json();
    if (createData.success && createData.data?._id) {
      createdBlogId = createData.data._id;
      recordTest("BACKEND_CRUD", "Blog Creation (POST)", true, `ID: ${createdBlogId}`);
    } else {
      recordTest("BACKEND_CRUD", "Blog Creation (POST)", false, createData.message);
    }

    if (createdBlogId) {
      const editRes = await fetch(`${BACKEND_BASE}/blogs/${createdBlogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          titleEn: `${blogTitle} (Updated by SQA)`,
        }),
      });
      const editData = await editRes.json();
      recordTest("BACKEND_CRUD", "Blog Update (PATCH/EDIT)", editData.success === true, editData.message || "");

      const deleteRes = await fetch(`${BACKEND_BASE}/blogs/${createdBlogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Blog Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Blog Lifecycle", false, "Exception", err);
  }

  // --- CRUD 2: MARKET UPDATES ---
  let createdMarketId = null;
  const marketTitle = `SQA Market Update ${Date.now()}`;
  try {
    const createRes = await fetch(`${BACKEND_BASE}/market-updates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        titleEn: marketTitle,
        titleBn: "বাজার দর পর্যালোচনা",
        summaryEn: "Monthly LPG international CP benchmark price analysis.",
        summaryBn: "মাসিক এলপিজি আন্তর্জাতিক সিপি মূল্য বিশ্লেষণ।",
        category: "berc",
        isPublished: true,
      }),
    });
    const createData = await createRes.json();
    if (createData.success && createData.data?._id) {
      createdMarketId = createData.data._id;
      recordTest("BACKEND_CRUD", "Market Update Creation (POST)", true, `ID: ${createdMarketId}`);
    } else {
      recordTest("BACKEND_CRUD", "Market Update Creation (POST)", false, createData.message);
    }

    if (createdMarketId) {
      const editRes = await fetch(`${BACKEND_BASE}/market-updates/${createdMarketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title: `${marketTitle} (Verified Edit)` }),
      });
      const editData = await editRes.json();
      recordTest("BACKEND_CRUD", "Market Update Update (PATCH/EDIT)", editData.success === true, editData.message || "");

      const deleteRes = await fetch(`${BACKEND_BASE}/market-updates/${createdMarketId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Market Update Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Market Update Lifecycle", false, "Exception", err);
  }

  // --- CRUD 3: COMMERCIAL ADVERTISEMENTS ---
  let createdAdId = null;
  try {
    const createRes = await fetch(`${BACKEND_BASE}/advertisements/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: `SQA Commercial Ad ${Date.now()}`,
        slot: "sidebar_ad",
        clickUrl: "https://example.com/promo",
        targetAudience: "all",
        priority: 1,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 864000000).toISOString(),
      }),
    });
    const createData = await createRes.json();
    if (createData.success && createData.data?._id) {
      createdAdId = createData.data._id;
      recordTest("BACKEND_CRUD", "Advertisement Creation (POST)", true, `ID: ${createdAdId}`);
    } else {
      recordTest("BACKEND_CRUD", "Advertisement Creation (POST)", false, createData.message);
    }

    if (createdAdId) {
      const editRes = await fetch(`${BACKEND_BASE}/advertisements/admin/${createdAdId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ priority: 5 }),
      });
      const editData = await editRes.json();
      recordTest("BACKEND_CRUD", "Advertisement Update (PATCH/EDIT)", editData.success === true, editData.message || "");

      const deleteRes = await fetch(`${BACKEND_BASE}/advertisements/admin/${createdAdId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Advertisement Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Advertisement Lifecycle", false, "Exception", err);
  }

  // --- CRUD 4: COMMENTS & MODERATION ---
  let createdCommentId = null;
  try {
    const postRes = await fetch(`${BACKEND_BASE}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        targetId: sampleBlog ? sampleBlog._id.toString() : "6ac1cfec3737e2cbce106818",
        targetType: "blog",
        content: "This is an automated SQA comment verification.",
        authorName: "SQA Auditor",
        authorEmail: "auditor@sqa.com",
      }),
    });
    const postData = await postRes.json();
    if (postData.success && postData.data?._id) {
      createdCommentId = postData.data._id;
      recordTest("BACKEND_CRUD", "Comment Submission (POST)", true, `ID: ${createdCommentId}`);
    } else {
      recordTest("BACKEND_CRUD", "Comment Submission (POST)", false, postData.message);
    }

    if (createdCommentId) {
      // Toggle approval status via admin route
      const toggleRes = await fetch(`${BACKEND_BASE}/comments/admin/${createdCommentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });
      const toggleData = await toggleRes.json();
      recordTest("BACKEND_CRUD", "Comment Status Moderation (PATCH)", toggleData.success === true, toggleData.message || "");

      // Delete comment via admin route
      const deleteRes = await fetch(`${BACKEND_BASE}/comments/admin/${createdCommentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Comment Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Comment Lifecycle", false, "Exception", err);
  }

  // --- CRUD 5: SUBSCRIPTION PLANS ---
  let createdPlanId = null;
  const planKey = `sqa_plan_${Date.now()}`;
  try {
    const createRes = await fetch(`${BACKEND_BASE}/subscriptions/admin/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        nameEn: "SQA Audit Subscription Plan",
        nameBn: "এসকিউএ অডিট প্ল্যান",
        planKey: planKey,
        price: 999,
        durationDays: 180,
        descriptionEn: "Automated test tier for system audit",
        descriptionBn: "সিস্টেম অডিটের জন্য প্ল্যান",
        featuresEn: ["Feature A", "Feature B"],
        isActive: true,
      }),
    });
    const createData = await createRes.json();
    if (createData.success && createData.data?._id) {
      createdPlanId = createData.data._id;
      recordTest("BACKEND_CRUD", "Subscription Plan Creation (POST)", true, `ID: ${createdPlanId}`);
    } else {
      recordTest("BACKEND_CRUD", "Subscription Plan Creation (POST)", false, createData.message);
    }

    if (createdPlanId) {
      const editRes = await fetch(`${BACKEND_BASE}/subscriptions/admin/plans/${createdPlanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ price: 1299 }),
      });
      const editData = await editRes.json();
      recordTest("BACKEND_CRUD", "Subscription Plan Update (PATCH/EDIT)", editData.success === true, editData.message || "");

      const deleteRes = await fetch(`${BACKEND_BASE}/subscriptions/admin/plans/${createdPlanId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Subscription Plan Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Subscription Plan Lifecycle", false, "Exception", err);
  }

  // --- CRUD 6: CONTACT MESSAGES ---
  let createdMessageId = null;
  try {
    const msgRes = await fetch(`${BACKEND_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "SQA Tester",
        email: "sqa_contact@example.com",
        phone: "01711223344",
        subject: "SQA Inquiry",
        message: "Automated test contact inquiry message",
      }),
    });
    const msgData = await msgRes.json();
    if (msgData.success && msgData.data?._id) {
      createdMessageId = msgData.data._id;
      recordTest("BACKEND_CRUD", "Contact Message Submission (POST)", true, `ID: ${createdMessageId}`);
    } else {
      recordTest("BACKEND_CRUD", "Contact Message Submission (POST)", false, msgData.message);
    }

    if (createdMessageId) {
      const deleteRes = await fetch(`${BACKEND_BASE}/contact/messages/${createdMessageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Contact Message Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Contact Message Lifecycle", false, "Exception", err);
  }

  // --- CRUD 7: NEWSLETTER SUBSCRIBER ---
  const newsEmail = `newsletter_${Date.now()}@example.com`;
  let subscriberId = null;
  try {
    const subRes = await fetch(`${BACKEND_BASE}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsEmail }),
    });
    const subData = await subRes.json();
    recordTest("BACKEND_CRUD", "Newsletter Subscription (POST)", subData.success === true, subData.message || "");

    const subDoc = await db.collection("newsletters").findOne({ email: newsEmail });
    if (subDoc && subDoc._id) {
      subscriberId = subDoc._id.toString();
      const deleteRes = await fetch(`${BACKEND_BASE}/newsletter/subscribers/${subscriberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Newsletter Subscriber Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Newsletter Lifecycle", false, "Exception", err);
  }

  // --- CRUD 8: USER MANAGEMENT & PERMISSION ASSIGNMENT ---
  let tempUserId = null;
  const tempUserEmail = `temp_user_${Date.now()}@example.com`;
  try {
    const regRes = await fetch(`${BACKEND_BASE}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: `tempuser_${Date.now()}`,
        fullName: "Temporary Test User",
        email: tempUserEmail,
        phone: `018${Date.now().toString().slice(-8)}`,
        password: "TempPassword123!",
        role: "instructor",
      }),
    });
    const regData = await regRes.json();
    if (regData.success && regData.data?._id) {
      tempUserId = regData.data._id;
      recordTest("BACKEND_CRUD", "User Account Creation (POST)", true, `User ID: ${tempUserId}`);
    } else {
      recordTest("BACKEND_CRUD", "User Account Creation (POST)", false, regData.message);
    }

    if (tempUserId) {
      // Update User by Admin (Assign Role & Permissions)
      const updateRes = await fetch(`${BACKEND_BASE}/user/update-user/${tempUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          role: "instructor",
          is_active: true,
          permissions: [
            { page: "/admin/blogs", module: "blogs", actions: ["view", "create", "edit"] },
            { page: "/admin/courses", module: "courses", actions: ["view", "create"] },
            { page: "/admin/market-updates", module: "market-updates", actions: ["view"] },
          ],
        }),
      });
      const updateData = await updateRes.json();
      recordTest("BACKEND_CRUD", "Admin Assign User Permissions (PATCH/EDIT)", updateData.success === true, updateData.message || "");

      // Delete User
      const deleteRes = await fetch(`${BACKEND_BASE}/user/delete-user/${tempUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Admin Delete User (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "User Management Lifecycle", false, "Exception", err);
  }

  // --- CRUD 9: LMS COURSES ---
  let createdCourseId = null;
  const courseTitle = `SQA Certified Safety Course ${Date.now()}`;
  try {
    const createRes = await fetch(`${BACKEND_BASE}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: courseTitle,
        titleBn: "সার্টিফাইড সেফটি কোর্স",
        description: "Complete industrial course curriculum for safe LPG operations.",
        descriptionBn: "নিরাপদ এলপিজি পরিচালনার সম্পূর্ণ কারিকুলাম।",
        category: "Consumer Safety",
        categoryBn: "ভোক্তা নিরাপত্তা",
        level: "Beginner",
        levelBn: "প্রাথমিক",
        duration: "1h 45m",
        price: 2500,
        isPublished: true,
      }),
    });
    const createData = await createRes.json();
    if (createData.success && createData.data?._id) {
      createdCourseId = createData.data._id;
      recordTest("BACKEND_CRUD", "Course Creation (POST)", true, `ID: ${createdCourseId}`);
    } else {
      recordTest("BACKEND_CRUD", "Course Creation (POST)", false, createData.message);
    }

    if (createdCourseId) {
      const editRes = await fetch(`${BACKEND_BASE}/courses/${createdCourseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ price: 2999 }),
      });
      const editData = await editRes.json();
      recordTest("BACKEND_CRUD", "Course Update (PATCH/EDIT)", editData.success === true, editData.message || "");

      const deleteRes = await fetch(`${BACKEND_BASE}/courses/${createdCourseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Course Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Course Lifecycle", false, "Exception", err);
  }

  // --- CRUD 10: REGULATORY AGENCIES (DIRECTORY) ---
  let createdDirectoryId = null;
  try {
    const createRes = await fetch(`${BACKEND_BASE}/directory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: `SQA Regulatory Agency ${Date.now()}`,
        nameBn: "বাংলাদেশ রেগুলেটরি এজেন্সি",
        phone: "01711223344",
        district: "Dhaka",
        type: "dealer",
        address: "Dhaka, Bangladesh",
      }),
    });
    const createData = await createRes.json();
    if (createData.success && createData.data?._id) {
      createdDirectoryId = createData.data._id;
      recordTest("BACKEND_CRUD", "Directory Agency Creation (POST)", true, `ID: ${createdDirectoryId}`);
    } else {
      recordTest("BACKEND_CRUD", "Directory Agency Creation (POST)", false, createData.message);
    }

    if (createdDirectoryId) {
      const editRes = await fetch(`${BACKEND_BASE}/directory/${createdDirectoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ phone: "01799887766" }),
      });
      const editData = await editRes.json();
      recordTest("BACKEND_CRUD", "Directory Agency Update (PATCH/EDIT)", editData.success === true, editData.message || "");

      const deleteRes = await fetch(`${BACKEND_BASE}/directory/${createdDirectoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const deleteData = await deleteRes.json();
      recordTest("BACKEND_CRUD", "Directory Agency Deletion (DELETE)", deleteData.success === true, deleteData.message || "");
    }
  } catch (err) {
    recordTest("BACKEND_CRUD", "Directory Lifecycle", false, "Exception", err);
  }

  // --- CRUD 11: CMS PAGES & SYSTEM SETTINGS ---
  try {
    const pageRes = await fetch(`${BACKEND_BASE}/pages/safety-guidelines`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "LPG Safety Guidelines & Standard Operating Procedures",
        titleBn: "এলপিজি নিরাপত্তা নির্দেশিকা ও প্রমিত পরিচালন পদ্ধতি",
        isPublished: true,
      }),
    });
    const pageData = await pageRes.json();
    recordTest("BACKEND_CRUD", "CMS Page Update (PUT)", pageData.success === true, pageData.message || "");
  } catch (err) {
    recordTest("BACKEND_CRUD", "CMS Page Lifecycle", false, "Exception", err);
  }

  console.log("\n-----------------------------------------------------------------");
  console.log("PHASE 3: FRONTEND ROUTE CRAWLER & LINK HEALTH AUDIT");
  console.log("-----------------------------------------------------------------");

  const routesToTest = [
    // Public Website
    { path: "/", name: "Homepage" },
    { path: "/about", name: "About Us" },
    { path: "/blogs", name: "Blogs Catalog" },
    ...(sampleBlog ? [{ path: `/blogs/${sampleBlog.slug}`, name: `Blog Post (${sampleBlog.slug})` }] : []),
    { path: "/courses", name: "Courses Catalog" },
    ...(sampleCourse ? [{ path: `/courses/${sampleCourse.slug}`, name: `Course Detail (${sampleCourse.slug})` }] : []),
    { path: "/market-updates", name: "LPG Market Updates" },
    ...(sampleMarketUpdate ? [{ path: `/market-updates/${sampleMarketUpdate.slug}`, name: `Market Update (${sampleMarketUpdate.slug})` }] : []),
    { path: "/safety-guidelines", name: "Safety Guidelines" },
    { path: "/contact", name: "Contact Page" },
    { path: "/subscription", name: "Subscription Plans" },
    { path: "/terms", name: "Terms & Conditions" },
    { path: "/privacy", name: "Privacy Policy" },
    { path: "/faq", name: "FAQ Help Center" },
    { path: "/acts-and-rules", name: "Acts & Rules" },
    { path: "/training-and-quiz", name: "Training & Quiz Landing" },
    { path: "/verify-certificate", name: "Verify Certificate" },

    // Authentication
    { path: "/login", name: "Login Page" },
    { path: "/registration", name: "Registration Page" },
    { path: "/reset-password", name: "Reset Password Page" },

    // Dashboard & Profile
    { path: "/profile", name: "User Profile" },
    { path: "/user-dashboard", name: "Learner Dashboard" },
    { path: "/user-dashboard/courses", name: "Learner Enrolled Courses" },
    { path: "/user-dashboard/subscription", name: "Learner Subscription" },
    { path: "/user-dashboard/certificates", name: "Learner Certificates" },

    // Admin Operations
    { path: "/admin", name: "Admin Dashboard" },
    { path: "/admin/blogs", name: "Admin Blogs Table" },
    { path: "/admin/blogs/add", name: "Admin Blog Create Form" },
    ...(sampleBlog ? [{ path: `/admin/blogs/edit/${sampleBlog._id}`, name: `Admin Blog Edit Form` }] : []),
    { path: "/admin/courses", name: "Admin Courses Table" },
    { path: "/admin/courses/add", name: "Admin Course Create Form" },
    { path: "/admin/courses/enrollments", name: "Admin Course Enrollments" },
    { path: "/admin/certificates", name: "Admin Certificates Registry" },
    { path: "/admin/users", name: "Admin Users Table (Accessible Pages Column)" },
    ...(sampleUser ? [{ path: `/admin/users/${sampleUser._id}`, name: `Admin User Permissions Editor` }] : []),
    { path: "/admin/roles", name: "Admin Roles & Permissions" },
    { path: "/admin/messages", name: "Admin Messages & Inquiries" },
    { path: "/admin/comments", name: "Admin Comments Moderation" },
    { path: "/admin/safety-guidelines", name: "Admin Safety Guidelines" },
    { path: "/admin/safety-guidelines/add", name: "Admin Safety Guideline Create" },
    { path: "/admin/regulatory-agencies", name: "Admin Regulatory Agencies" },
    { path: "/admin/regulatory-agencies/add", name: "Admin Regulatory Agency Create" },
    { path: "/admin/advertisements", name: "Admin Advertisements" },
    { path: "/admin/sms", name: "Admin SMS Campaigns" },
    { path: "/admin/email", name: "Admin Email Campaigns" },
    { path: "/admin/newsletter", name: "Admin Newsletter Users" },
    { path: "/admin/subscriptions", name: "Admin Subscription Plans" },
    { path: "/admin/subscriptions/add", name: "Admin Subscription Plan Create" },
    { path: "/admin/market-updates", name: "Admin Market Updates" },
    { path: "/admin/market-updates/add", name: "Admin Market Update Create" },
    { path: "/admin/settings", name: "Admin Settings" },

    // Admin CMS Pages
    { path: "/admin/pages/home", name: "Admin CMS Home" },
    { path: "/admin/pages/about", name: "Admin CMS About" },
    { path: "/admin/pages/blogs", name: "Admin CMS Blogs" },
    { path: "/admin/pages/contact", name: "Admin CMS Contact" },
    { path: "/admin/pages/safety-guidelines", name: "Admin CMS Safety" },
    { path: "/admin/pages/market-updates", name: "Admin CMS Market Updates" },
    { path: "/admin/pages/courses", name: "Admin CMS Courses" },
    { path: "/admin/pages/terms", name: "Admin CMS Terms" },
    { path: "/admin/pages/privacy", name: "Admin CMS Privacy" },
    { path: "/admin/pages/faq", name: "Admin CMS FAQ" },
    { path: "/admin/pages/subscription", name: "Admin CMS Subscription" },
  ];

  for (const r of routesToTest) {
    const url = `${FRONTEND_BASE}${r.path}`;
    try {
      const res = await fetch(url);
      const status = res.status;
      const html = await res.text();

      const hasServerError = status >= 500;
      const hasClientException = html.includes("Application error: a client-side exception has occurred");
      const has404 = status === 404 || html.includes("404 - Page Not Found");
      const hasSyntaxError = html.includes("SyntaxError") || html.includes("ReferenceError");

      if (status === 200 && !hasClientException && !hasSyntaxError) {
        recordTest("FRONTEND_ROUTE", `${r.name} (${r.path})`, true, `HTTP ${status} (Bytes: ${html.length})`);
      } else {
        const errorDesc = hasClientException
          ? "Client-side Exception"
          : hasServerError
          ? `Server Error HTTP ${status}`
          : has404
          ? `Not Found HTTP ${status}`
          : `HTTP ${status}`;
        recordTest("FRONTEND_ROUTE", `${r.name} (${r.path})`, false, errorDesc, errorDesc);
      }
    } catch (err) {
      recordTest("FRONTEND_ROUTE", `${r.name} (${r.path})`, false, "Network/Fetch Error", err);
    }
  }

  await mongoose.disconnect();

  console.log("\n=================================================================");
  console.log("📊 SQA AUDIT RUN COMPLETE");
  console.log(`Total Checks Executed: ${auditResults.summary.totalTests}`);
  console.log(`Passed: ${auditResults.summary.passed}`);
  console.log(`Failed: ${auditResults.summary.failed}`);
  console.log("=================================================================\n");

  fs.writeFileSync("d:/ael/comprehensive_sqa_results.json", JSON.stringify(auditResults, null, 2));
  console.log("Results saved to d:/ael/comprehensive_sqa_results.json");
}

run().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});

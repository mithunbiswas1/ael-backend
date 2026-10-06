// ael_backend/src/scripts/seed_clean_two_courses.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { Course } from "../models/course.model.js";
import { Quiz } from "../models/quiz.model.js";
import { User } from "../models/user.model.js";

const sampleVideoUrl = "/sample-course-video.mp4";

// =========================================================================
// 1. FREE COURSE (3 Modules: 3 videos, 4 videos, 4 videos -> Total 11 videos)
// =========================================================================
const freeCourseData = {
  courseId: "1",
  title: "LPG Household Safety & Emergency Handling Masterclass",
  titleBn: "গৃহস্থালি এলপিজি নিরাপত্তা ও জরুরি ব্যবস্থাপনা মাস্টারক্লাস",
  slug: "lpg-household-safety-emergency-handling",
  description:
    "Comprehensive national training for household LPG users, homemakers, and domestic staff. Learn safe cylinder installation, leak detection, cross-ventilation SOP, and emergency fire containment.",
  descriptionBn:
    "গৃহস্থালি এলপিজি ব্যবহারকারী, গৃহিণী এবং পরিবারের সদস্যদের জন্য জাতীয় মানসম্পন্ন নিরাপত্তা প্রশিক্ষণ। নিরাপদ সিলিন্ডার সংযোগ, লিকেজ শনাক্তকরণ, ক্রস-ভেন্টিলেশন এবং জরুরি দুর্ঘটনা মোকাবেলার সঠিক নিয়ম শিখুন।",
  category: "Consumer Safety",
  categoryBn: "ভোক্তা নিরাপত্তা",
  badge: "FREE",
  badgeColor: "bg-emerald-600",
  audience: "Consumers, Homemakers & Domestic Staff",
  audienceBn: "ভোক্তা, গৃহিণী ও গৃহস্থালি কর্মী",
  level: "Beginner",
  levelBn: "প্রাথমিক",
  duration: "1h 45m",
  durationBn: "১ ঘণ্টা ৪৫ মিনিট",
  totalLessons: 11,
  totalQuizzes: 1,
  rating: 4.9,
  enrolledCount: "16,420",
  price: 0,
  imageUrl:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  videoUrl: sampleVideoUrl,
  pdfUrl: "/customer-household-lpg-safety-guide.pdf",
  pdfOriginalName: "Household_LPG_Safety_Manual.pdf",
  pdfSize: "2.8 MB",
  instructor: {
    name: "Engr. Mahmudul Hasan",
    nameBn: "প্রকৌশলী মাহমুদুল হাসান",
    role: "Lead Safety Auditor, Ex-DoE",
    roleBn: "প্রধান নিরাপত্তা নিরীক্ষক, প্রাক্তন ডিওই",
    experience: "15+ Years Industrial Safety",
    experienceBn: "১৫+ বছরের শিল্প নিরাপত্তা অভিজ্ঞতা",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
  },
  learningOutcomes: [
    "Master the physical behavior and density of LPG vapor compared to ambient atmospheric air.",
    "Inspect cylinder O-ring seals, low-pressure regulators, and steel-reinforced rubber hoses.",
    "Implement zero-spark cross-ventilation protocols during suspected gas leakage emergencies.",
    "Correctly operate Dry Chemical Powder (DCP) extinguishers using the P.A.S.S. methodology.",
  ],
  learningOutcomesBn: [
    "এলপিজি বাষ্পের বৈশিষ্ট্য ও বাতাসের চেয়ে ভারী হওয়ার ঝুঁকি সম্পর্কে সম্যক জ্ঞান অর্জন।",
    "সিলিন্ডারের রাবার ও-রিং, রেগুলেটর ক্লিপ ও মেটালিক হোসপাইপ সঠিকভাবে পরীক্ষা ও স্থাপন।",
    "গ্যাস লিকেজের সময় কোনো সুইচ স্পর্শ না করে সঠিক ক্রস-ভেন্টিলেশন প্রোটোকল বাস্তবায়ন।",
    "ডিসিবি অগ্নিনির্বাপক যন্ত্রের সঠিক ব্যবহার এবং জাতীয় জরুরি হেল্পলাইনে (১৬১৩৭) যোগাযোগের কৌশল।",
  ],
  curriculum: [
    {
      moduleTitle: "Module 1: Fundamental LPG Properties & Safe Setup",
      moduleTitleBn: "মডিউল ১: এলপিজির মৌলিক বৈশিষ্ট্য ও নিরাপদ সংযোগ",
      isFree: true,
      lessons: [
        {
          title: "Introduction to LPG Chemistry & Odorant Markers",
          titleBn: "এলপিজি গ্যাসের রাসায়নিক বৈশিষ্ট্য ও গন্ধ শনাক্তকরণ",
          duration: "08 mins",
          durationBn: "০৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "LPG (Propane/Butane) is odorless in pure form; Ethyl Mercaptan is added for pungent odor detection. LPG vapor is 1.5 to 2.0 times heavier than air.",
          notesBn:
            "বিশুদ্ধ এলপিজি গন্ধহীন; লিকেজ শনাক্ত করতে এতে তীব্র গন্ধযুক্ত ইথাইল মারক্যাপ্টান মেশানো হয়। এলপিজি বাষ্প বাতাসের চেয়ে দেড় থেকে দুই গুণ ভারী।",
        },
        {
          title: "Cylinder Inspection, Rubber O-Ring & Tare Weight",
          titleBn: "সিলিন্ডার পরীক্ষণ, রাবার ও-রিং ও খালি ওজন যাচাই",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Always inspect the safety seal before delivery. Check tare weight stamped on cylinder stay-plate to avoid underweight cylinders.",
          notesBn:
            "ডেলিভারির সময় ক্যাপ সিল অক্ষত কিনা দেখুন। খালি ওজন ও মোট ওজনের হিসাব সিলিন্ডারের গায়ে লেখা দেখে নিশ্চিত করুন।",
        },
        {
          title: "Low-Pressure Regulator & Metallic Hose Installation",
          titleBn: "লো-প্রেসার রেগুলেটর ও ধাতব রিইনফোর্সড পাইপ সংযোগ",
          duration: "09 mins",
          durationBn: "০৯ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Ensure low-pressure domestic regulator snaps firmly into the valve neck with a distinct click. Never force a worn regulator.",
          notesBn:
            "রেগুলেটর লাগানোর সময় ক্লিক শব্দ হওয়া পর্যন্ত পরীক্ষা করুন। ক্ষয়প্রাপ্ত বা পুরোনো রেগুলেটর জোরপূর্বক ব্যবহার করবেন না।",
        },
      ],
    },
    {
      moduleTitle: "Module 2: Daily Kitchen Operations & Leak Prevention",
      moduleTitleBn: "মডিউল ২: দৈনন্দিন রান্নাঘরের ব্যবহার ও লিকেজ প্রতিরোধ",
      isFree: true,
      lessons: [
        {
          title: "Safe Ignition Protocols & Kitchen Ventilation SOP",
          titleBn: "নিরাপদ চুলা প্রজ্বলন ও রান্নাঘরের বায়ু চলাচল প্রটোকল",
          duration: "11 mins",
          durationBn: "১১ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Always ignite match/lighter FIRST before opening burner knob. Keep kitchen windows open for positive natural cross-ventilation.",
          notesBn:
            "সবসময় আগে ম্যাচ বা লাইটার জ্বালিয়ে তারপর চুলার নব ঘোরান। রান্নার সময় রান্নাঘরের জানালা খোলা রাখুন।",
        },
        {
          title: "Soapy Water Leak Detection vs Flame Hazards",
          titleBn: "সাবান-পানির বুদবুদ পরীক্ষা বনাম আগুনের মারাত্মক ঝুঁকি",
          duration: "08 mins",
          durationBn: "০৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "NEVER use matchsticks or open flame to check gas leaks! Apply liquid soap froth around valve neck and hose clamps to detect bubbles.",
          notesBn:
            "গ্যাস লিকেজ পরীক্ষার জন্য কখনোই দিয়াশলাই বা আগুন ব্যবহার করবেন না! সাবানের ফেনা তৈরি করে পাইপ ও রেগুলেটর সংযোগে লাগিয়ে বুদবুদ পরীক্ষা করুন।",
        },
        {
          title: "Cylinder Placement Rules: Floor Level, Heat Sources & Clearance",
          titleBn: "সিলিন্ডার রাখার সঠিক স্থান: মেঝে, তাপ উৎস ও দূরত্ব",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Maintain minimum 1 meter clearance between cylinder and stove. Cylinder must stand upright on flat floor with bottom ventilation.",
          notesBn:
            "সিলিন্ডার ও চুলার মধ্যে কমপক্ষে ১ মিটার দূরত্ব রাখুন। সিলিন্ডার সবসময় সমতল মেঝেতে খাড়াভাবে রাখুন এবং কোনো অবস্থাতেই কাত করবেন না।",
        },
        {
          title: "Empty Cylinder Exchange & Safe Storage Practices",
          titleBn: "খালি সিলিন্ডার প্রতিস্থাপন ও সঠিক সংরক্ষণ পদ্ধতি",
          duration: "07 mins",
          durationBn: "০৭ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Always turn off regulator knob before disconnection. Never store spare cylinders inside enclosed cabinets or underground basements.",
          notesBn:
            "সিলিন্ডার বদলানোর আগে রেগুলেটর নব পুরোপুরি বন্ধ করুন। অতিরিক্ত সিলিন্ডার বদ্ধ আলমারি বা ভূগর্ভস্থ বেজমেন্টে রাখবেন না।",
        },
      ],
    },
    {
      moduleTitle: "Module 3: Emergency Gas Leak Response & Fire Containment",
      moduleTitleBn: "মডিউল ৩: গ্যাস লিকেজ জরুরি অবস্থা ও অগ্নিনির্বাপণ কৌশল",
      isFree: true,
      lessons: [
        {
          title: "Immediate Actions During Gas Leak: Zero Spark Protocol",
          titleBn: "গ্যাস লিকেজ হলে তাৎক্ষণিক করণীয়: জিরো স্পার্ক নিয়ম",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "CRITICAL: Do NOT turn switches ON or OFF. Do NOT use phone in kitchen. Disconnect regulator if safe, open all doors and windows immediately.",
          notesBn:
            "জরুরি নিয়ম: কোনো বৈদ্যুতিক সুইচ অন বা অফ করবেন না। রান্নাঘরে ফোন ব্যবহার করবেন না। সম্ভব হলে রেগুলেটর বন্ধ করুন এবং দরজা-জানালা খুলে দিন।",
        },
        {
          title: "Cross-Ventilation, Evacuation & Damp Cloth Valve Smothering",
          titleBn: "ক্রস-ভেন্টিলেশন, নিরাপদ স্থানান্তর ও ভেজা চটের ব্যবহার",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "In case of valve ignition, wrap a thick wet sack/blanket around cylinder collar in one swift motion to cut oxygen supply.",
          notesBn:
            "সিলিন্ডারের মুখে আগুন লাগলে আতঙ্কিত না হয়ে একটি মোটা ভেজা কম্বল বা চটের বস্তা দ্রুত ও দৃঢ়ভাবে পেঁচিয়ে বাতাসের সংযোগ বিচ্ছিন্ন করুন।",
        },
        {
          title: "Dry Chemical Powder (DCP) Fire Extinguisher Operation",
          titleBn: "ডিসিবি অগ্নিনির্বাপক যন্ত্রের সঠিক পি.এ.এস.এস পদ্ধতি",
          duration: "13 mins",
          durationBn: "১৩ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "P.A.S.S. technique: Pull safety pin, Aim nozzle at fire base, Squeeze control handle, Sweep side-to-side from upwind position.",
          notesBn:
            "P.A.S.S পদ্ধতি: পিন টানুন, আগুনের মূল ভিত্তিমূলে লক্ষ্য করুন, হ্যান্ডেল চাপুন, এবং বাতাসের অনুকূলে থেকে এপাশ-ওপাশ স্প্রে করুন।",
        },
        {
          title: "National Emergency Hotline 16137 & Rapid Response Tree",
          titleBn: "জাতীয় জরুরি হেল্পলাইন ১৬১৩৭ ও জরুরি সহায়তা যোগাযোগ",
          duration: "08 mins",
          durationBn: "০৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Immediate emergency escalation tree: National LPG Emergency 16137, Fire Service 102 / 02223355555, National Emergency 999.",
          notesBn:
            "জরুরি সহায়তা নম্বর: জাতীয় এলপিজি জরুরি হেল্পলাইন ১৬১৩৭, ফায়ার সার্ভিস ১০২, জাতীয় জরুরি সেবা ৯৯৯।",
        },
      ],
    },
  ],
};

// =========================================================================
// 2. PAID COURSE (3 Modules: 3 videos, 4 videos, 4 videos -> Total 11 videos)
// =========================================================================
const paidCourseData = {
  courseId: "2",
  title: "Commercial LPG Safety Auditing & Regulatory Compliance",
  titleBn: "বাণিজ্যিক এলপিজি নিরাপত্তা অডিট ও সংবিধিবদ্ধ সম্মতি প্রশিক্ষণ",
  slug: "commercial-lpg-safety-auditing-compliance",
  description:
    "Certified professional curriculum for restaurant managers, industrial plant safety officers, and commercial LPG distributors. Master Department of Explosives (DoE) audit codes, multi-cylinder manifold architecture, auto-shutoff sensors, and Fire Service inspection readiness.",
  descriptionBn:
    "হোটেল, রেস্তোরাঁ, শিল্প কারখানা এবং ডিলারদের জন্য আন্তর্জাতিক মানসম্পন্ন প্রফেশনাল ট্রেনিং। বিস্ফোরক অধিদপ্তর (DoE) নির্দেশিকা, মাল্টি-সিলিন্ডার ম্যানিফোল্ড ব্যাংক, অটো গ্যাস ডিটেকশন সিস্টেম ও অগ্নি নিরাপত্তা সম্মতির নিয়ম শিখুন।",
  category: "Commercial & Industrial",
  categoryBn: "বাণিজ্যিক ও শিল্প",
  badge: "PREMIUM",
  badgeColor: "bg-amber-600",
  audience: "Restaurant Managers, Safety Engineers & Distributors",
  audienceBn: "রেস্তোরাঁ ব্যবস্থাপক, নিরাপত্তা প্রকৌশলী ও ডিলার",
  level: "Advanced",
  levelBn: "উন্নত",
  duration: "2h 30m",
  durationBn: "২ ঘণ্টা ৩০ মিনিট",
  totalLessons: 11,
  totalQuizzes: 1,
  rating: 4.95,
  enrolledCount: "9,850",
  price: 1250,
  imageUrl:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
  videoUrl: sampleVideoUrl,
  pdfUrl: "/distributor-transportation-safety-code.pdf",
  pdfOriginalName: "Commercial_Manifold_Compliance_Guide.pdf",
  pdfSize: "4.8 MB",
  instructor: {
    name: "Engr. Tariqul Islam",
    nameBn: "প্রকৌশলী তরিকুল ইসলাম",
    role: "Director of Technical Compliance, LOAB",
    roleBn: "পরিচালক, কারিগরি কমপ্লায়েন্স, লোয়াব",
    experience: "18+ Years Regulatory Advisory",
    experienceBn: "১৮+ বছরের রেগুলেটরি অভিজ্ঞতা",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
  },
  learningOutcomes: [
    "Design and commission dual-bank multi-cylinder commercial manifold systems adhering to DoE standards.",
    "Specify, calibrate, and wire catalytic and infrared LEL gas detectors with solenoid emergency valves.",
    "Calculate natural ventilation louver ratios and kitchen exhaust hood interlock airflow limits.",
    "Maintain inspection logbooks, hydrostatic pressure audit certs, and statutory NBR/BERC licenses.",
  ],
  learningOutcomesBn: [
    "বিস্ফোরক অধিদপ্তরের কোড অনুযায়ী বাণিজ্যিক মাল্টি-সিলিন্ডার ম্যানিফোল্ড সিস্টেম স্থাপন ও ডিজাইন।",
    "ক্যাটালিটিক ও ইনফ্রারেড গ্যাস সেন্সর স্থাপন এবং সোলেনয়েড শাট-অফ ভালভ অটোমেশন কার্যকরকরণ।",
    "প্রাকৃতিক বায়ু চলাচলের পরিমাপ এবং কিচেন হুড ইন্টারলক নিরাপত্তা ব্যবস্থা নিশ্চিতকরণ।",
    "নিয়মিত পরিদর্শন লগশিট, হাইড্রোস্ট্যাটিক প্রেসার সনদ এবং সরকারি লাইসেন্সিং অডিট প্রস্তুতি।",
  ],
  curriculum: [
    {
      moduleTitle: "Module 1: Commercial Installation & Manifold Architecture",
      moduleTitleBn: "মডিউল ১: বাণিজ্যিক ইনস্টলেশন ও সিলিন্ডার ম্যানিফোল্ড প্রকৌশল",
      isFree: true,
      lessons: [
        {
          title: "Multi-Cylinder Manifold Bank Architecture & Sizing",
          titleBn: "মাল্টি-সিলিন্ডার ম্যানিফোল্ড ব্যাংক আর্কিটেকচার ও ক্ষমতা নির্ধারণ",
          duration: "14 mins",
          durationBn: "১৪ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Manifold battery banks must be located outside kitchen buildings in naturally ventilated masonry enclosures with zero drainage pits.",
          notesBn:
            "ম্যানিফোল্ড সিলিন্ডার ব্যাংক অবশ্যই রান্নাঘরের বাইরে উন্মুক্ত ও প্রাকৃতিক বায়ু চলাচলযুক্ত সেডে স্থাপন করতে হবে।",
        },
        {
          title: "High-Pressure Two-Stage Regulators & PRV Calibration",
          titleBn: "হাই-প্রেসার দুই-ধাপের রেগুলেটর ও সেফটি ভালভ ক্যালিব্রেশন",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Two-stage pressure reduction: First stage breaks 100+ PSI down to 15 PSI; second stage regulates down to 0.5 PSI for commercial burners.",
          notesBn:
            "দুই ধাপের চাপ নিয়ন্ত্রণ: প্রথম ধাপ ১০০+ পিএসআইকে ১৫ পিএসআইতে কমায়, দ্বিতীয় ধাপ চুলার জন্য ০.৫ পিএসআইতে স্থিতিশীল করে।",
        },
        {
          title: "Steel Piping Standards, Hydrostatic Testing & Color Codes",
          titleBn: "সিমলেস স্টিল পাইপিং মানদণ্ড, হাইড্রোস্ট্যাটিক টেস্ট ও কালার কোড",
          duration: "15 mins",
          durationBn: "১৫ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Schedule 40/80 seamless carbon steel pipe (ASTM A53/A106) with golden yellow protective epoxy coating and pneumatic leak certification.",
          notesBn:
            "বাণিজ্যিক লাইনে শিডিউল ৪০/৮০ সিমলেস কার্বন স্টিল পাইপ ব্যবহার এবং সোনালী হলুদ রঙের কোটিং দ্বারা চিহ্নিতকরণ বাধ্যতামূলক।",
        },
      ],
    },
    {
      moduleTitle: "Module 2: Gas Automation, Detection & Explosion Mitigation",
      moduleTitleBn: "মডিউল ২: গ্যাস অটোমেশন, ডিটেকশন ও বিস্ফোরণ প্রতিরোধ ব্যবস্থা",
      isFree: false,
      lessons: [
        {
          title: "Catalytic & Infrared LEL Gas Leak Sensor Placement",
          titleBn: "ক্যাটালিটিক ও ইনফ্রারেড এলইএল গ্যাস সেন্সর স্থাপন কৌশল",
          duration: "13 mins",
          durationBn: "১৩ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Mount combustible gas sensors 15-30 cm above floor level near appliances, manifolds, and low depressions where LPG pools.",
          notesBn:
            "এলপিজি মেঝের কাছে জমে বলে সেন্সরগুলো মেঝের স্তর থেকে ১৫-৩০ সেমি উপরে স্থাপন করতে হবে।",
        },
        {
          title: "Solenoid Auto Shut-Off Valves & Interlocking Control Panels",
          titleBn: "সোলোনয়েড অটো শাট-অফ ভালভ ও অটোমেটেড কন্ট্রোল প্যানেল",
          duration: "14 mins",
          durationBn: "১৪ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Emergency shut-off solenoid must trip at 10-20% LEL, sounding strobe sirens and isolating gas flow at the outdoor manifold header.",
          notesBn:
            "১০-২০% এলইএল গ্যাস ঘনত্বে সোলোনয়েড ভালভ সক্রিয় হয়ে বাইরের সিলিন্ডার থেকেই পুরো গ্যাস লাইন বন্ধ করে দেয়।",
        },
        {
          title: "Commercial Kitchen Hood Interlocks & Mechanical Exhaust SOP",
          titleBn: "বাণিজ্যিক রান্নাঘরের এক্সহস্ট হুড ইন্টারলক ও ভেন্টিলেশন এসওপি",
          duration: "11 mins",
          durationBn: "১১ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Gas supply must interlock electrically with kitchen exhaust blower: gas flows ONLY when mechanical exhaust is operating at certified CFM.",
          notesBn:
            "কিচেন এক্সহস্ট ফ্যান চালু না থাকা অবস্থায় যাতে গ্যাস সংযোগ চালু না হতে পারে সেজন্য ইলেকট্রিক্যাল ইন্টারলক নিশ্চিত করা।",
        },
        {
          title: "Flame Arrestors, Flashback Protectors & Vaporizer Operation",
          titleBn: "ফ্লেম অ্যারেস্টর, ফ্ল্যাশব্যাক প্রতিরোধক ও ভেপোরাইজার পরিচালনা",
          duration: "16 mins",
          durationBn: "১৬ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "High-consumption industrial burners require liquid-offtake electric water-bath vaporizers with ASME certified relief valves.",
          notesBn:
            "অধিক ব্যবহারের জন্য ওয়াটার-বাথ ভেপোরাইজার ও গ্যাস লাইনে ব্যাকফায়ার প্রতিরোধী ফ্ল্যাশব্যাক অ্যারেস্টর স্থাপন।",
        },
      ],
    },
    {
      moduleTitle: "Module 3: Statutory Compliance, Inspection Auditing & Incident SOP",
      moduleTitleBn: "মডিউল ৩: সংবিধিবদ্ধ আইন, নিরাপত্তা পরিদর্শন ও জরুরি প্রটোকল",
      isFree: false,
      lessons: [
        {
          title: "Department of Explosives (DoE) Statutory Audit Code & Rules",
          titleBn: "বিস্ফোরক অধিদপ্তর (DoE) সংবিধিবদ্ধ অডিট কোড ও লাইসেন্সিং",
          duration: "18 mins",
          durationBn: "১৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "The Gas Cylinder Rules 1991 (amended 2004) require storage licenses for aggregate LPG storage exceeding 80 kg on premises.",
          notesBn:
            "গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ (সংশোধিত ২০০৪) অনুযায়ী ৮০ কেজির বেশি মজুদের জন্য বিস্ফোরক অধিদপ্তরের লাইসেন্স বাধ্যতামূলক।",
        },
        {
          title: "Fire Service & Civil Defence Approval & Factory Law Standards",
          titleBn: "ফায়ার সার্ভিস লাইসেন্স, রাজউক ও কারখানা আইন প্রতিপালন",
          duration: "14 mins",
          durationBn: "১৪ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Install dual 50kg ABC dry powder wheeled extinguishers, fire hydrants, and clear 3-meter safety egress corridors at all times.",
          notesBn:
            "৫০ কেজি এবিসি চাকাযুক্ত ফায়ার এক্সটিংগুইশার, ফায়ার হাইড্রেন্ট পয়েন্ট এবং ৩ মিটার জরুরি বহির্গমন করিডোর নিশ্চিতকরণ।",
        },
        {
          title: "Comprehensive Commercial Hazard Identification & SOP Checklist",
          titleBn: "বাণিজ্যিক ঝুঁকি মূল্যায়ন, কোয়ার্টারলি লগশিট ও এসওপি চেকলিস্ট",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Execute mandatory weekly soap bubble leak inspections, quarterly PRV test logs, and annual certified acoustic emissions surveys.",
          notesBn:
            "সাপ্তাহিক সাবান-পানির টেস্ট, কোয়ার্টারলি ভালভ ইন্সপেকশন এবং বাৎসরিক অডিট রিপোর্ট সংরক্ষিত রাখা।",
        },
        {
          title: "Industrial Emergency Evacuation Drill, Containment & Reporting",
          titleBn: "শিল্প কারখানার জরুরি মহড়া, রেসপন্স প্রটোকল ও তদন্ত প্রতিবেদন",
          duration: "15 mins",
          durationBn: "১৫ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Implement incident command hierarchy: activate sirens, isolate main valves, evacuate muster point, notify Fire Service & DoE inspectors.",
          notesBn:
            "জরুরি পরিস্থিতিতে সাইরেন বাজানো, মূল সরবরাহ বিচ্ছিন্ন করা, নির্দিষ্ট সমাবেশ স্থানে স্থানান্তর ও নিয়ন্ত্রক সংস্থাকে রিপোর্ট করা।",
        },
      ],
    },
  ],
};

// =========================================================================
// 3. QUIZZES (Question Banks with Single, Multi, True/False, 70% pass, timer)
// =========================================================================
const freeQuizData = {
  courseId: "1",
  title: "LPG Household Safety Assessment & Certification Exam",
  titleBn: "গৃহস্থালি এলপিজি নিরাপত্তা মূল্যায়ন ও সনদপত্র পরীক্ষা",
  description:
    "Comprehensive assessment testing your practical knowledge on LPG properties, leak emergency containment, zero-spark cross-ventilation, and extinguisher handling.",
  durationMinutes: 15,
  timerEnabled: true,
  passPercentage: 70,
  questionsPerQuiz: 6,
  cooldownMinutes: 15,
  shuffleOptions: true,
  isPublished: true,
  questionBank: [
    {
      id: "q1_1",
      question: "Is LPG vapor heavier or lighter than atmospheric ambient air?",
      questionBn: "এলপিজি বাষ্প সাধারণ বায়ুমণ্ডলের বাতাসের চেয়ে ভারী নাকি হালকা?",
      type: "single",
      points: 1,
      options: [
        {
          id: "opt_1_1",
          text: "1.5 to 2.0 times heavier (it pools along the floor and depressions)",
          textBn: "১.৫ থেকে ২.০ গুণ ভারী (মেঝে ও নিচু স্থানে জমা হয়)",
          isCorrect: true,
        },
        {
          id: "opt_1_2",
          text: "Much lighter (it floats directly to the ceiling like natural methane)",
          textBn: "অনেক হালকা (মিথেন গ্যাসের মতো সোজা ছাদে উঠে যায়)",
          isCorrect: false,
        },
        {
          id: "opt_1_3",
          text: "Exactly the same density as ambient room air",
          textBn: "বাতাসের ঘনত্বের একদম সমান",
          isCorrect: false,
        },
        {
          id: "opt_1_4",
          text: "It dissolves instantly in air without settling anywhere",
          textBn: "বাতাসে সাথে সাথে মিশে গিয়ে কোনো স্থানে জমে না",
          isCorrect: false,
        },
      ],
      explanation:
        "LPG vapor has a vapor density of approximately 1.5 - 2.0 relative to air, causing it to sink and accumulate at floor level.",
      explanationBn:
        "এলপিজি গ্যাস বাতাসের চেয়ে দেড় থেকে দুই গুণ ভারী হওয়ায় লিকেজ হলে এটি মেঝের দিকে নিচু হয়ে জমা হয়।",
    },
    {
      id: "q1_2",
      question:
        "What should you STRICTLY AVOID doing immediately upon smelling a strong gas leak in your kitchen?",
      questionBn:
        "রান্নাঘরে গ্যাসের তীব্র গন্ধ পেলে নিচের কোন কাজটি কোনো অবস্থাতেই করা যাবে না?",
      type: "single",
      points: 1,
      options: [
        {
          id: "opt_2_1",
          text: "Turning electric light switches or exhaust fans ON or OFF",
          textBn: "বৈদ্যুতিক বাতি বা এক্সহস্ট ফ্যানের সুইচ অন বা অফ করা",
          isCorrect: true,
        },
        {
          id: "opt_2_2",
          text: "Opening all kitchen doors and windows for cross-ventilation",
          textBn: "বাতাস চলাচলের জন্য রান্নাঘরের সব দরজা-জানালা খুলে দেওয়া",
          isCorrect: false,
        },
        {
          id: "opt_2_3",
          text: "Turning off the cylinder regulator knob if safe to reach",
          textBn: "সম্ভব হলে রেগুলেটরের নব ঘুরিয়ে সংযোগ বন্ধ করা",
          isCorrect: false,
        },
        {
          id: "opt_2_4",
          text: "Evacuating children and family members to an open outdoor space",
          textBn: "পরিবারের সদস্যদের নিরাপদ উন্মুক্ত স্থানে সরিয়ে নেওয়া",
          isCorrect: false,
        },
      ],
      explanation:
        "Flipping electrical switches creates tiny micro-sparks inside the switch contact points that can trigger an instant LPG gas explosion.",
      explanationBn:
        "বৈদ্যুতিক সুইচ অন বা অফ করার সময় সুইচের ভেতরে যে ছোট স্ফুলিঙ্গ তৈরি হয় তা আবদ্ধ গ্যাসে তাৎক্ষণিক বিস্ফোরণ ঘটাতে পারে।",
    },
    {
      id: "q1_3",
      question:
        "Which of the following are safe practices when handling household LPG cylinders? (Select all that apply)",
      questionBn:
        "গৃহস্থালি এলপিজি সিলিন্ডার ব্যবহারের ক্ষেত্রে নিচের কোনগুলো সঠিক নিরাপত্তা অনুশীলন? (সবগুলো প্রযোজ্য উত্তর নির্বাচন করুন)",
      type: "multiple",
      points: 1,
      options: [
        {
          id: "opt_3_1",
          text: "Always keeping the cylinder standing upright on a flat surface",
          textBn: "সিলিন্ডার সবসময় সমতল মেঝেতে খাড়াভাবে সোজা রাখা",
          isCorrect: true,
        },
        {
          id: "opt_3_2",
          text: "Testing for leaks using liquid soapy water lather instead of a matchstick",
          textBn: "আগুনের পরিবর্তে সাবানের ফেনা বা সাবান-পানি দিয়ে লিকেজ পরীক্ষা করা",
          isCorrect: true,
        },
        {
          id: "opt_3_3",
          text: "Igniting the match/lighter first before turning on the burner knob",
          textBn: "চুলার নব ঘোরানোর আগে দিয়াশলাই বা লাইটার জ্বালিয়ে প্রস্তুত রাখা",
          isCorrect: true,
        },
        {
          id: "opt_3_4",
          text: "Storing spare cylinders sideways under low kitchen cabinets",
          textBn: "অতিরিক্ত সিলিন্ডার রান্নাঘরের ক্যাবিনেটের নিচে কাত করে রাখা",
          isCorrect: false,
        },
      ],
      explanation:
        "Cylinders must stand upright, tested with soap froth, and lighted before turning gas on. Never store cylinders sideways in cabinets.",
      explanationBn:
        "সিলিন্ডার সর্বদা সোজা রাখা, সাবানের ফেনা দিয়ে টেস্ট করা এবং নব খোলার আগেই আগুন প্রস্তুত রাখা সঠিক নিয়ম।",
    },
    {
      id: "q1_4",
      question:
        "Pure commercial LPG has a strong natural foul odor of its own without any chemical additives.",
      questionBn:
        "বিশুদ্ধ এলপিজি গ্যাসে কোনো কেমিক্যাল না মিশালেও এটি প্রাকৃতিকভাবেই তীব্র দুর্গন্ধযুক্ত।",
      type: "true_false",
      points: 1,
      options: [
        {
          id: "opt_4_1",
          text: "True (সত্য)",
          textBn: "সত্য",
          isCorrect: false,
        },
        {
          id: "opt_4_2",
          text: "False (মিথ্যা - ইথাইল মারক্যাপ্টান মিশিয়ে তীব্র গন্ধ তৈরি করা হয়)",
          textBn: "মিথ্যা (ইথাইল মারক্যাপ্টান মিশিয়ে কৃত্রিম তীব্র গন্ধ তৈরি করা হয়)",
          isCorrect: true,
        },
      ],
      explanation:
        "Pure LPG is naturally odorless and colorless. An odorant called Ethyl Mercaptan is added deliberately to detect leaks.",
      explanationBn:
        "বিশুদ্ধ এলপিজি সম্পূর্ণ গন্ধহীন। লিকেজ হলে যাতে সাধারণ মানুষ গন্ধ পায় সেজন্য ইথাইল মারক্যাপ্টান নামক তীব্র গন্ধযুক্ত যৌগ যোগ করা হয়।",
    },
    {
      id: "q1_5",
      question:
        "What is the official nationwide hotline number for emergency LPG assistance and safety dispatch in Bangladesh?",
      questionBn:
        "বাংলাদেশে জরুরি এলপিজি সহায়তা ও নিরাপত্তা প্রটোকলের জন্য অনুমোদিত জাতীয় হেল্পলাইন নম্বর কোনটি?",
      type: "single",
      points: 1,
      options: [
        {
          id: "opt_5_1",
          text: "16137 (National LPG Emergency Helpline)",
          textBn: "১৬১৩৭ (জাতীয় এলপিজি জরুরি হেল্পলাইন)",
          isCorrect: true,
        },
        {
          id: "opt_5_2",
          text: "109",
          textBn: "১০৯",
          isCorrect: false,
        },
        {
          id: "opt_5_3",
          text: "333",
          textBn: "৩৩৩",
          isCorrect: false,
        },
        {
          id: "opt_5_4",
          text: "16247",
          textBn: "১৬২৪৭",
          isCorrect: false,
        },
      ],
      explanation:
        "16137 is the dedicated 24/7 National LPG Emergency Helpline for swift containment advice and courier dispatch.",
      explanationBn:
        "১৬১৩৭ হলো ২৪/৭ জাতীয় এলপিজি জরুরি হেল্পলাইন যা যেকোনো গ্যাস সংক্রান্ত জরুরি সহায়তায় সেবা প্রদান করে।",
    },
    {
      id: "q1_6",
      question:
        "Using a burning matchstick to detect small gas leaks around a cylinder neck is an acceptable practice if done quickly.",
      questionBn:
        "খুব দ্রুত করলে সিলিন্ডারের নেকের কাছে গ্যাস লিকেজ চেক করার জন্য জ্বলন্ত ম্যাচকাঠি ব্যবহার করা যেতে পারে।",
      type: "true_false",
      points: 1,
      options: [
        {
          id: "opt_6_1",
          text: "True (সত্য)",
          textBn: "সত্য",
          isCorrect: false,
        },
        {
          id: "opt_6_2",
          text: "False (মিথ্যা - এটি মারাত্মক বিপজ্জনক ও সম্পূর্ণরূপে নিষিদ্ধ)",
          textBn: "মিথ্যা (এটি মারাত্মক বিপজ্জনক ও সম্পূর্ণরূপে নিষিদ্ধ)",
          isCorrect: true,
        },
      ],
      explanation:
        "NEVER bring an open flame near suspected gas leakage. This can ignite the escaping vapor instantaneously and cause catastrophic fire.",
      explanationBn:
        "কোনো অবস্থাতেই গ্যাসের লিকেজ চেক করতে আগুন ব্যবহার করা যাবে না। সাবান-পানি ব্যবহার করাই একমাত্র অনুমোদিত নিরাপদ উপায়।",
    },
  ],
};

const paidQuizData = {
  courseId: "2",
  title: "Commercial LPG Safety & Compliance Certification Assessment",
  titleBn: "বাণিজ্যিক এলপিজি নিরাপত্তা ও সংবিধিবদ্ধ সম্মতি মূল্যায়ন",
  description:
    "Rigorous professional examination covering Gas Cylinder Rules 1991 (amended 2004), commercial manifold sizing, automatic solenoid interlocks, and DoE audit inspection codes.",
  durationMinutes: 15,
  timerEnabled: true,
  passPercentage: 70,
  questionsPerQuiz: 6,
  cooldownMinutes: 15,
  shuffleOptions: true,
  isPublished: true,
  questionBank: [
    {
      id: "qp_1",
      question:
        "Under the Gas Cylinder Rules 1991, where must commercial multi-cylinder manifold banks be legally situated?",
      questionBn:
        "গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ অনুযায়ী বাণিজ্যিক মাল্টি-সিলিন্ডার ব্যাংক আইনত কোথায় স্থাপন করতে হবে?",
      type: "single",
      points: 1,
      options: [
        {
          id: "opt_p1_1",
          text: "Outside cooking areas in a well-ventilated, non-combustible shelter with natural louvers",
          textBn: "রান্নাঘরের বাইরে প্রাকৃতিক বায়ু চলাচলযুক্ত অগ্নিনিরোধক উন্মুক্ত শেডে",
          isCorrect: true,
        },
        {
          id: "opt_p1_2",
          text: "Directly under the commercial cooking ranges for shortest pipe runs",
          textBn: "পাইপ ছোট করার জন্য সরাসরি চুলার নিচে ক্যাবিনেটে",
          isCorrect: false,
        },
        {
          id: "opt_p1_3",
          text: "In the central basement storage alongside diesel generators",
          textBn: "জেনারেটরের সাথে ভূগর্ভস্থ বেজমেন্টে",
          isCorrect: false,
        },
        {
          id: "opt_p1_4",
          text: "Inside the food preparation pantry room behind closed doors",
          textBn: "রান্নাঘরের প্যান্ট্রি রুমে দরজার পেছনে",
          isCorrect: false,
        },
      ],
      explanation:
        "Statutory codes prohibit multi-cylinder manifold banks inside cooking areas. They must be placed outdoors in ventilated masonry enclosures.",
      explanationBn:
        "সংবিধিবদ্ধ আইন অনুযায়ী একাধিক সিলিন্ডার ম্যানিফোল্ড ব্যাংক কখনোই রান্নাঘরের ভেতরে রাখা যাবে না, অবশ্যই বাইরে খোলা শেডে রাখতে হবে।",
    },
    {
      id: "qp_2",
      question:
        "Which of the following safety automated systems are mandatory for commercial restaurant LPG installations? (Select all that apply)",
      questionBn:
        "বাণিজ্যিক রেস্তোরাঁ ও হোটেলের ক্ষেত্রে নিচের কোন স্বয়ংক্রিয় নিরাপত্তা ব্যবস্থাগুলো থাকা আবশ্যক? (সবগুলো প্রযোজ্য উত্তর নির্বাচন করুন)",
      type: "multiple",
      points: 1,
      options: [
        {
          id: "opt_p2_1",
          text: "Automated Solenoid Emergency Shut-off Valve interlocked to gas sensors",
          textBn: "গ্যাস সেন্সরের সাথে যুক্ত স্বয়ংক্রিয় সোলেনয়েড শাট-অফ ভালভ",
          isCorrect: true,
        },
        {
          id: "opt_p2_2",
          text: "Gas sensors calibrated to trigger at 10-20% Lower Explosive Limit (LEL)",
          textBn: "১০-২০% এলইএল গ্যাস ঘনত্বে স্বয়ংক্রিয়ভাবে সক্রিয় হওয়া গ্যাস সেন্সর",
          isCorrect: true,
        },
        {
          id: "opt_p2_3",
          text: "Kitchen mechanical exhaust hood electrical interlock system",
          textBn: "এক্সহস্ট ফ্যান চালু না থাকলে গ্যাস সরবরাহ বন্ধ রাখার ইন্টারলক ব্যবস্থা",
          isCorrect: true,
        },
        {
          id: "opt_p2_4",
          text: "Flexible plastic garden water hoses connecting commercial burners",
          textBn: "চুলার সাথে সাধারণ প্লাস্টিকের পানির পাইপ সংযোগ",
          isCorrect: false,
        },
      ],
      explanation:
        "Commercial codes require certified solenoid shut-off valves, 10-20% LEL calibrated sensors, and kitchen exhaust interlocks.",
      explanationBn:
        "বাণিজ্যিক প্রতিষ্ঠানে সোলেনয়েড ভালভ, সেন্সর এবং কিচেন হুড ইন্টারলক সিস্টেম থাকা আইনত বাধ্যতামূলক।",
    },
    {
      id: "qp_3",
      question:
        "At what percentage of Lower Explosive Limit (LEL) should commercial gas detection systems trigger an automatic solenoid shut-off?",
      questionBn:
        "বাণিজ্যিক গ্যাস ডিটেকশন সিস্টেমে লোয়ার এক্সপ্লোসিভ লিমিটের (LEL) শতকরা কত ঘনত্বে অটো শাট-অফ সক্রিয় হওয়া উচিত?",
      type: "single",
      points: 1,
      options: [
        {
          id: "opt_p3_1",
          text: "Between 10% to 20% LEL",
          textBn: "১০% থেকে ২০% LEL এর মধ্যে",
          isCorrect: true,
        },
        {
          id: "opt_p3_2",
          text: "At 100% LEL when flame is already visible",
          textBn: "১০০% LEL এ যখন আগুন ধরে যায়",
          isCorrect: false,
        },
        {
          id: "opt_p3_3",
          text: "Above 85% LEL",
          textBn: "৮৫% LEL এর বেশি হলে",
          isCorrect: false,
        },
        {
          id: "opt_p3_4",
          text: "LEL monitoring is not applicable to commercial kitchens",
          textBn: "রেস্তোরাঁর রান্নাঘরে এলইএল পরিমাপ প্রযোজ্য নয়",
          isCorrect: false,
        },
      ],
      explanation:
        "Sensors trigger safety solenoids at 10% to 20% of LEL to isolate gas long before reaching combustible concentration (100% LEL).",
      explanationBn:
        "বিস্ফোরণ ঘটার অনেক আগেই (১০% থেকে ২০% LEL ঘনত্বে) সেন্সর সংকেত পাঠিয়ে গ্যাস লাইন সম্পূর্ণ লক করে দেয়।",
    },
    {
      id: "qp_4",
      question:
        "It is legally permissible to route commercial LPG gas pipelines through air conditioning return ducts or elevator shafts.",
      questionBn:
        "বাণিজ্যিক এলপিজি গ্যাস পাইপলাইন শীতাতপ নিয়ন্ত্রণকারী (এসি) ডাক্ট বা লিফটের শ্যাফটের মধ্য দিয়ে নিয়ে যাওয়া আইনত বৈধ।",
      type: "true_false",
      points: 1,
      options: [
        {
          id: "opt_p4_1",
          text: "True (সত্য)",
          textBn: "সত্য",
          isCorrect: false,
        },
        {
          id: "opt_p4_2",
          text: "False (মিথ্যা - এটি সম্পূর্ণ নিষিদ্ধ ও মারাত্মক আইন লঙ্ঘন)",
          textBn: "মিথ্যা (এটি সম্পূর্ণ নিষিদ্ধ ও মারাত্মক আইন লঙ্ঘন)",
          isCorrect: true,
        },
      ],
      explanation:
        "Statutory building codes strictly prohibit running gas pipes through ventilation ducts, elevator shafts, or unventilated false ceilings.",
      explanationBn:
        "এসি ডাক্ট বা লিফট শ্যাফটের মধ্য দিয়ে গ্যাস পাইপ নেওয়া সম্পূর্ণ নিষিদ্ধ, কারণ লিকেজ হলে পুরো ভবনে মুহূর্তেই গ্যাস ছড়িয়ে পড়তে পারে।",
    },
    {
      id: "qp_5",
      question:
        "How frequently must commercial LPG Pressure Relief Valves (PRV) and high-pressure regulators undergo statutory testing & recalibration?",
      questionBn:
        "বাণিজ্যিক এলপিজি প্রেসার রিলিফ ভালভ (PRV) এবং রেগুলেটর কত সময় পর পর সংবিধিবদ্ধভাবে পরীক্ষা ও ক্যালিব্রেশন করতে হয়?",
      type: "single",
      points: 1,
      options: [
        {
          id: "opt_p5_1",
          text: "Quarterly inspection with annual certified hydrostatic calibration",
          textBn: "প্রতি ৩ মাস অন্তর পরিদর্শন ও বাৎসরিক সার্টিফাইড ক্যালিব্রেশন",
          isCorrect: true,
        },
        {
          id: "opt_p5_2",
          text: "Never, regulators do not require inspection",
          textBn: "কখনোই নয়, এগুলো পরীক্ষার প্রয়োজন নেই",
          isCorrect: false,
        },
        {
          id: "opt_p5_3",
          text: "Only once every 15 years",
          textBn: "১৫ বছরে মাত্র একবার",
          isCorrect: false,
        },
        {
          id: "opt_p5_4",
          text: "Only after an active explosion occurs",
          textBn: "দুর্ঘটনা ঘটার পর মাত্র একবার",
          isCorrect: false,
        },
      ],
      explanation:
        "Industry standards dictate quarterly operational log audits and annual certified hydrostatic pressure safety release testing.",
      explanationBn:
        "কোয়ার্টারলি চেকলিস্ট অডিট এবং বাৎসরিক সার্টিফাইড হাইড্রোস্ট্যাটিক ক্যালিব্রেশন বাণিজ্যিক লাইনের জন্য বাধ্যতামূলক।",
    },
    {
      id: "qp_6",
      question:
        "Emergency shut-off pull valves in commercial restaurant manifold rooms must be clearly accessible and never obstructed by inventory crates.",
      questionBn:
        "বাণিজ্যিক রেস্তোরাঁর ম্যানিফোল্ড রুমে জরুরি শাট-অফ ভালভ সবসময় বাধাহীন ও সহজে পৌঁছানো যায় এমন অবস্থায় রাখতে হবে।",
      type: "true_false",
      points: 1,
      options: [
        {
          id: "opt_p6_1",
          text: "True (সত্য - জরুরি শাট-অফ ভালভ সব সময় বাধাহীন রাখতে হবে)",
          textBn: "সত্য (জরুরি শাট-অফ ভালভ সব সময় বাধাহীন রাখতে হবে)",
          isCorrect: true,
        },
        {
          id: "opt_p6_2",
          text: "False (মিথ্যা)",
          textBn: "মিথ্যা",
          isCorrect: false,
        },
      ],
      explanation:
        "Clear egress and instant access to emergency manual shut-off valves is mandatory for fire inspection compliance.",
      explanationBn:
        "জরুরি ভালভের সামনে মালামাল বা বক্স রেখে রাস্তা আটকে রাখা বড় ধরনের নিরাপত্তা ব্যত্যয় ও সম্পূর্ণ নিষিদ্ধ।",
    },
  ],
};

// =========================================================================
// RUN SEEDING SCRIPT
// =========================================================================
async function runSeed() {
  try {
    const mongoUri = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ael";
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log("[Seed] 1. Purging old courses and quizzes collections...");
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    // Reset user enrolled courses test state so testing starts completely clean
    console.log("[Seed] 2. Resetting test users enrolled courses progress...");
    await User.updateMany(
      {},
      {
        $set: {
          enrolledCourses: [],
        },
      }
    );

    console.log("[Seed] 3. Inserting Free Course (3 modules: 3, 4, 4 videos)...");
    const createdFreeCourse = await Course.create(freeCourseData);
    console.log(
      `   -> Created Free Course: ID ${createdFreeCourse.courseId} ("${createdFreeCourse.title}")`
    );

    console.log("[Seed] 4. Inserting Paid Course (3 modules: 3, 4, 4 videos)...");
    const createdPaidCourse = await Course.create(paidCourseData);
    console.log(
      `   -> Created Paid Course: ID ${createdPaidCourse.courseId} ("${createdPaidCourse.title}")`
    );

    console.log("[Seed] 5. Inserting Free Course Quiz & Question Bank...");
    await Quiz.create(freeQuizData);
    console.log("   -> Created Free Quiz with Question Bank (6 questions)");

    console.log("[Seed] 6. Inserting Paid Course Quiz & Question Bank...");
    await Quiz.create(paidQuizData);
    console.log("   -> Created Paid Quiz with Question Bank (6 questions)");

    console.log("\n========================================================");
    console.log("SUCCESS! Database cleanly seeded with 2 full courses:");
    console.log("1. Free Course: 3 Modules (3, 4, 4 videos = 11 lessons) + Quiz Exam + Certificate");
    console.log("2. Paid Course: 3 Modules (3, 4, 4 videos = 11 lessons) + Quiz Exam + Certificate");
    console.log("All sample videos linked to: " + sampleVideoUrl);
    console.log("========================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error executing seed:", error);
    process.exit(1);
  }
}

runSeed();

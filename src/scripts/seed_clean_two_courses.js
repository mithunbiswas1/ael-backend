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
import { Certificate } from "../models/certificate.model.js";

const sampleVideoUrl = "/sample-course-video.mp4";

// =========================================================================
// 1. FREE COURSE (3 Modules: 3 videos + 1.4 Quiz, 4 videos + 2.5 Quiz, 1 video + 3.2 Final Exam)
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
  duration: "1h 35m",
  durationBn: "১ ঘণ্টা ৩৫ মিনিট",
  totalLessons: 8,
  totalQuizzes: 3,
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
  learningPoints: [
    "Master the physical behavior and density of LPG vapor compared to ambient atmospheric air.",
    "Inspect cylinder O-ring seals, low-pressure regulators, and steel-reinforced rubber hoses.",
    "Implement zero-spark cross-ventilation protocols during suspected gas leakage emergencies.",
    "Correctly operate Dry Chemical Powder (DCP) extinguishers using the P.A.S.S. methodology.",
  ],
  learningPointsBn: [
    "এলপিজি বাষ্পের বৈশিষ্ট্য ও বাতাসের চেয়ে ভারী হওয়ার ঝুঁকি সম্পর্কে সম্যক জ্ঞান অর্জন।",
    "সিলিন্ডারের রাবার ও-রিং, রেগুলেটর ক্লিপ ও মেটালিক হোসপাইপ সঠিকভাবে পরীক্ষা ও স্থাপন।",
    "গ্যাস লিকেজের সময় কোনো সুইচ স্পর্শ না করে সঠিক ক্রস-ভেন্টিলেশন প্রোটোকল বাস্তবায়ন।",
    "ডিসিবি অগ্নিনির্বাপক যন্ত্রের সঠিক ব্যবহার এবং জাতীয় জরুরি হেল্পলাইনে (১৬১৩৭) যোগাযোগের কৌশল।",
  ],
  curriculum: [
    // -------------------------------------------------------------
    // MODULE 1: 3 Videos (1.1, 1.2, 1.3) + 1.4 Assessment Quiz
    // -------------------------------------------------------------
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
      quiz: {
        title: "Module 1 Safety & Cylinder Inspection Quiz",
        titleBn: "মডিউল ১: নিরাপত্তা ও সিলিন্ডার পরীক্ষণ কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "Is LPG vapor heavier or lighter than atmospheric ambient air?",
            questionBn: "এলপিজি বাষ্প সাধারণ বায়ুমণ্ডলের বাতাসের চেয়ে ভারী নাকি হালকা?",
            options: [
              "1.5 to 2.0 times heavier (it pools along the floor and depressions)",
              "Much lighter (it floats directly to the ceiling like natural methane)",
              "Exactly the same density as ambient room air",
              "It dissolves instantly in air without settling anywhere",
            ],
            optionsBn: [
              "১.৫ থেকে ২.০ গুণ ভারী (মেঝে ও নিচু স্থানে জমা হয়)",
              "অনেক হালকা (মিথেন গ্যাসের মতো সোজা ছাদে উঠে যায়)",
              "বাতাসের ঘনত্বের একদম সমান",
              "বাতাসে সাথে সাথে মিশে গিয়ে কোনো স্থানে জমে না",
            ],
            correctAnswer: 0,
            explanation:
              "LPG vapor has a relative density of 1.5 to 2.0 compared to air, which causes it to sink and pool at floor level during leaks.",
            explanationBn:
              "এলপিজি বাষ্প বাতাসের চেয়ে দেড় থেকে দুই গুণ ভারী হওয়ায় লিকেজ হলে তা মেঝের দিকে নিচু হয়ে জমা হয়।",
          },
          {
            question: "Pure commercial LPG has a strong natural foul odor of its own without any chemical additives.",
            questionBn: "বিশুদ্ধ বাণিজ্যিক এলপিজি গ্যাসে কোনো কেমিক্যাল না মিশালেও এটি প্রাকৃতিকভাবেই তীব্র দুর্গন্ধযুক্ত।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 1,
            explanation:
              "Pure LPG is completely odorless. Ethyl Mercaptan is added artificially to give it a strong warning odor.",
            explanationBn:
              "বিশুদ্ধ এলপিজি সম্পূর্ণ গন্ধহীন। লিকেজ সহজে শনাক্ত করার জন্য এতে তীব্র গন্ধযুক্ত ইথাইল মারক্যাপ্টান মেশানো হয়।",
          },
          {
            question: "Which method is the ONLY safe and approved procedure to detect gas leakage around a cylinder?",
            questionBn: "সিলিন্ডারের সংযোগে গ্যাস লিকেজ পরীক্ষা করার একমাত্র নিরাপদ ও অনুমোদিত পদ্ধতি কোনটি?",
            options: [
              "Applying liquid soapy water foam around the valve and regulator neck",
              "Holding a lit matchstick near the valve to see if a flame catches",
              "Listening closely with ear pressed against the regulator valve",
              "Smelling with nose directly touching the open valve port",
            ],
            optionsBn: [
              "রেগুলেটর ও ভালভের সংযোগে সাবান-পানির ফেনা প্রয়োগ করে বুদবুদ দেখা",
              "ভালভের কাছে জ্বলন্ত দেশলাই কাঠি ধরে আগুন জ্বলে কি না দেখা",
              "রেগুলেটরের গায়ে কান চেপে ধরে শব্দ শোনার চেষ্টা করা",
              "খোলা ভালভের মুখে সরাসরি নাক দিয়ে গন্ধ শোঁকা",
            ],
            correctAnswer: 0,
            explanation:
              "Liquid soapy water bubbles clearly reveal gas escaping without creating any fire hazard.",
            explanationBn:
              "সাবান-পানির ফেনা দিলে গ্যাসের চাপে বুদবুদ তৈরি হয়, যা আগুন ছাড়াই সম্পূর্ণ নিরাপদে লিকেজ প্রমাণ করে।",
          },
          {
            question: "Using an open flame or matchstick to quickly check for gas leaks is acceptable if done outdoors.",
            questionBn: "উন্মুক্ত স্থানে দ্রুত গ্যাস লিকেজ চেক করার জন্য জ্বলন্ত ম্যাচকাঠি ব্যবহার করা নিরাপদ।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 1,
            explanation:
              "Never bring an open flame near suspected gas leakage under any circumstances.",
            explanationBn:
              "কোনো অবস্থাতেই গ্যাসের লিকেজ চেক করতে আগুন ব্যবহার করা যাবে না। এটি মারাত্মক বিস্ফোরণ ঘটাতে পারে।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 2: 4 Videos (2.1, 2.2, 2.3, 2.4) + 2.5 Assessment Quiz
    // -------------------------------------------------------------
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
      quiz: {
        title: "Module 2 Kitchen Operations & Leak Prevention Quiz",
        titleBn: "মডিউল ২: রান্নাঘরের ব্যবহার ও লিকেজ প্রতিরোধ কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "What is the correct protocol when lighting a manual gas stove?",
            questionBn: "ম্যানুয়াল গ্যাস চুলা জ্বালানোর সময় সঠিক প্রোটোকল কোনটি?",
            options: [
              "Light the match/lighter FIRST, then turn on the burner knob",
              "Turn on the burner knob, wait 10 seconds, then search for a lighter",
              "Keep the burner knob on high while opening windows",
              "Light the match only after hearing strong gas hissing",
            ],
            optionsBn: [
              "আগে দেশলাই বা লাইটার জ্বালিয়ে প্রস্তুত করুন, তারপর চুলার নব ঘুরান",
              "চুলার নব আগে ঘুরিয়ে ১০ সেকেন্ড পর লাইটার খুঁজুন",
              "জানালা খোলার সময় চুলার নব ফুল চালু রাখুন",
              "গ্যাস বের হওয়ার হিসহিস শব্দ পাওয়ার পর লাইটার জ্বালান",
            ],
            correctAnswer: 0,
            explanation:
              "Always have the flame ready first so unburned gas does not accumulate over the stove before ignition.",
            explanationBn:
              "সবসময় আগে ম্যাচ বা লাইটার জ্বালিয়ে তারপর চুলার নব ঘোরান, যাতে বাতাসে গ্যাস জমে না থাকে।",
          },
          {
            question: "LPG cylinders can safely be laid on their sides or inverted to extract remaining gas.",
            questionBn: "শেষের গ্যাস ব্যবহারের জন্য সিলিন্ডার কাত করে বা উল্টো করে রাখা সম্পূর্ণ নিরাপদ।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 1,
            explanation:
              "Never tilt or invert a cylinder! Tilting can force liquid LPG into the regulator, causing sudden high-pressure flare-ups.",
            explanationBn:
              "সিলিন্ডার কাত বা উল্টো করলে তরল গ্যাস রেগুলেটরে প্রবেশ করে ভয়াবহ অগ্নিকাণ্ড ঘটাতে পারে। সিলিন্ডার সর্বদা সোজা রাখতে হবে।",
          },
          {
            question: "What is the minimum safe clearance distance between an LPG cylinder and the cooking stove?",
            questionBn: "এলপিজি সিলিন্ডার এবং রান্নার চুলার মধ্যে ন্যূনতম নিরাপদ দূরত্ব কত?",
            options: [
              "At least 1 meter (approx. 3 feet) on a flat level floor",
              "Directly underneath the cooking burner without any gap",
              "No minimum distance is required",
              "Minimum 10 meters away in another building",
            ],
            optionsBn: [
              "সমতল মেঝেতে কমপক্ষে ১ মিটার (প্রায় ৩ ফুট) দূরত্ব বজায় রাখা",
              "চুলার ঠিক নিচেই কোনো ফাঁকা জায়গা ছাড়া রাখা",
              "কোনো দূরত্বের প্রয়োজন নেই",
              "অন্য ভবনে কমপক্ষে ১০ মিটার দূরে রাখা",
            ],
            correctAnswer: 0,
            explanation:
              "Maintain at least 1 meter clearance between the cylinder and direct stove heat sources.",
            explanationBn:
              "সিলিন্ডার ও চুলার মধ্যে কমপক্ষে ১ মিটার দূরত্ব রাখা বাধ্যতামূলক যাতে চুলার তাপে সিলিন্ডার গরম না হয়।",
          },
          {
            question: "Keeping kitchen windows open for positive natural cross-ventilation prevents flammable gas accumulation.",
            questionBn: "রান্নাঘরের জানালা খোলা রেখে স্বাভাবিক বায়ু চলাচল নিশ্চিত করলে বিপজ্জনক গ্যাস জমে থাকা প্রতিরোধ হয়।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Natural cross-ventilation allows ambient airflow to dilute and disperse any minor gas leak safely.",
            explanationBn:
              "রান্নার সময় পর্যাপ্ত বায়ু চলাচল নিশ্চিত করলে কোনো লিকেজ থাকলে তা জমে না থেকে সহজে বের হয়ে যায়।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 3: 1 Video (3.1) + 3.2 Final Certification Exam
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 3: Emergency Gas Leak Response & Final Certification",
      moduleTitleBn: "মডিউল ৩: গ্যাস লিকেজ জরুরি অবস্থা ও সমাপনী সনদপত্র মূল্যায়ন",
      isFree: true,
      lessons: [
        {
          title: "Emergency Response SOP, Zero-Spark Protocol & Fire Extinguisher Operation",
          titleBn: "জরুরি রেসপন্স এসওপি, জিরো-স্পার্ক নিয়ম ও অগ্নিনির্বাপক পরিচালনা",
          duration: "14 mins",
          durationBn: "১৪ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Zero-Spark protocol: Do NOT touch switches, evacuate swiftly, call National LPG Hotline 16137. Master PASS method for DCP extinguisher.",
          notesBn:
            "জিরো-স্পার্ক নিয়ম: কোনো সুইচ স্পর্শ করবেন না, দ্রুত নিরাপদ স্থানে যান এবং জাতীয় হেল্পলাইন ১৬১৩৭ এ কল দিন। অগ্নিনির্বাপকের পি.এ.এস.এস পদ্ধতি আয়ত্ত করুন।",
        },
      ],
      quiz: {
        title: "Final Household LPG Safety Certification Exam",
        titleBn: "সমাপনী গৃহস্থালি এলপিজি নিরাপত্তা সনদপত্র পরীক্ষা",
        durationMinutes: 15,
        passingScore: 70,
        questions: [
          {
            question: "What is the strictly enforced 'Zero-Spark Protocol' during an acute gas leak emergency?",
            questionBn: "তীব্র গ্যাস লিকেজের সময় 'জিরো স্পার্ক প্রোটোকল' অনুযায়ী কোনটি সম্পূর্ণ নিষিদ্ধ?",
            options: [
              "Do NOT flip any electrical light switches or exhaust fan switches ON or OFF",
              "Immediately turn on the exhaust fan to blow gas away",
              "Turn on all lights to locate the leak source in the dark",
              "Charge mobile phones inside the kitchen while waiting",
            ],
            optionsBn: [
              "কোনো বৈদ্যুতিক বাতি বা এক্সহস্ট ফ্যানের সুইচ অন বা অফ করবেন না",
              "গ্যাস বের করার জন্য দ্রুত এক্সহস্ট ফ্যানের সুইচ অন করবেন",
              "অন্ধকারে লিকেজ দেখতে সব লাইট জ্বালিয়ে দেবেন",
              "রান্নাঘরে বসে ফোনে চার্জ দেবেন",
            ],
            correctAnswer: 0,
            explanation:
              "Switch contacts produce micro-sparks that can instantly detonate accumulated LPG vapor. Leave electrical switches untouched.",
            explanationBn:
              "সুইচ অন বা অফ করার সময় যে ক্ষুদ্র স্ফুলিঙ্গ তৈরি হয় তা আবদ্ধ গ্যাসে মুহূর্তেই ভয়াবহ বিস্ফোরণ ঘটাতে পারে।",
          },
          {
            question: "In the event of cylinder valve ignition, smothering the collar with a wet jute sack or thick damp blanket cuts the oxygen supply.",
            questionBn: "সিলিন্ডারের মুখে আগুন লাগলে ভেজা মোটা চটের বস্তা বা কম্বল দৃঢ়ভাবে পেঁচিয়ে দিলে বাতাসের অক্সিজেন সংযোগ বিচ্ছিন্ন হয়ে আগুন নিভে যায়।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Smothering the collar firmly with a soaked non-synthetic material starves the fire of oxygen, extinguishing it safely.",
            explanationBn:
              "ভেজা চটের বস্তা দিয়ে এক ঝটকায় সিলিন্ডার পেঁচিয়ে দিলে বাতাসের সংযোগ সম্পূর্ণ বন্ধ হয়ে আগুন তৎক্ষণাৎ নিভে যায়।",
          },
          {
            question: "What is the official nationwide emergency hotline for LPG safety support and dispatch in Bangladesh?",
            questionBn: "বাংলাদেশে জরুরি এলপিজি সহায়তা ও নিরাপত্তা নির্দেশনার জন্য অনুমোদিত জাতীয় হেল্পলাইন নম্বর কোনটি?",
            options: [
              "16137 (National LPG Emergency Helpline)",
              "109",
              "333",
              "16247",
            ],
            optionsBn: [
              "১৬১৩৭ (জাতীয় এলপিজি জরুরি হেল্পলাইন)",
              "১০৯",
              "৩৩৩",
              "১৬২৪৭",
            ],
            correctAnswer: 0,
            explanation: "16137 is the 24/7 dedicated National LPG Emergency Helpline.",
            explanationBn: "১৬১৩৭ হলো ২৪/৭ জাতীয় এলপিজি জরুরি হেল্পলাইন।",
          },
          {
            question: "What is the correct P.A.S.S. sequence when operating a Dry Chemical Powder fire extinguisher?",
            questionBn: "ডিসিবি অগ্নিনির্বাপক যন্ত্র ব্যবহারের সঠিক পি.এ.এস.এস (P.A.S.S.) ক্রম কোনটি?",
            options: [
              "Pull pin, Aim at fire base, Squeeze lever, Sweep side-to-side",
              "Push handle, Air out room, Spray flames, Stop",
              "Point upwards, Activate valve, Shake cylinder, Strike ground",
              "Press trigger, Aim at smoke, Spin around, Shout for help",
            ],
            optionsBn: [
              "পিন টানুন, আগুনের মূল ভিত্তিতে লক্ষ্য করুন, লিভার চাপুন, এপাশ-ওপাশ সুইপ করুন",
              "হ্যান্ডেল চাপুন, রুম খালি করুন, ধোঁয়ায় স্প্রে করুন, থামুন",
              "উপরের দিকে তাক করুন, ভালভ চালু করুন, সিলিন্ডার নাড়ান, নিচে রাখুন",
              "ট্রিগার চাপুন, ধোঁয়ায় স্প্রে করুন, ঘুরে দাঁড়ান, সাহায্য চান",
            ],
            correctAnswer: 0,
            explanation:
              "P.A.S.S.: Pull the pin, Aim low at the base of the fire, Squeeze the lever, and Sweep side to side.",
            explanationBn:
              "P.A.S.S. হলো: পিন টানুন (Pull), আগুনের গোড়ায় তাক করুন (Aim), লিভার চাপুন (Squeeze), এবং এপাশ-ওপাশ স্প্রে করুন (Sweep)।",
          },
        ],
      },
    },
  ],
};

// =========================================================================
// 2. PAID COURSE (3 Modules: 3 videos + 1.4 Quiz, 4 videos + 2.5 Quiz, 1 video + 3.2 Final Exam)
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
  duration: "2h 15m",
  durationBn: "২ ঘণ্টা ১৫ মিনিট",
  totalLessons: 8,
  totalQuizzes: 3,
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
  learningPoints: [
    "Design and commission dual-bank multi-cylinder commercial manifold systems adhering to DoE standards.",
    "Specify, calibrate, and wire catalytic and infrared LEL gas detectors with solenoid emergency valves.",
    "Calculate natural ventilation louver ratios and kitchen exhaust hood interlock airflow limits.",
    "Maintain inspection logbooks, hydrostatic pressure audit certs, and statutory NBR/BERC licenses.",
  ],
  learningPointsBn: [
    "বিস্ফোরক অধিদপ্তরের কোড অনুযায়ী বাণিজ্যিক মাল্টি-সিলিন্ডার ম্যানিফোল্ড সিস্টেম স্থাপন ও ডিজাইন।",
    "ক্যাটালিটিক ও ইনফ্রারেড গ্যাস সেন্সর স্থাপন এবং সোলেনয়েড শাট-অফ ভালভ অটোমেশন কার্যকরকরণ।",
    "প্রাকৃতিক বায়ু চলাচলের পরিমাপ এবং কিচেন হুড ইন্টারলক নিরাপত্তা ব্যবস্থা নিশ্চিতকরণ।",
    "নিয়মিত পরিদর্শন লগশিট, হাইড্রোস্ট্যাটিক প্রেসার সনদ এবং সরকারি লাইসেন্সিং অডিট প্রস্তুতি।",
  ],
  curriculum: [
    // -------------------------------------------------------------
    // MODULE 1: 3 Videos (1.1, 1.2, 1.3) + 1.4 Assessment Quiz (Free Preview)
    // -------------------------------------------------------------
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
          freePreview: true,
          notes:
            "Schedule 40/80 seamless carbon steel pipe (ASTM A53/A106) with golden yellow protective epoxy coating and pneumatic leak certification.",
          notesBn:
            "বাণিজ্যিক লাইনে শিডিউল ৪০/৮০ সিমলেস কার্বন স্টিল পাইপ ব্যবহার এবং সোনালী হলুদ রঙের কোটিং দ্বারা চিহ্নিতকরণ বাধ্যতামূলক।",
        },
      ],
      quiz: {
        title: "Module 1 Manifold Architecture & Piping Engineering Quiz",
        titleBn: "মডিউল ১: ম্যানিফোল্ড আর্কিটেকচার ও পাইপিং ইঞ্জিনিয়ারিং কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "Under statutory regulations, where must commercial multi-cylinder manifold banks be situated?",
            questionBn: "সংবিধিবদ্ধ আইন অনুযায়ী বাণিজ্যিক মাল্টি-সিলিন্ডার ম্যানিফোল্ড ব্যাংক কোথায় স্থাপন করতে হবে?",
            options: [
              "Outside cooking areas in a well-ventilated, masonry shelter with natural louvers",
              "Directly underneath the commercial kitchen burners for shortest pipe runs",
              "In the basement boiler room next to electrical generators",
              "Inside the food storage pantry behind closed doors",
            ],
            optionsBn: [
              "রান্নাঘরের বাইরে প্রাকৃতিক বায়ু চলাচলযুক্ত অগ্নিনিরোধক উন্মুক্ত শেডে",
              "পাইপ ছোট রাখার সুবিধার্থে সরাসরি বাণিজ্যিক চুলার নিচে ক্যাবিনেটে",
              "জেনারেটরের সাথে ভূগর্ভস্থ বেজমেন্ট বয়লার রুমে",
              "রান্নাঘরের খাদ্য গুদাম প্যান্ট্রিতে বন্ধ দরজার পেছনে",
            ],
            correctAnswer: 0,
            explanation:
              "Commercial codes require manifold banks to be located outdoors in naturally ventilated enclosures.",
            explanationBn:
              "সংবিধিবদ্ধ কোড অনুযায়ী মাল্টি-সিলিন্ডার ব্যাংক অবশ্যই রান্নাঘরের বাইরে উন্মুক্ত ও প্রাকৃতিক বায়ু চলাচলযুক্ত সেডে রাখতে হবে।",
          },
          {
            question: "It is legally permissible to route commercial high-pressure LPG gas pipelines through air conditioning return ducts.",
            questionBn: "বাণিজ্যিক এলপিজি গ্যাস পাইপলাইন শীতাতপ নিয়ন্ত্রণকারী (এসি) ডাক্ট বা লিফটের শ্যাফটের মধ্য দিয়ে নিয়ে যাওয়া আইনত বৈধ।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 1,
            explanation:
              "Building codes strictly forbid running gas pipes through ventilation ducts or elevator shafts.",
            explanationBn:
              "এসি ডাক্ট বা লিফট শ্যাফটের মধ্য দিয়ে গ্যাস লাইন নেওয়া সম্পূর্ণ নিষিদ্ধ ও মারাত্মক আইন লঙ্ঘন।",
          },
          {
            question: "What piping standard is required for commercial LPG header manifold installations?",
            questionBn: "বাণিজ্যিক এলপিজি হেডার ম্যানিফোল্ড সংযোগে কোন পাইপিং মানদণ্ড বাধ্যতামূলক?",
            options: [
              "ASTM A53 / A106 Schedule 40/80 seamless carbon steel piping",
              "Standard thin PVC sanitary drainage pipe",
              "Unreinforced flexible clear garden water hose",
              "Galvanized zinc corrugated irrigation tube",
            ],
            optionsBn: [
              "ASTM A53 / A106 শিডিউল ৪০/৮০ সিমলেস কার্বন স্টিল পাইপ",
              "সাধারণ পাতলা পিভিসি ড্রেনেজ পাইপ",
              "সাধারণ প্লাস্টিকের স্বচ্ছ গার্ডেন হোসপাইপ",
              "টিনের বা দস্তার পাতলা ইরিগেশন পাইপ",
            ],
            correctAnswer: 0,
            explanation:
              "High pressure requires Schedule 40/80 seamless carbon steel pipes with welded or flanged connections.",
            explanationBn:
              "বাণিজ্যিক গ্যাস লাইনে শিডিউল ৪০/৮০ সিমলেস কার্বন স্টিল পাইপ ব্যবহার বাধ্যতামূলক।",
          },
          {
            question: "Commercial LPG pipes must be color-coded with golden yellow protective epoxy coating for rapid identification.",
            questionBn: "জরুরি মুহূর্তে দ্রুত শনাক্তকরণের জন্য বাণিজ্যিক এলপিজি পাইপ সোনালী হলুদ রঙে চিহ্নিত করা বাধ্যতামূলক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Safety regulations require gas lines to be painted golden yellow for immediate hazard recognition.",
            explanationBn:
              "নিরাপত্তা বিধিমালা অনুযায়ী গ্যাস লাইন সর্বদা সোনালী হলুদ রঙে পেইন্ট করে চিহ্নিত রাখা বাধ্যতামূলক।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 2: 4 Videos (2.1, 2.2, 2.3, 2.4) + 2.5 Assessment Quiz
    // -------------------------------------------------------------
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
      quiz: {
        title: "Module 2 Gas Automation & Interlock Mitigation Systems Quiz",
        titleBn: "মডিউল ২: গ্যাস অটোমেশন ও ইন্টারলক সিস্টেম কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "At what percentage of Lower Explosive Limit (LEL) should commercial safety detection systems trigger an automated solenoid shut-off?",
            questionBn: "বাণিজ্যিক গ্যাস ডিটেকশন সিস্টেমে লোয়ার এক্সপ্লোসিভ লিমিটের (LEL) শতকরা কত ঘনত্বে অটো সোলেনয়েড শাট-অফ সক্রিয় হওয়া আবশ্যক?",
            options: [
              "Between 10% to 20% LEL",
              "At 100% LEL when flame is already active",
              "At 85% LEL",
              "LEL sensors are not required in commercial kitchens",
            ],
            optionsBn: [
              "১০% থেকে ২০% LEL এর মধ্যে",
              "১০০% LEL এ যখন ইতিমধ্যে আগুন জ্বলে উঠেছে",
              "৮৫% LEL এ",
              "বাণিজ্যিক রান্নাঘরে এলইএল সেন্সরের কোনো প্রয়োজন নেই",
            ],
            correctAnswer: 0,
            explanation:
              "Sensors trigger safety solenoids between 10% and 20% LEL to stop gas flow long before an explosive mixture can form.",
            explanationBn:
              "বিস্ফোরণ ঘটার অনেক আগেই (১০% থেকে ২০% LEL ঘনত্বে) সেন্সর সংকেত পাঠিয়ে গ্যাস লাইন স্বয়ংক্রিয়ভাবে লক করে দেয়।",
          },
          {
            question: "Gas supply in commercial kitchens must be interlocked so gas flows ONLY when the mechanical exhaust hood is actively running.",
            questionBn: "বাণিজ্যিক রান্নাঘরে গ্যাস সরবরাহ অবশ্যই এক্সহস্ট হুডের সাথে ইন্টারলক থাকতে হবে, যাতে এক্সহস্ট ফ্যান চালু থাকলেই কেবল গ্যাস সরবরাহ চালু হয়।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Exhaust interlocks prevent unvented gas or combustion fumes from building up in the kitchen workspace.",
            explanationBn:
              "এক্সহস্ট ফ্যান বন্ধ থাকলে যাতে গ্যাস সংযোগ কোনোভাবেই চালু না হতে পারে সেজন্য ইলেকট্রিক্যাল ইন্টারলক নিশ্চিত করা আইনত বাধ্যতামূলক।",
          },
          {
            question: "At what vertical height from the floor should heavy combustible LPG leak sensors be mounted?",
            questionBn: "মেঝে থেকে কত উচ্চতায় ভারী এলপিজি গ্যাস লিক ডিটেক্টর সেন্সরগুলো স্থাপন করতে হবে?",
            options: [
              "15 to 30 cm above floor level near appliances and manifolds",
              "On the highest ceiling point next to smoke detectors",
              "Directly on the exhaust fan blades",
              "Inside closed kitchen storage cabinets",
            ],
            optionsBn: [
              "মেঝের স্তর থেকে ১৫ থেকে ৩০ সেমি ওপরে যন্ত্রপাতি ও ম্যানিফোল্ডের কাছে",
              "সরাসরি সিলিংয়ের সর্বোচ্চ চূড়ায় ধোঁয়া ডিটেক্টরের পাশে",
              "এক্সহস্ট ফ্যানের ব্লেডের উপর",
              "বদ্ধ কিচেন স্টোরেজ ক্যাবিনেটের ভেতরে",
            ],
            correctAnswer: 0,
            explanation:
              "Since LPG is heavier than air, sensors must be placed 15-30 cm from the floor to catch sinking vapor.",
            explanationBn:
              "যেহেতু এলপিজি বাতাসের চেয়ে ভারী এবং মেঝেতে জমে, তাই সেন্সরগুলো মেঝে থেকে ১৫-৩০ সেমি উপরে স্থাপন করতে হয়।",
          },
          {
            question: "Flashback arrestors and flame arrestors protect against fire traveling backward into the gas supply lines.",
            questionBn: "ফ্ল্যাশব্যাক অ্যারেস্টর চুলার বিপরীত দিকে গ্যাস সরবরাহের পাইপে আগুন প্রবেশ করা প্রতিরোধ করে।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Flashback arrestors extinguish reverse flame propagation and arrest backfires before reaching the header.",
            explanationBn:
              "ফ্ল্যাশব্যাক প্রতিরোধক ব্যাকফায়ার হওয়া আগুনকে পাইপলাইনে প্রবেশ করতে দেয় না এবং দুর্ঘটনা প্রতিরোধ করে।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 3: 1 Video (3.1) + 3.2 Final Certification Exam
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 3: Statutory Compliance, Inspection Auditing & Certification",
      moduleTitleBn: "মডিউল ৩: সংবিধিবদ্ধ আইন, নিরাপত্তা পরিদর্শন ও সমাপনী সনদপত্র মূল্যায়ন",
      isFree: false,
      lessons: [
        {
          title: "Department of Explosives (DoE) Audit Codes & Industrial Incident SOP",
          titleBn: "বিস্ফোরক অধিদপ্তর (DoE) সংবিধিবদ্ধ অডিট কোড ও শিল্প দুর্ঘটনা এসওপি",
          duration: "18 mins",
          durationBn: "১৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Gas Cylinder Rules 1991 (amended 2004) compliance: aggregate storage exceeding 80 kg requires DoE license, quarterly PRV calibration, and incident command hierarchy.",
          notesBn:
            "গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ অনুযায়ী ৮০ কেজির বেশি মজুদের জন্য বিস্ফোরক অধিদপ্তরের লাইসেন্স বাধ্যতামূলক, ত্রৈমাসিক ভালভ পরীক্ষা ও জরুরি প্রটোকল প্রতিপালন।",
        },
      ],
      quiz: {
        title: "Final Commercial Safety & Compliance Certification Exam",
        titleBn: "সমাপনী বাণিজ্যিক নিরাপত্তা ও সংবিধিবদ্ধ সম্মতি সনদপত্র মূল্যায়ন",
        durationMinutes: 15,
        passingScore: 70,
        questions: [
          {
            question: "Under the Gas Cylinder Rules 1991 (amended 2004), what aggregate LPG storage requires a statutory DoE storage license?",
            questionBn: "গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ (সংশোধিত ২০০৪) অনুযায়ী কত পরিমাণের বেশি এলপিজি মজুদের জন্য বিস্ফোরক অধিদপ্তরের (DoE) লাইসেন্স বাধ্যতামূলক?",
            options: [
              "Aggregate storage exceeding 80 kg on the commercial premises",
              "Any storage exceeding 1,000,000 kg only",
              "Storage licenses are never required for private restaurants",
              "Only when more than 500 cylinders are connected",
            ],
            optionsBn: [
              "বাণিজ্যিক প্রাঙ্গণে ৮০ কেজির অধিক পরিমাণ এলপিজি গ্যাস মজুদের ক্ষেত্রে",
              "শুধুমাত্র ১০ লাখ কেজির বেশি মজুদের ক্ষেত্রে",
              "ব্যক্তিগত রেস্তোরাঁর জন্য কখনো কোনো লাইসেন্সের প্রয়োজন নেই",
              "শুধুমাত্র ৫০০ টির বেশি সিলিন্ডার সংযুক্ত থাকলে",
            ],
            correctAnswer: 0,
            explanation:
              "Premises storing more than 80 kg of LPG in cylinders must obtain a valid statutory storage license from DoE.",
            explanationBn:
              "৮০ কেজির বেশি সিলিন্ডার মজুদের জন্য বিস্ফোরক অধিদপ্তর (DoE) থেকে বাধ্যতামূলক লাইসেন্স গ্রহণ করতে হয়।",
          },
          {
            question: "Emergency manual shut-off pull valves in commercial restaurant manifold rooms must remain completely unobstructed by inventory boxes.",
            questionBn: "বাণিজ্যিক রেস্তোরাঁর ম্যানিফোল্ড রুমে জরুরি ম্যানুয়াল শাট-অফ ভালভ সর্বদা বাধাহীন ও সহজে পৌঁছানো যায় এমন অবস্থায় রাখতে হবে।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Clear egress and instant access to emergency shut-off valves is strictly required by fire safety codes.",
            explanationBn:
              "জরুরি শাট-অফ ভালভের সামনে কোনো মালামাল বা বক্স রাখা আইনত নিষিদ্ধ; এটি সর্বদা বাধাহীন রাখতে হবে।",
          },
          {
            question: "How frequently must commercial high-pressure regulators and Pressure Relief Valves (PRV) undergo statutory recalibration?",
            questionBn: "বাণিজ্যিক এলপিজি প্রেসার রিলিফ ভালভ (PRV) এবং রেগুলেটর কত সময় পর পর সংবিধিবদ্ধভাবে পরীক্ষা ও ক্যালিব্রেশন করতে হয়?",
            options: [
              "Quarterly operational checklist inspection with annual certified hydrostatic calibration",
              "Never, regulators never require testing or calibration",
              "Only once every 25 years",
              "Only after an explosion or fire occurs",
            ],
            optionsBn: [
              "প্রতি ৩ মাস অন্তর অপারেশনাল চেকলিস্ট পরিদর্শন ও বাৎসরিক সার্টিফাইড হাইড্রোস্ট্যাটিক ক্যালিব্রেশন",
              "কখনোই নয়, এগুলো পরীক্ষার কোনো প্রয়োজন নেই",
              "প্রতি ২৫ বছরে মাত্র একবার",
              "শুধুমাত্র কোনো অগ্নিকাণ্ড ঘটার পর",
            ],
            correctAnswer: 0,
            explanation:
              "Statutory standards require quarterly visual/leak inspections and annual certified hydrostatic pressure tests.",
            explanationBn:
              "কোয়ার্টারলি চেকলিস্ট অডিট এবং বাৎসরিক সার্টিফাইড হাইড্রোস্ট্যাটিক ক্যালিব্রেশন বাণিজ্যিক লাইনের জন্য বাধ্যতামূলক।",
          },
          {
            question: "Commercial kitchen safety compliance requires certified ABC dry chemical powder wheeled extinguishers and clear 3-meter egress corridors.",
            questionBn: "বাণিজ্যিক রান্নাঘরের অগ্নি নিরাপত্তা সম্মতির জন্য ৫০ কেজি চাকাযুক্ত এবিসি এক্সটিংগুইশার এবং ৩ মিটার জরুরি বহির্গমন করিডোর নিশ্চিতকরণ বাধ্যতামূলক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Commercial facilities must maintain wheeled heavy dry powder extinguishers and clear emergency exit corridors at all times.",
            explanationBn:
              "বাণিজ্যিক রান্নাঘরে চাকাযুক্ত হেভি এক্সটিংগুইশার এবং ৩ মিটার জরুরি বহির্গমন করিডোর থাকা বাধ্যতামূলক।",
          },
        ],
      },
    },
  ],
};

// =========================================================================
// HELPER: Convert Curriculum Quizzes to Global Quiz QuestionBank
// =========================================================================
function buildGlobalQuizData(courseData) {
  const allQuestions = [];
  courseData.curriculum.forEach((mod, modIdx) => {
    if (mod.quiz?.questions) {
      mod.quiz.questions.forEach((q, qIdx) => {
        const isTrueFalse = q.options.length === 2;
        const formattedOptions = q.options.map((optText, optIdx) => ({
          id: `opt_m${modIdx + 1}_q${qIdx + 1}_${optIdx + 1}`,
          text: optText,
          textBn: q.optionsBn?.[optIdx] || optText,
          isCorrect: q.correctAnswer === optIdx,
        }));

        allQuestions.push({
          id: `q_c${courseData.courseId}_m${modIdx + 1}_${qIdx + 1}`,
          question: q.question,
          questionBn: q.questionBn || q.question,
          type: isTrueFalse ? "true_false" : "single",
          options: formattedOptions,
          explanation: q.explanation || "",
          explanationBn: q.explanationBn || "",
          points: 1,
        });
      });
    }
  });

  return {
    courseId: courseData.courseId,
    title: `${courseData.title} - Complete Assessment Quiz`,
    titleBn: `${courseData.titleBn} - সম্পূর্ণ মূল্যায়ন কুইজ`,
    description: `Official comprehensive certification examination for ${courseData.title}. Pass with 70% or higher to verify mastery and earn your certificate.`,
    durationMinutes: 20,
    timerEnabled: true,
    passPercentage: 70,
    questionsPerQuiz: allQuestions.length,
    cooldownMinutes: 15,
    shuffleOptions: true,
    isPublished: true,
    questionBank: allQuestions,
    questions: allQuestions,
  };
}

// =========================================================================
// RUN SEEDING SCRIPT
// =========================================================================
async function runSeed() {
  try {
    const mongoUri = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ael";
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log("[Seed] 1. Purging old courses, quizzes and certificates collections...");
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    await Certificate.deleteMany({});

    console.log("[Seed] 2. Resetting all users' enrolled courses and test progress...");
    await User.updateMany(
      {},
      {
        $set: {
          enrolledCourses: [],
        },
      }
    );

    console.log("[Seed] 3. Inserting Free Course (Module 1: 3 vids + 1.4 Quiz, Module 2: 4 vids + 2.5 Quiz, Module 3: 1 vid + 3.2 Final Exam)...");
    const createdFreeCourse = await Course.create(freeCourseData);
    console.log(
      `   -> Created Free Course: ID ${createdFreeCourse.courseId} ("${createdFreeCourse.title}")`
    );

    console.log("[Seed] 4. Inserting Paid Course (Module 1: 3 vids + 1.4 Quiz, Module 2: 4 vids + 2.5 Quiz, Module 3: 1 vid + 3.2 Final Exam)...");
    const createdPaidCourse = await Course.create(paidCourseData);
    console.log(
      `   -> Created Paid Course: ID ${createdPaidCourse.courseId} ("${createdPaidCourse.title}")`
    );

    console.log("[Seed] 5. Creating Global Quiz Collections for Free and Paid Courses...");
    const freeGlobalQuiz = buildGlobalQuizData(freeCourseData);
    await Quiz.create(freeGlobalQuiz);
    console.log(`   -> Created Free Course Global Quiz (${freeGlobalQuiz.questionBank.length} questions in bank)`);

    const paidGlobalQuiz = buildGlobalQuizData(paidCourseData);
    await Quiz.create(paidGlobalQuiz);
    console.log(`   -> Created Paid Course Global Quiz (${paidGlobalQuiz.questionBank.length} questions in bank)`);

    console.log("\n========================================================");
    console.log("SUCCESS! Seeding completed with 2 standard structured courses:");
    console.log("1. FREE Course: 'LPG Household Safety & Emergency Handling Masterclass'");
    console.log("   - Module 1: 3 lessons (1.1, 1.2, 1.3) + 1.4 Safety Quiz (Pass 70% required to unlock Module 2)");
    console.log("   - Module 2: 4 lessons (2.1, 2.2, 2.3, 2.4) + 2.5 Kitchen Operations Quiz (Pass 70% required to unlock Module 3)");
    console.log("   - Module 3: 1 lesson (3.1) + 3.2 Final Certification Exam (Pass 70% auto-generates official Certificate)");
    console.log("\n2. PAID Course: 'Commercial LPG Safety Auditing & Regulatory Compliance'");
    console.log("   - Module 1: 3 lessons (1.1, 1.2, 1.3) + 1.4 Engineering Quiz (FREE preview for registered users)");
    console.log("   - Module 2: 4 lessons (2.1, 2.2, 2.3, 2.4) + 2.5 Interlock Systems Quiz (Paid / Subscriber locked)");
    console.log("   - Module 3: 1 lesson (3.1) + 3.2 Final Certification Exam (Pass 70% auto-generates official Certificate)");
    console.log("========================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error executing seed:", error);
    process.exit(1);
  }
}

runSeed();

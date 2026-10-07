// ael_backend/src/scripts/upload_two_brand_new_courses.js

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
// 1. BRAND NEW FREE COURSE (Module 3 has 0 videos, only Final Exam Quiz)
// =========================================================================
const brandNewFreeCourse = {
  courseId: "1",
  title: "LPG Kitchen Fire Safety & Gas Leakage Prevention",
  titleBn: "এলপিজি রান্নাঘরের অগ্নি নিরাপত্তা ও গ্যাস লিকেজ প্রতিরোধ",
  slug: "lpg-kitchen-fire-safety-leak-prevention",
  description:
    "Essential national safety masterclass for domestic LPG consumers, homemakers, and residential building cooks. Master leak detection, safe regulator connection, zero-spark emergency procedures, and fire containment.",
  descriptionBn:
    "গৃহস্থালি এলপিজি ব্যবহারকারী, গৃহিণী ও আবাসিক রাঁধুনিদের জন্য অত্যাবশ্যকীয় জাতীয় নিরাপত্তা মাস্টারক্লাস। গ্যাস লিকেজ শনাক্তকরণ, নিরাপদ রেগুলেটর সংযোগ, জিরো-স্পার্ক জরুরি প্রটোকল এবং অগ্নিনির্বাপক পরিচালনা শিখুন।",
  category: "Consumer Safety",
  categoryBn: "ভোক্তা নিরাপত্তা",
  badge: "FREE",
  badgeColor: "bg-emerald-600",
  audience: "Consumers, Homemakers & Residential Staff",
  audienceBn: "ভোক্তা, গৃহিণী ও আবাসিক কর্মী",
  level: "Beginner",
  levelBn: "প্রাথমিক",
  duration: "1h 15m",
  durationBn: "১ ঘণ্টা ১৫ মিনিট",
  totalLessons: 6, // Module 1: 3, Module 2: 3, Module 3: 0
  totalQuizzes: 3,
  rating: 4.9,
  enrolledCount: "14,250",
  price: 0,
  isFree: true,
  imageUrl:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  videoUrl: sampleVideoUrl,
  pdfUrl: "",
  pdfOriginalName: "",
  pdfSize: "",
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
    "Master the physical behavior of LPG vapor and odorant markers.",
    "Verify cylinder O-ring gaskets and securely install low-pressure regulators.",
    "Perform reliable soapy water froth bubble leak tests without flame hazards.",
    "Execute zero-spark ventilation protocols and operate dry powder extinguishers.",
  ],
  learningPointsBn: [
    "এলপিজি বাষ্পের বৈশিষ্ট্য ও বাতাসের চেয়ে ভারী হওয়ার ঝুঁকি সম্পর্কে সম্যক জ্ঞান অর্জন।",
    "সিলিন্ডারের রাবার ও-রিং, রেগুলেটর ক্লিপ ও মেটালিক হোসপাইপ সঠিকভাবে পরীক্ষা ও স্থাপন।",
    "সাবান-পানির ফেনা দিয়ে নিরাপদ ও নির্ভুল গ্যাস লিকেজ পরীক্ষা সম্পন্ন করা।",
    "জিরো-স্পার্ক প্রটোকল বজায় রেখে ডিসিবি অগ্নিনির্বাপক পরিচালনা এবং জরুরি হেল্পলাইন ১৬১৩৭ এ যোগাযোগ।",
  ],
  curriculum: [
    // -------------------------------------------------------------
    // MODULE 1: 3 Videos (1.1, 1.2, 1.3) + 1.4 Assessment Quiz
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 1: Safe Cylinder Connection & Regulator Setup",
      moduleTitleBn: "মডিউল ১: নিরাপদ সিলিন্ডার সংযোগ ও রেগুলেটর স্থাপন",
      isFree: true,
      lessons: [
        {
          title: "LPG Cylinder Inspection & Rubber O-Ring Verification",
          titleBn: "এলপিজি সিলিন্ডার পরীক্ষণ ও রাবার ও-রিং অখণ্ডতা যাচাই",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Always inspect the valve neck rubber O-ring before snapping on the regulator. Verify hydrostatic test date on cylinder stay collar.",
          notesBn:
            "রেগুলেটর লাগানোর আগে সিলিন্ডারের মুখের রাবার ও-রিং অক্ষত আছে কিনা যাচাই করুন। সিলিন্ডারের কলারের গায়ে খোদাই করা টেস্ট মেয়াদ দেখে নিন।",
        },
        {
          title: "Low-Pressure Click-On Regulator Locking SOP",
          titleBn: "লো-প্রেসার ক্লিক-অন রেগুলেটর লকিং স্ট্যান্ডার্ড পদ্ধতি",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Push regulator down until a distinct mechanical click is heard, then gently pull up to ensure positive lock. Never force a misaligned regulator.",
          notesBn:
            "রেগুলেটর বসানোর সময় সুস্পষ্ট 'ক্লিক' শব্দ শুনে নিশ্চিত হন এবং হালকা টেনে লক যাচাই করুন। জোর করে ভুলভাবে কখনো চাপ দেবেন না।",
        },
        {
          title: "Metallic Hose Installation & Double Clamp Security",
          titleBn: "মেটালিক হোসপাইপ স্থাপন ও ডাবল ক্ল্যাম্প সংযোগ সুরক্ষা",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Use metallic braided safety hoses resistant to rodent bites. Tighten stainless steel worm-drive clamps securely at both regulator and stove nozzles.",
          notesBn:
            "ইঁদুর প্রতিরোধী মেটালিক ব্রেইডেড সেফটি হোস ব্যবহার করুন। রেগুলেটর এবং চুলার নজেলে স্ক্রু ক্ল্যাম্প শক্তভাবে আটকাতে হবে।",
        },
      ],
      quiz: {
        title: "Module 1 Cylinder Setup & Inspection Quiz",
        titleBn: "মডিউল ১: সিলিন্ডার সংযোগ ও পরীক্ষণ কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "What component inside the cylinder valve neck prevents gas leak at the regulator joint?",
            questionBn: "সিলিন্ডারের ভালভ নেকের ভেতরের কোন অংশটি রেগুলেটর সংযোগে গ্যাস লিকেজ রোধ করে?",
            options: [
              "A flexible rubber O-ring seal",
              "A drop of cooking oil",
              "Thread seal tape wrapped around the collar",
              "A piece of cloth",
            ],
            optionsBn: [
              "নমনীয় রাবার ও-রিং সিল",
              "এক ফোঁটা রান্নার তেল",
              "ভালভের মুখে পেঁচানো সুতা বা টেপ",
              "এক টুকরো কাপড়",
            ],
            correctAnswer: 0,
            explanation:
              "The rubber O-ring provides a gas-tight seal against the regulator inlet probe.",
            explanationBn:
              "ভালভের ভেতরের রাবার ও-রিং গ্যাস লিকেজ পুরোপুরি বন্ধ করে নিরাপদ সিল তৈরি করে।",
          },
          {
            question: "How do you verify that a click-on low-pressure regulator is properly locked onto the cylinder?",
            questionBn: "ক্লিক-অন রেগুলেটরটি সিলিন্ডারে সঠিকভাবে লক হয়েছে কিনা তা কীভাবে নিশ্চিত করবেন?",
            options: [
              "Listen for a distinct click sound and gently lift the regulator upward to test mechanical locking",
              "Hit the regulator with a heavy tool",
              "Turn the gas valve on immediately without checking",
              "Smell the regulator collar",
            ],
            optionsBn: [
              "স্পষ্ট 'ক্লিক' শব্দ শুনুন এবং হাত দিয়ে আলতো করে উপরের দিকে টেনে লক নিশ্চিত করুন",
              "ভারী কোনো বস্তু দিয়ে রেগুলেটরে আঘাত করুন",
              "না দেখেই সরাসরি চুলার গ্যাস অন করে দিন",
              "রেগুলেটরের মুখের গন্ধ শুঁকে দেখুন",
            ],
            correctAnswer: 0,
            explanation:
              "Hearing the snap click and testing with a gentle upward tug verifies positive locking.",
            explanationBn:
              "ক্লিক শব্দের পর আলতো করে টেনে দেখলে নিশ্চিত হওয়া যায় যে লকটি সঠিকভাবে লেগেছে।",
          },
          {
            question: "LPG metallic rubber hoses should be inspected periodically and replaced at least once every 2 years.",
            questionBn: "এলপিজি মেটালিক রাবার হোসপাইপ নিয়মিত পর্যবেক্ষণ করা উচিত এবং সর্বোচ্চ প্রতি ২ বছর অন্তর পরিবর্তন করা বাধ্যতামূলক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Safety codes mandate replacing flexible LPG hoses every 24 months to prevent micro-cracks.",
            explanationBn:
              "রাবারের মাইক্রো-ফাটল ও লিকেজ প্রতিরোধে সর্বোচ্চ ২ বছর পরপর অনুমোদিত মেটালিক হোসপাইপ পরিবর্তন করা উচিত।",
          },
          {
            question: "Why should you never use thin single-ply non-reinforced rubber tubing for LPG?",
            questionBn: "এলপিজি লাইনে সাধারণ পাতলা প্লাস্টিক বা রবারের নল কেন কখনোই ব্যবহার করা যাবে না?",
            options: [
              "LPG dissolves regular rubber over time and easily cracks under pressure or rodent bites",
              "It is too heavy to carry",
              "It makes the gas flame turn green",
              "It reduces the cooking speed",
            ],
            optionsBn: [
              "সাধারণ প্লাস্টিক বা রাবার এলপিজির চাপে ফেটে যায় এবং ইঁদুরের কামড়ে দ্রুত ফুটো হয়ে যায়",
              "এটি অনেক ভারী হয়ে থাকে",
              "এটি আগুনের শিখা সবুজ করে ফেলে",
              "এটি রান্নার গতি ধীর করে দেয়",
            ],
            correctAnswer: 0,
            explanation:
              "LPG hydrocarbons degrade ordinary polymers, demanding reinforced metallic braided hoses.",
            explanationBn:
              "সাধারণ রাবার গ্যাস আটকে রাখতে পারে না, তাই মেটালিক তারযুক্ত সেফটি হোস ব্যবহার বাধ্যতামূলক।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 2: 3 Videos (2.1, 2.2, 2.3) + 2.4 Assessment Quiz
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 2: Daily Kitchen Safety & Early Leak Detection",
      moduleTitleBn: "মডিউল ২: রান্নাঘরের নিরাপত্তা ও দ্রুত লিকেজ শনাক্তকরণ",
      isFree: true,
      lessons: [
        {
          title: "Safe Stove Ignition Protocols & Cross Ventilation",
          titleBn: "নিরাপদ চুলা প্রজ্বলন কৌশল ও ক্রস-ভেন্টিলেশন নিয়ম",
          duration: "09 mins",
          durationBn: "০৯ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Always strike lighter or matchstick FIRST before opening burner gas knob. Keep kitchen windows open to facilitate continuous air exchange.",
          notesBn:
            "সবসময় আগে ম্যাচ বা লাইটার জ্বালিয়ে তারপর চুলার নব ঘোরান। রান্নার সময় রান্নাঘরের জানালা খোলা রাখুন।",
        },
        {
          title: "Soapy Water Bubble Test vs Open Flame Dangers",
          titleBn: "সাবান-পানির বুদবুদ পরীক্ষা বনাম উন্মুক্ত আগুনের ভয়াবহতা",
          duration: "08 mins",
          durationBn: "০৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Never use matchsticks or open flame to check gas leaks! Apply liquid soap lather to all joints and inspect for expanding bubbles.",
          notesBn:
            "গ্যাস লিকেজ পরীক্ষার জন্য কখনোই দিয়াশলাই বা আগুন ব্যবহার করবেন না! সাবানের ফেনা তৈরি করে পাইপ ও রেগুলেটর সংযোগে লাগিয়ে বুদবুদ পরীক্ষা করুন।",
        },
        {
          title: "Safe Empty Cylinder Exchange & Storage Guidelines",
          titleBn: "খালি সিলিন্ডার প্রতিস্থাপন ও সঠিক সংরক্ষণ নির্দেশনা",
          duration: "08 mins",
          durationBn: "০৮ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Always turn off regulator switch before disengaging from empty cylinder. Store cylinders strictly upright in well-ventilated areas.",
          notesBn:
            "সিলিন্ডার বদলানোর আগে রেগুলেটর সুইচ পুরোপুরি বন্ধ করুন। সিলিন্ডার সবসময় সমতল স্থানে সোজা করে রাখুন।",
        },
      ],
      quiz: {
        title: "Module 2 Kitchen Safety & Leak Detection Quiz",
        titleBn: "মডিউল ২: রান্নাঘরের নিরাপত্তা ও লিকেজ পরীক্ষা কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "What is the correct protocol when lighting a gas stove manually?",
            questionBn: "ম্যানুয়াল গ্যাস চুলা জ্বালানোর সময় সঠিক নিয়ম কোনটি?",
            options: [
              "Ignite match or lighter first, bring to burner nozzle, then open gas knob",
              "Open gas knob completely, search for matchbox, then light",
              "Open all burners together and wait a few minutes",
              "Blow air into the burner nozzle before lighting",
            ],
            optionsBn: [
              "আগে ম্যাচ বা লাইটার জ্বালিয়ে চুলার কাছে আনুন, তারপর চুলার গ্যাস নব ঘুরিয়ে অন করুন",
              "আগে গ্যাস নব অন করে দিয়াশলাই খুঁজতে যান, তারপর জ্বালান",
              "একসাথে সবকটি চুলার নব অন করে অপেক্ষা করুন",
              "জ্বালানোর আগে চুলার মুখে জোরে ফুঁ দিন",
            ],
            correctAnswer: 0,
            explanation:
              "Turning gas on before lighting causes gas pool accumulation, leading to flash burns.",
            explanationBn:
              "আগে গ্যাস অন করলে গ্যাসে জমে থাকা বাষ্পে হুট করে তীব্র ঝলকানি তৈরি হতে পারে।",
          },
          {
            question: "What is the safest approved method to inspect a suspected gas leak?",
            questionBn: "গ্যাস লিকেজ পরীক্ষার সবচেয়ে নিরাপদ অনুমোদিত পদ্ধতি কোনটি?",
            options: [
              "Applying soapy water foam to joints and watching for growing bubbles",
              "Holding a lit matchstick close to the hose",
              "Tapping the pipe with metal tools",
              "Spraying deodorant into the regulator",
            ],
            optionsBn: [
              "সংযোগস্থলগুলোতে সাবান-পানির ফেনা লাগিয়ে ক্রমবর্ধমান বুদবুদ পর্যবেক্ষণ করা",
              "হোসপাইপের পাশে জ্বলন্ত ম্যাচকাঠি ধরে দেখা",
              "ধাতব বস্তু দিয়ে পাইপে আঘাত করা",
              "রেগুলেটরে বডি স্প্রে ছিটানো",
            ],
            correctAnswer: 0,
            explanation:
              "Soap foam expands into bubbles without any spark or flame ignition risk.",
            explanationBn:
              "সাবান-পানির ফেনা গ্যাস বের হলে দ্রুত বুদবুদ তৈরি করে এবং কোনো স্ফুলিঙ্গের ঝুঁকি থাকে না।",
          },
          {
            question: "LPG cylinders must always stand vertically upright on a flat floor, never tilted horizontally.",
            questionBn: "এলপিজি সিলিন্ডার সর্বদা সমতল মেঝেতে খাড়াভাবে রাখতে হবে, কোনো অবস্থাতেই কাত করে বা শোয়ানো রাখা যাবে না।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Tilting a cylinder causes liquid LPG to enter regulator mechanisms, which creates sudden flame surges.",
            explanationBn:
              "সিলিন্ডার কাত করলে তরল এলপিজি সরাসরি রেগুলেটরে ঢুকে গিয়ে অনিয়ন্ত্রিত আগুনের শিখা তৈরি করে।",
          },
          {
            question: "What is the minimum safe clearance distance between an LPG cylinder and the cooking burner?",
            questionBn: "এলপিজি সিলিন্ডার এবং রান্নার চুলার মধ্যে সর্বনিম্ন নিরাপদ দূরত্ব কতটুকু?",
            options: [
              "At least 1 meter (approx. 3.3 feet)",
              "Directly under the stove touching the burner bottom",
              "Inside a sealed unventilated wooden drawer under the stove",
              "Distance does not matter",
            ],
            optionsBn: [
              "কমপক্ষে ১ মিটার (প্রায় ৩.৩ ফুট)",
              "চুলার আগুনের ঠিক নিচে কোনো ফাঁকা জায়গা না রেখে",
              "চুলার নিচে বাতাস চলাচলের পথহীন বদ্ধ কাঠের ড্রয়ারে",
              "দূরত্বের কোনো নিয়ম নেই",
            ],
            correctAnswer: 0,
            explanation:
              "At least 1 meter clearance prevents heat radiation from warming up the cylinder.",
            explanationBn:
              "কমপক্ষে ১ মিটার বা ৩.৩ ফুট দূরত্ব রাখলে চুলার উত্তাপ সরাসরি সিলিন্ডারে পৌঁছাতে পারে না।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 3: FINAL CERTIFICATION EXAM (0 VIDEOS, EXAM ONLY)
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 3: Emergency Gas Leak Response & Final Certification Exam",
      moduleTitleBn: "মডিউল ৩: গ্যাস লিকেজ জরুরি রেসপন্স ও সমাপনী সনদপত্র মূল্যায়ন",
      isFree: true,
      lessons: [], // NO VIDEOS in last module!
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
          {
            question: "If you detect gas smell upon waking up, what is your immediate first course of action?",
            questionBn: "ঘুম থেকে উঠে তীব্র গ্যাসের গন্ধ পেলে তাৎক্ষণিকভাবে প্রথম করণীয় কী?",
            options: [
              "Open all doors and windows wide for natural ventilation without touching any electrical switches",
              "Turn on the exhaust fan to suck out the gas",
              "Light a candle to see where the gas is leaking",
              "Close all windows to contain the smell",
            ],
            optionsBn: [
              "কোনো সুইচ স্পর্শ না করে অবিলম্বে সব দরজা ও জানালা খুলে দিন যাতে বাতাস চলাচল করতে পারে",
              "এক্সহস্ট ফ্যান অন করুন যাতে গ্যাস বের হয়ে যায়",
              "কোথা থেকে গ্যাস বের হচ্ছে দেখতে মোমবাতি জ্বালান",
              "গন্ধ যাতে বাইরে না ছড়ায় সেজন্য সব জানালা বন্ধ রাখুন",
            ],
            correctAnswer: 0,
            explanation:
              "Natural cross-ventilation dissipates the heavy vapor below the Lower Explosive Limit (LEL) safely.",
            explanationBn:
              "দরজা-জানালা খুলে দিলে বাতাস চলাচল করে আবদ্ধ ভারী গ্যাস দ্রুত বাইরে চলে যায় এবং বিস্ফোরণের ঝুঁকি কমে।",
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
  ],
};

// =========================================================================
// 2. BRAND NEW PAID COURSE (Module 3 has 0 videos, only Final Exam Quiz)
// =========================================================================
const brandNewPaidCourse = {
  courseId: "2",
  title: "Industrial LPG Boiler & Hotel Manifold Safety Engineering",
  titleBn: "শিল্প বয়লার ও হোটেল এলপিজি ম্যানিফোল্ড প্রকৌশল ও নিরাপত্তা",
  slug: "industrial-lpg-boiler-hotel-manifold-safety",
  description:
    "Comprehensive engineering certification for industrial safety managers, commercial hotel operators, and certified LPG pipeline auditors. Covers Schedule 80 manifold fabrication, dual-bank automatic changeover valves, flameproof gas detection, and DoE regulatory statutory audits.",
  descriptionBn:
    "শিল্প কারখানার সেফটি ম্যানেজার, বাণিজ্যিক হোটেল অপারেটর এবং সার্টিফাইড এলপিজি পাইপলাইন অডিটরদের জন্য পেশাদার ইঞ্জিনিয়ারিং সার্টিফিকেশন। শিডিউল ৮০ ম্যানিফোল্ড তৈরি, ডুয়েল-ব্যাংক অটোমেটিক চেঞ্জওভার ভালভ, ফ্লেমপ্রুফ গ্যাস ডিটেকশন এবং বিস্ফোরক অধিদপ্তর সংবিধিবদ্ধ অডিট প্রস্তুতি।",
  category: "Commercial & Industrial Safety",
  categoryBn: "বাণিজ্যিক ও শিল্প নিরাপত্তা",
  badge: "PREMIUM",
  badgeColor: "bg-amber-600",
  audience: "Industrial Safety Officers, Hotel Engineers & Auditors",
  audienceBn: "শিল্প নিরাপত্তা অফিসার, হোটেল প্রকৌশলী ও অডিটর",
  level: "Professional",
  levelBn: "পেশাদার",
  duration: "2h 05m",
  durationBn: "২ ঘণ্টা ০৫ মিনিট",
  totalLessons: 6, // Module 1: 3, Module 2: 3, Module 3: 0
  totalQuizzes: 3,
  rating: 4.95,
  enrolledCount: "8,740",
  price: 1500,
  isFree: false,
  imageUrl:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
  videoUrl: sampleVideoUrl,
  pdfUrl: "",
  pdfOriginalName: "",
  pdfSize: "",
  instructor: {
    name: "Dr. Farhan Chowdhury",
    nameBn: "ড. ফারহান চৌধুরী",
    role: "Certified Industrial Safety Auditor, NFPA Member",
    roleBn: "সার্টিফাইড ইন্ডাস্ট্রিয়াল সেফটি অডিটর, এনএফপিএ সদস্য",
    experience: "18+ Years Engineering Consultancy",
    experienceBn: "১৮+ বছরের বাণিজ্যিক প্রকৌশল অভিজ্ঞতা",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
  },
  learningPoints: [
    "Design 2x4 and 2x6 industrial cylinder banks using Schedule 80 seamless steel pipes.",
    "Integrate Automatic Changeover Regulators with Overpressure Slam-Shut safety interlocks.",
    "Install catalytic bead gas detector sensors interlocked with emergency shutoff solenoid valves.",
    "Fulfill statutory compliance per Explosives Act 1884 & Gas Cylinder Rules 1991 (amended 2004).",
  ],
  learningPointsBn: [
    "বাণিজ্যিক হোটেলের জন্য ডুয়েল-ব্যাংক হাই-প্রেসার সিলিন্ডার ম্যানিফোল্ড ও শিডিউল ৮০ পাইপলাইন ডিজাইন।",
    "অটোমেটিক চেঞ্জওভার ভালভ ও স্ল্যাম-শাট ওভারপ্রেশার সেফটি মেকানিজম স্থাপন।",
    "জরুরি গ্যাস লিকেজে স্বয়ংক্রিয় লাইন বন্ধকারী এক্সপ্লোশন-প্রুফ গ্যাস ডিটেক্টর ও সোলেনয়েড ইন্টারলক।",
    "বিস্ফোরক অধিদপ্তর (DoE) লাইসেন্সিং ও গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ অনুযায়ী সংবিধিবদ্ধ কমপ্লায়েন্স।",
  ],
  curriculum: [
    // -------------------------------------------------------------
    // MODULE 1: 3 Videos (1.1, 1.2, 1.3) + 1.4 Assessment Quiz (Free Preview)
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 1: High-Pressure Commercial Manifold Header Design",
      moduleTitleBn: "মডিউল ১: হাই-প্রেসার বাণিজ্যিক ম্যানিফোল্ড হেডার ডিজাইন",
      isFree: true, // Free Preview for registered users!
      lessons: [
        {
          title: "Schedule 80 Seamless Piping & Manifold Sizing",
          titleBn: "শিডিউল ৮০ সিমলেস পাইপিং ও ম্যানিফোল্ড সাইজিং মানদণ্ড",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Design standards for commercial multi-cylinder banks using seamless Schedule 80 carbon steel pipes with welded forged Class 3000 fittings.",
          notesBn:
            "বাণিজ্যিক ম্যানিফোল্ড ডিজাইনে শিডিউল ৮০ সিমলেস কার্বন স্টিল পাইপ ও ওয়েল্ডেড ফোরজড ক্লাস ৩০০০ ফিটিংস ব্যবহারের বাধ্যবাধকতা।",
        },
        {
          title: "Two-Stage Automatic Changeover Regulators (ACR)",
          titleBn: "টু-স্টেজ অটোমেটিক চেঞ্জওভার রেগুলেটর (এসিআর) পরিচালনা",
          duration: "15 mins",
          durationBn: "১৫ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Operation of dual-inlet automatic changeover regulators with visual reserve indicators and balanced diaphragm regulation.",
          notesBn:
            "একদিকের সিলিন্ডার খালি হলে নির্বিঘ্নে অপর ব্যাংকে অটোমেটিক শিফট এবং ভিজ্যুয়াল রিজার্ভ ইন্ডিকেটর রিডিং।",
        },
        {
          title: "Overpressure Slam-Shut Valves & Visual Gauges",
          titleBn: "ওভারপ্রেশার স্ল্যাম-শাট সেফটি ভালভ ও প্রেশার গেজ নিরীক্ষা",
          duration: "11 mins",
          durationBn: "১১ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: true,
          notes:
            "Emergency slam-shut cutoffs trip in milliseconds when downstream header pressure exceeds designated limits.",
          notesBn:
            "অতিরিক্ত লাইন প্রেশার তৈরি হলে কয়েক মিলি-সেকেন্ডে গ্যাস সরবরাহ বিচ্ছিন্নকারী স্ল্যাম-শাট ভালভের কার্যপদ্ধতি।",
        },
      ],
      quiz: {
        title: "Module 1 Commercial Manifold Header Quiz",
        titleBn: "মডিউল ১: বাণিজ্যিক ম্যানিফোল্ড হেডার কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "What pipe schedule rating is mandatory for high-pressure commercial LPG manifold header pipes before initial pressure regulation?",
            questionBn: "প্রাথমিক প্রেসার রেগুলেশনের পূর্বে বাণিজ্যিক হাই-প্রেসার এলপিজি ম্যানিফোল্ড হেডারের জন্য কোন শিডিউলের পাইপ ব্যবহার বাধ্যতামূলক?",
            options: [
              "Schedule 80 seamless carbon steel pipe (ASTM A106 Grade B)",
              "Thin PVC water supply pipe",
              "Schedule 10 thin-wall decorative conduit",
              "Standard rubber hose clamped with zip-ties",
            ],
            optionsBn: [
              "শিডিউল ৮০ সিমলেস কার্বন স্টিল পাইপ (ASTM A106 Grade B)",
              "পাতলা পিভিসি পানির পাইপ",
              "শিডিউল ১০ পাতলা ধাতব পাইপ",
              "প্লাস্টিকের তার দিয়ে বাঁধা সাধারণ রাবার পাইপ",
            ],
            correctAnswer: 0,
            explanation:
              "High-pressure vapor headers operate up to 10-15 bar cylinder pressure, mandating Schedule 80 seamless carbon steel.",
            explanationBn:
              "সিলিন্ডার থেকে আসা গ্যাসের চাপ ১০-১৫ বার পর্যন্ত হতে পারে, তাই শিডিউল ৮০ সিমলেস স্টিল পাইপ ব্যবহার বাধ্যতামূলক।",
          },
          {
            question: "What is the primary function of an Overpressure Slam-Shut Valve (OPSV)?",
            questionBn: "ওভারপ্রেশার স্ল্যাম-শাট ভালভ (OPSV) এর প্রধান কাজ কী?",
            options: [
              "Mechanically trip and block gas flow in milliseconds if downstream pressure exceeds safe threshold",
              "Inject fragrance into the commercial burners",
              "Automatically increase gas flow during lunch peak hours",
              "Vent flammable gas directly into the kitchen ceiling",
            ],
            optionsBn: [
              "ডাউনস্ট্রিম লাইনে অতিরিক্ত চাপ বাড়লে মিলি-সেকেন্ডে স্বয়ংক্রিয়ভাবে প্রধান গ্যাস লাইন সম্পূর্ণ বন্ধ করে দেয়া",
              "রান্নার সুবিধার্থে গ্যাসে সুবাস যোগ করা",
              "রেস্তোরাঁর ব্যস্ত সময়ে অতিরিক্ত গ্যাস সরবরাহ বাড়ানো",
              "আবদ্ধ রান্নাঘরের সিলিংয়ে গ্যাস বের করে দেয়া",
            ],
            correctAnswer: 0,
            explanation:
              "OPSV prevents regulator diaphragms rupture by tripping shut before dangerous overpressure reaches kitchen equipment.",
            explanationBn:
              "রেগুলেটর ক্ষতিগ্রস্ত হয়ে রান্নাঘরের যন্ত্রপাতিতে অনিয়ন্ত্রিত উচ্চচাপের গ্যাস যাওয়া রোধ করে স্ল্যাম-শাট ভালভ।",
          },
          {
            question: "Commercial LPG cylinder manifold rooms must possess independent low-level and high-level cross ventilation.",
            questionBn: "বাণিজ্যিক এলপিজি সিলিন্ডার ম্যানিফোল্ড রুমে মেঝে সংলগ্ন নিচু এবং ছাদ সংলগ্ন উঁচু পর্যাপ্ত ক্রস-ভেন্টিলেশন থাকা বাধ্যতামূলক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "LPG settling low necessitates louvers at floor level to prevent dangerous explosive vapor accumulation.",
            explanationBn:
              "এলপিজি গ্যাস বাতাসের চেয়ে ভারী হওয়ায় মেঝে বরাবর ভেন্টিলেশন লুভার থাকা অগ্নিনির্বাপক আইনের প্রধান শর্ত।",
          },
          {
            question: "Emergency solenoid valves connected to gas detectors should fail in what position during complete power outage?",
            questionBn: "বৈদ্যুতিক পাওয়ার কাট হলে গ্যাস ডিটেক্টরের সাথে যুক্ত জরুরি সোলেনয়েড ভালভটি স্বয়ংক্রিয়ভাবে কোন অবস্থায় যাবে?",
            options: [
              "Fail-Closed (Normally Closed, blocks gas supply for maximum safety)",
              "Fail-Open (Lets maximum gas flow freely)",
              "Remains half-open randomly",
              "Explodes to alert staff",
            ],
            optionsBn: [
              "ফেইল-ক্লোজড (স্বয়ংক্রিয়ভাবে বন্ধ হয়ে গ্যাস সরবরাহ পুরোপুরি রুখে দেয়)",
              "ফেইল-ওপেন (সর্বোচ্চ গ্যাস প্রবাহ চালু রাখে)",
              "অর্ধেক খোলা অবস্থায় থাকে",
              "শব্দ করে বিস্ফোরিত হয়",
            ],
            correctAnswer: 0,
            explanation:
              "Fail-safe protocol requires normally closed solenoids to drop shut when electrical power is severed.",
            explanationBn:
              "নিরাপত্তা নীতিমালায় ফেইল-সেফ ভালভ বিদ্যুৎ চলে গেলে তাৎক্ষণিক গ্যাস বন্ধ করে দেয়।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 2: 3 Videos (2.1, 2.2, 2.3) + 2.4 Assessment Quiz (Enrolled Only)
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 2: Explosion-Proof Gas Detection & Solenoid Interlocks",
      moduleTitleBn: "মডিউল ২: এক্সপ্লোশন-প্রুফ গ্যাস ডিটেকশন ও সোলেনয়েড ইন্টারলক",
      isFree: false, // Enrolled Only!
      lessons: [
        {
          title: "Catalytic Gas Sensor Placement (15-30 cm Above Floor)",
          titleBn: "ক্যাটালিটিক গ্যাস সেন্সর পজিশনিং (মেঝে থেকে ১৫-৩০ সেমি)",
          duration: "13 mins",
          durationBn: "১৩ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Mount explosion-proof certified sensors strictly 15 to 30 cm above floor level. Calibrate low alarm threshold to 10% LEL and high trip to 20% LEL.",
          notesBn:
            "মেঝে থেকে ১৫-৩০ সেমি উপরে ক্যাটালিটিক সেন্সর স্থাপন এবং ১০% LEL-এ ওয়ার্নিং অ্যালার্ম ও ২০% LEL-এ স্বয়ংক্রিয় গ্যাস শাটডাউন।",
        },
        {
          title: "Kitchen Hood Fire Suppression & Solenoid Wiring",
          titleBn: "কিচেন হুড ফায়ার সাপ্রেশন ও সোলেনয়েড ভালভ ওয়্যারিং",
          duration: "14 mins",
          durationBn: "১৪ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Interlock manual pull stations and grease hood suppression chemical cylinders with main pipeline solenoid valves.",
          notesBn:
            "হুড সাপ্রেশন সক্রিয় হলে একইসাথে প্রধান গ্যাস লাইনের সোলেনয়েড ভালভ বন্ধের সংযোগ স্থাপন।",
        },
        {
          title: "Hydrostatic Braided Pigtail Hose Pressure Testing",
          titleBn: "হাইড্রোস্ট্যাটিক ব্রেইডেড পিগটেইল হোস প্রেশার টেস্টিং",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: sampleVideoUrl,
          freePreview: false,
          notes:
            "Mandatory annual hydrostatic pressure certification of high-pressure braided pigtails at 1.5 times maximum working pressure.",
          notesBn:
            "বাণিজ্যিক পিগটেইল হোস পাইপের বাৎসরিক সার্টিফাইড প্রেসার টেস্ট এবং ত্রুটিপূর্ণ পাইপ অপসারণ।",
        },
      ],
      quiz: {
        title: "Module 2 Industrial Detection & Suppression Quiz",
        titleBn: "মডিউল ২: শিল্প ডিটেকশন ও সাপ্রেশন কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "At what height from the finished floor level should commercial LPG catalytic gas sensors be mounted?",
            questionBn: "বাণিজ্যিক রান্নাঘর বা ম্যানিফোল্ড রুমে মেঝে থেকে কত উচ্চতায় এলপিজি গ্যাস ডিটেক্টর সেন্সর বসানো উচিত?",
            options: [
              "15 to 30 cm above the finished floor level",
              "Flush against the ceiling like smoke detectors",
              "At head height (180 cm)",
              "Outside the building roof",
            ],
            optionsBn: [
              "মেঝে থেকে ১৫ থেকে ৩০ সেন্টিমিটার উপরে",
              "স্মোক ডিটেক্টরের মতো একদম ছাদের সাথে",
              "মানুষের মাথার উচ্চতায় (১৮০ সেমি)",
              "ভবনের ছাদের বাইরে",
            ],
            correctAnswer: 0,
            explanation:
              "Because LPG is heavier than air, early leak detection requires sensors 15-30 cm above the floor.",
            explanationBn:
              "এলপিজি গ্যাস বাতাসের চেয়ে ভারী হওয়ায় মেঝে বরাবর জমা হয়, তাই ১৫-৩০ সেমি উচ্চতায় স্থাপন আবশ্যক।",
          },
          {
            question: "What percentage of the Lower Explosive Limit (LEL) should trigger the master automatic gas cutoff solenoid?",
            questionBn: "লোয়ার এক্সপ্লোসিভ লিমিটের (LEL) শতকরা কত ভাগ গ্যাস উপস্থিত হলে স্বয়ংক্রিয় শাটডাউন সোলেনয়েড সক্রিয় হওয়া উচিত?",
            options: [
              "20% of LEL (Safe margin well before explosive mixture formation)",
              "100% of LEL",
              "95% of LEL",
              "0.001% of LEL",
            ],
            optionsBn: [
              "২০% LEL (বিস্ফোরণ ঘটার আগেই পর্যাপ্ত নিরাপত্তা মার্জিন নিশ্চিত করে)",
              "১০০% LEL",
              "৯৫% LEL",
              "০.০০০১% LEL",
            ],
            correctAnswer: 0,
            explanation:
              "NFPA standards mandate shutting off fuel supplies at or before 20% LEL to eliminate flash fire risk.",
            explanationBn:
              "বিস্ফোরণ সীমা স্পর্শ করার অনেক আগেই ২০% LEL-এ গ্যাস বন্ধ করে নিরাপত্তা নিশ্চিত করা হয়।",
          },
          {
            question: "Stainless-steel braided flexible pigtail hoses connecting cylinders to manifolds must undergo hydrostatic testing every year.",
            questionBn: "ম্যানিফোল্ডে সিলিন্ডার সংযোগকারী স্টেইনলেস স্টিল ব্রেইডেড পিগটেইল হোস প্রতি বছর সার্টিফাইড প্রেসার টেস্ট করা বাধ্যতামূলক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "High vibration and cyclic pressure necessitate mandatory annual certified pressure certification.",
            explanationBn:
              "উচ্চ চাপ ও বারবার সংযোগ খোলার কারণে বাৎসরিক সার্টিফাইড হাইড্রোস্ট্যাটিক টেস্ট বাধ্যতামূলক।",
          },
          {
            question: "Using domestic low-pressure clip-on regulators on commercial high-consumption restaurant tandoor burners is strictly illegal and hazardous.",
            questionBn: "বাণিজ্যিক রেস্তোরাঁর তন্দুর বা বড় চুলার লাইনে সাধারণ গৃহস্থালি ক্লিপ-অন রেগুলেটর ব্যবহার আইনত দণ্ডনীয় ও বিপজ্জনক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Domestic regulators cannot sustain commercial flow rates, freezing up and leaking catastrophically.",
            explanationBn:
              "গৃহস্থালি রেগুলেটর অধিক গ্যাস প্রবাহ সামলাতে পারে না এবং বরফ জমে মারাত্মক লিকেজ ও দুর্ঘটনা ঘটায়।",
          },
        ],
      },
    },

    // -------------------------------------------------------------
    // MODULE 3: FINAL CERTIFICATION EXAM (0 VIDEOS, EXAM ONLY)
    // -------------------------------------------------------------
    {
      moduleTitle: "Module 3: DoE Statutory Compliance & Final Certification Exam",
      moduleTitleBn: "মডিউল ৩: বিস্ফোরক অধিদপ্তর সংবিধিবদ্ধ কমপ্লায়েন্স ও সমাপনী সনদপত্র মূল্যায়ন",
      isFree: false, // Enrolled Only!
      lessons: [], // NO VIDEOS in last module!
      quiz: {
        title: "Final Industrial LPG Safety & Compliance Certification Exam",
        titleBn: "সমাপনী শিল্প এলপিজি নিরাপত্তা ও কমপ্লায়েন্স সনদপত্র পরীক্ষা",
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
          {
            question: "What is the consequence under Section 5 of the Explosives Act 1884 for operating an unlicensed commercial LPG manifold exceeding 80 kg?",
            questionBn: "বিস্ফোরক আইন ১৮৮৪ এর ধারা ৫ অনুযায়ী লাইসেন্সবিহীন ৮০ কেজির অধিক এলপিজি সিলিন্ডার বাণিজ্যিক ব্যবহার করলে কী শাস্তি হতে পারে?",
            options: [
              "Immediate premises sealing, confiscation of cylinders, and criminal statutory fines/imprisonment",
              "A polite reminder letter with zero consequences",
              "Free cylinders awarded by the government",
              "Discount on business taxes",
            ],
            optionsBn: [
              "তাৎক্ষণিক প্রতিষ্ঠান সিলগালা, সকল সিলিন্ডার বাজেয়াপ্ত এবং ফৌজদারি জেল ও জরিমানা",
              "কোনো ব্যবস্থা না নিয়ে শুধু অনুরোধপত্র পাঠানো",
              "সরকার থেকে বিনামূল্যে অতিরিক্ত গ্যাস দেওয়া",
              "ব্যবসায়িক কর মওকুফ করা",
            ],
            correctAnswer: 0,
            explanation:
              "Operating an unlicensed commercial LPG setup is a non-bailable statutory offense under Bangladesh explosives regulations.",
            explanationBn:
              "লাইসেন্স ব্যতীত এলপিজি মজুদ ও বাণিজ্যিক ব্যবহার দণ্ডবিধির অধীন শাস্তিযোগ্য অপরাধ।",
          },
          {
            question: "Commercial gas pipe installations must be painted statutory golden-yellow with flow direction arrow markers for quick identification.",
            questionBn: "বাণিজ্যিক এলপিজি গ্যাস পাইপলাইনগুলো চিহ্নিতকরণে সংবিধিবদ্ধ সোনালী-হলুদ রঙ এবং গ্যাস প্রবাহের দিক নির্দেশক তীরচিহ্ন আঁকা বাধ্যতামূলক।",
            options: ["True", "False"],
            optionsBn: ["সত্য", "মিথ্যা"],
            correctAnswer: 0,
            explanation:
              "Standard color coding (golden yellow) prevents accidental tapping of fuel gas lines by plumbers.",
            explanationBn:
              "অগ্নি নিরাপত্তা বিধিমতে গ্যাস লাইন চেনার জন্য হলুদ রঙ ও প্রবাহের দিক নির্দেশক থাকা বাধ্যতামূলক।",
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
          moduleIndex: modIdx,
          moduleTitle: mod.moduleTitle,
          moduleTitleBn: mod.moduleTitleBn,
          question: q.question,
          questionBn: q.questionBn,
          type: isTrueFalse ? "true_false" : "single",
          options: formattedOptions,
          explanation: q.explanation || "",
          explanationBn: q.explanationBn || "",
          points: 10,
        });
      });
    }
  });

  return {
    courseId: courseData.courseId,
    courseTitle: courseData.title,
    title: `${courseData.title} - Complete Assessment Quiz`,
    titleBn: `${courseData.titleBn} - সম্পূর্ণ মূল্যায়ন কুইজ`,
    passingScore: 70,
    durationMinutes: 25,
    questions: allQuestions,
    questionsCount: allQuestions.length,
    status: "published",
    isPublished: true,
  };
}

// =========================================================================
// EXECUTE SEEDING
// =========================================================================
async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ael";
  console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);

  try {
    console.log("[Seed] 1. Clearing ALL existing courses and quizzes from database...");
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    console.log("[Seed] 2. Resetting test users' enrolled courses for a completely fresh start...");
    await User.updateMany(
      {},
      {
        $set: {
          enrolledCourses: [],
        },
      }
    );

    console.log("[Seed] 3. Inserting Brand New Free Course...");
    const createdFree = await Course.create(brandNewFreeCourse);
    console.log(`   ✓ Free Course Created: ${createdFree.title}`);
    console.log(`     ID: ${createdFree._id}`);
    console.log(`     Slug: ${createdFree.slug}`);
    console.log(`     Price: ৳ ${createdFree.price}`);
    console.log(`     Modules: ${createdFree.curriculum.length}`);
    createdFree.curriculum.forEach((m, i) => {
      console.log(`       Module ${i + 1}: ${m.moduleTitle} (Videos: ${m.lessons.length}, Quiz: ${m.quiz?.questions?.length} Qs)`);
    });

    const freeQuizData = buildGlobalQuizData(brandNewFreeCourse);
    await Quiz.create(freeQuizData);
    console.log(`   ✓ Free Course Question Bank Created (${freeQuizData.questions.length} questions)`);

    console.log("[Seed] 4. Inserting Brand New Paid Course...");
    const createdPaid = await Course.create(brandNewPaidCourse);
    console.log(`   ✓ Paid Course Created: ${createdPaid.title}`);
    console.log(`     ID: ${createdPaid._id}`);
    console.log(`     Slug: ${createdPaid.slug}`);
    console.log(`     Price: ৳ ${createdPaid.price}`);
    console.log(`     Modules: ${createdPaid.curriculum.length}`);
    createdPaid.curriculum.forEach((m, i) => {
      console.log(`       Module ${i + 1}: ${m.moduleTitle} (Videos: ${m.lessons.length}, Quiz: ${m.quiz?.questions?.length} Qs)`);
    });

    const paidQuizData = buildGlobalQuizData(brandNewPaidCourse);
    await Quiz.create(paidQuizData);
    console.log(`   ✓ Paid Course Question Bank Created (${paidQuizData.questions.length} questions)`);

    console.log("\n==========================================================");
    console.log("🎉 SUCCESS: 2 Brand New Courses uploaded to Database!");
    console.log("   • Free Course: http://localhost:3000/courses/learn/" + createdFree.slug);
    console.log("   • Paid Course: http://localhost:3000/courses/learn/" + createdPaid.slug);
    console.log("   • In BOTH courses, the LAST MODULE (Module 3) has 0 videos and contains the final exam quiz!");
    console.log("==========================================================");
  } catch (err) {
    console.error("[Seed] Error executing seeding:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeed();

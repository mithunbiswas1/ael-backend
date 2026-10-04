// ael_backend/seed_ads.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const mongoUri = process.env.MONGODB_URL || "mongodb://localhost:27017/ael";
  await mongoose.connect(mongoUri);
  const Ad = mongoose.model("Advertisement", new mongoose.Schema({}, { strict: false }));

  const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const adsToSeed = [
    {
      slot: "header_banner",
      title: "Reliable LPG Solutions for a Safer & Greener Tomorrow",
      type: "image",
      imageUrl: "/public/upload/ad_header_leaderboard.jpg",
      clickUrl: "https://ael-bd.com",
      isActive: true,
      startDate: past,
      endDate: future,
    },
    {
      slot: "right_overlay",
      title: "AEL - Think Safety. Use LPG Safely.",
      type: "image",
      imageUrl: "/public/upload/ad_header_leaderboard.jpg",
      clickUrl: "https://ael-bd.com/safety",
      isActive: true,
      startDate: past,
      endDate: future,
    },
    {
      slot: "mid_content",
      title: "Industrial LPG Safety Valves & Dispenser Equipment",
      type: "image",
      imageUrl: "/public/upload/ad_mid_billboard.jpg",
      clickUrl: "https://ael-bd.com/guidelines",
      isActive: true,
      startDate: past,
      endDate: future,
    },
    {
      slot: "sidebar_ad",
      title: "Certified LPG Safety Inspection - Hydrostatic Testing",
      type: "image",
      imageUrl: "/public/upload/ad_lpg_inspection_sidebar.jpg",
      clickUrl: "https://ael-bd.com/inspection",
      isActive: true,
      startDate: past,
      endDate: future,
    },
    {
      slot: "footer_banner",
      title: "Reliable Energy. Safer Future. AEL - Your Partner in LPG Safety",
      type: "image",
      imageUrl: "/public/upload/ad_header_leaderboard.jpg",
      clickUrl: "https://ael-bd.com/about",
      isActive: true,
      startDate: past,
      endDate: future,
    },
    {
      slot: "popup_ad",
      title: "Stay Safe with LPG - Safe Usage. Safe Future.",
      type: "image",
      imageUrl: "/public/upload/ad_popup_modal.jpg",
      clickUrl: "https://ael-bd.com/training",
      isActive: true,
      startDate: past,
      endDate: future,
    },
  ];

  for (const item of adsToSeed) {
    await Ad.updateOne(
      { slot: item.slot },
      { $set: item },
      { upsert: true }
    );
  }

  const allAds = await Ad.find({}, { title: 1, slot: 1, type: 1, isActive: 1, imageUrl: 1 });
  console.log("Successfully seeded/verified all 6 ads:", JSON.stringify(allAds, null, 2));
  await mongoose.disconnect();
}

main().catch(console.error);

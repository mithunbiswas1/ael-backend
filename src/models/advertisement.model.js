// ael_backend/src/models/advertisement.model.js

import mongoose, { Schema } from "mongoose";

const advertisementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slot: {
      type: String,
      required: true,
      enum: [
        "header_banner", // 1. topbar and navbar er majhe
        "right_overlay", // 2. right side overlay ads
        "mid_content", // 3. home hero er niche
        "footer_banner", // 4. footer er upore
        "sidebar_ad", // 5. subscribe card er niche
        "popup_ad", // 6. website hover center center
        "sponsored_post",
      ],
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "google_ads", "html5"],
      default: "image",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    googleAdClient: {
      type: String,
      default: "",
    },
    googleAdSlot: {
      type: String,
      default: "",
    },
    googleAdFormat: {
      type: String,
      default: "auto",
    },
    htmlContent: {
      type: String,
      default: "",
    },
    clickUrl: {
      type: String,
      default: "#",
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Advertisement = mongoose.model(
  "Advertisement",
  advertisementSchema
);

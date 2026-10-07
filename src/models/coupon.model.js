// ael_backend/src/models/coupon.model.js
import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Coupon title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free_access"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    targetType: {
      type: String,
      enum: ["all", "subscription", "course"],
      default: "all",
    },
    targetItems: [
      {
        type: String, // Specific courseId or planKey (e.g. '1', 'monthly')
      },
    ],
    // Whole life gift feature: If true, grants lifetime access (100 years validity)
    isLifetimeAccess: {
      type: Boolean,
      default: false,
    },
    // Coupon code validity duration: Never expires vs Date range
    isNeverExpires: {
      type: Boolean,
      default: false,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: null,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // Cap for percentage discount
    },
    usageLimit: {
      type: Number,
      default: null, // Total maximum usages across all users (null = unlimited)
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      default: 1, // Max redemptions per individual user account
    },
    usedBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        userEmail: { type: String },
        userPhone: { type: String },
        transactionId: { type: String },
        discountGiven: { type: Number, default: 0 },
        usedAt: { type: Date, default: Date.now },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);

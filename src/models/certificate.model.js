// ael_backend/src/models/certificate.model.js
import mongoose, { Schema } from "mongoose";

const certificateSchema = new Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    studentName: { type: String, required: true },
    studentNameBn: { type: String, default: "" },
    courseTitle: { type: String, required: true },
    courseTitleBn: { type: String, default: "" },
    issueDate: { type: String, required: true },
    issueDateBn: { type: String, default: "" },
    validTill: { type: String, default: "Lifetime Validity" },
    validTillBn: { type: String, default: "" },
    grade: { type: String, default: "Pass (90%)" },
    status: { type: String, default: "Verified & Valid" },
    authorizedBy: { type: String, default: "Engr. Mahmudul Hasan (DoE Lead Auditor)" },
    issuingAuthority: {
      type: String,
      default: "Safe LPG in collaboration with Department of Explosives (DoE) & LOAB",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);

// ael_backend/src/models/quiz.model.js
import mongoose, { Schema } from "mongoose";

const quizOptionSchema = new Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  text: { type: String, default: "" },
  textBn: { type: String, default: "" },
  isCorrect: { type: Boolean, default: false },
});

const quizQuestionSchema = new Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  question: { type: String, default: "" },
  questionBn: { type: String, default: "" },
  type: {
    type: String,
    enum: ["single", "multiple", "true_false"],
    default: "single",
  },
  options: [quizOptionSchema],
  explanation: { type: String, default: "" },
  explanationBn: { type: String, default: "" },
  points: { type: Number, default: 1 },
});

const questionSetSchema = new Schema({
  setId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  setName: { type: String, default: "Set 1" },
  setNameBn: { type: String, default: "সেট ১" },
  description: { type: String, default: "" },
  questions: [quizQuestionSchema],
});

const quizSchema = new Schema(
  {
    courseId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "LPG Safety Assessment Quiz" },
    titleBn: { type: String, default: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ" },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, default: 15 },
    timerEnabled: { type: Boolean, default: true },
    passPercentage: { type: Number, default: 70 },
    questionsPerQuiz: { type: Number, default: 20 },
    cooldownMinutes: { type: Number, default: 15 },
    shuffleOptions: { type: Boolean, default: true },
    questionSets: [questionSetSchema],
    questionBank: [quizQuestionSchema],
    // Backward compatibility if questions array was used:
    questions: [quizQuestionSchema],
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;

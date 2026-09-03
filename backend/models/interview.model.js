import mongoose from "mongoose";

// Overall dekhe to ye puri file sirf ek interview ko store karne ke liye hai.

// questions ka schema
const questionSchema = new mongoose.Schema(
  {
    question: String,
    difficulty: String, //for each question there will be a difficulty.
    timeLimit: Number, //if each question has different time limit then it come in use. warna waise to same ho to jyada acha hai.
    answer: String,
    feedback: String,
    score: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    correctness: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

// interview ka schema
const interviewSchema = new mongoose.Schema(
  {
    userId: {
      // jab hame dusri schema se koi cheez uthani ho tab ref ka use karte hai.
      // ObjectId apne aap banti hai mongodb me, iska naam 'ObjectId' mongodb set karta hai.
      // hum bol rahehai mongoose ke ek schema {user} se ek objectId type ka data dedo precisely id de be.
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },
    resumeText: {
      type: String,
    },
    questions: [questionSchema], //5 questions ke alag alag answer, different scores and different difficulty level honge isiliye hum questions ko ek alag hi Schema me rakhenge. Suppose ek user id se ek naam hota hai , ek passord hotahai to wo ek hi schema se chal jayega lekin yaha par 5 questions or sabka alag difficulty level etc hai to wo alag schema me rahega.
    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "incompleted"],
      default: "incompleted",
    },
  },
  { timestamps: true },
);

const interviewModel = mongoose.model("interview", interviewSchema);
export default interviewModel;

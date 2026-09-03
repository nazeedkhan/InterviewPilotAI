import express, { Router } from "express";
import gettingUserIDFromToken from "../middlewares/gettingUserIDFromToken.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestions,
  getInterviewDetail,
  getMyAllInterviews,
  submitAnswer,
} from "../controllers/interview.controller.js";
import upload from "../middlewares/multer.js";

const interviewRoute = express(Router);

// User-routes here
interviewRoute.post(
  "/resume",
  gettingUserIDFromToken,
  upload.single("resume"), // yaha par hum frontend se resume naam ka file le rahe hai isiliye frontend se bhejte time hame waha par file ka naam resume hi rakhna padega.
  analyzeResume,
);

interviewRoute.post(
  "/generate-questions",
  gettingUserIDFromToken,
  generateQuestions,
);
interviewRoute.post("/submit-answer", gettingUserIDFromToken, submitAnswer);
interviewRoute.post("/finish", gettingUserIDFromToken, finishInterview);

// history section
interviewRoute.get(
  "/getmyinterviews",
  gettingUserIDFromToken,
  getMyAllInterviews,
);
interviewRoute.get(
  "/getinterviewdetail/:id",
  gettingUserIDFromToken,
  getInterviewDetail,
);

export default interviewRoute;

import fs from "fs"; //file system
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import askAI from "../services/openRouter.service.js";
import userModel from "../models/user.model.js";
import interviewModel from "../models/interview.model.js";

export const analyzeResume = async (req, res) => {
  try {
    // req.file se resume milega bcz multer use kr rahe hai.
    if (!req.file) {
      return res.status(400).json({ message: "Resume required!" });
    }

    // resume file ka path le rahe hai jo public me hoga
    const filepath = req.file.path;
    // console.log("filepath resume ka : ", filepath);

    // inbuilt nodejs me ek 'fs' module hota hai jo kisi bhi file me CRUD karne ke liye hota hai. Ye file ka filepath maangta hai isiliye hum filepath le rahe hai uper step me.
    // Ab fs se file read karwayenge, badle me ye binary data deta hai.
    const binaryData = await fs.promises.readFile(filepath);

    // Ab binary format data se to hum kuch kar nahi sakte to isko change karna padega Uint8Array format me - yahi format pdfjs-dist package samajhta hai.
    const uint8ArrayFormatData = new Uint8Array(binaryData);

    // ab kaam aata hai pdfjs-dist package ka. Ye package hame pdf return karega with pages.
    const pdf = await pdfjsLib.getDocument({ data: uint8ArrayFormatData })
      .promise;

    let resumeText = "";
    for (let pdfPage = 1; pdfPage <= pdf.numPages; pdfPage++) {
      const page = await pdf.getPage(pdfPage);
      const content = await page.getTextContent();

      // [
      //   { str: "Nazeed" },
      //   { str: "Khan" },
      //   { str: "Software" },
      //   { str: "Engineer" }
      // ]
      //   content aisa ho sakta hai isiliye ek ek item ko join kar rahe hai with " ".

      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";

      resumeText = resumeText.replace(/\s+/g, " ").trim();
    }
    const messages = [
      {
        role: "system",
        content: `
          Extract structured data from resume. 
          
          Return strictly JSON:

          {
            "role":"string",
            "experience":"string",
            "projects":["project1","project2"],
            "skills":["skill1","skill2"]
          }
          `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];
    // console.log('Before requesting AI')
    const aiResponse = await askAI(messages);
    const parsed = JSON.parse(aiResponse);
    // console.log('After requesting AI')

    fs.unlinkSync(filepath);

    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Ye hai baat : " + error.message });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    // trim kar rahe hai extra spaces ko for being in plus points, no error in the future.
    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();
    if (!role || !experience || !mode) {
      return res.status(400).json({
        message:
          "Can't proceed further in the Interview without role, experience & mode.",
      });
    }

    // agar user ke paas enough credits nahi hai to interview nahi hoga isiliye questions generate karwana bhi bekaar hai, api calls bachao, api calls padhao.
    const user = await userModel.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.credit < 50) {
      return res.status(400).json({
        message: "Not enough credits. Interview requires 50 credits.",
      });
    }

    // Array.prototype.join() method returns a new string consisting of all the elements from the array concatenated together

    // ab yaha par projects, skills, or resumeText ko check kar rahe hai kahi koi text me error to nahi jisse askAI galat response de. plus, jab in teeno ko bhejenge to array nahi bhej sakte prompt me isiliye join use kar rahe hai for string.
    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResumeText =
      Array.isArray(resumeText) && resumeText.length
        ? resumeText.join(", ")
        : "None";

    // ab prompt denge lekin usse pehle sab data ko ek jagah le lete hai prompt me easy rahega
    const alldetails = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText}
    Resume:${safeResumeText}
    `;

    // !alldetails.trim() ka matlab hai pehle alldetails.trim() karo, means khaali spaces thi sirf or trim kardeiya to empty string ho gayi to check kr rahe hai ki empty string nahi honi chahiye agar hai to return.

    if (!alldetails.trim()) {
      return res.status(400).json({ message: "There is no content." });
    }

    // asli prompt jo askAI lega basically ek array lega.
    // jab hum AI ko input bhejte hai tab do object me bhejte hai ek as a system ek as a user. system me jo hame karwana hai, user me jo hum bhejna chahte hai for reference.
    const messages = [
      {
        role: "system",
        content: `
      You are a real human interviewer conducting a professional interview.
      
      Speak in simple, natural English as if you are directly talking to the candidate.

      Generate exactly 5 interview questions.

      Strict Rules:
      - Each question must contain between 15 and 25 words.
      - Each question must be a single complete sentence.
      - Do NOT number them.
      - Do NOT add explainations.
      - Do NOT add extra text before or after.
      - One question per line only.
      - Keep language simple and conversational.
      - Questions must feel practical and realistic.

      Difficulty progression:
      Question 1-> Easy
      Question 2-> Easy
      Question 3-> Medium
      Question 4-> Medium
      Question 5-> Hard

      Make questions based on the candidate's role, experience, interviewMode, projects, skills, and resume details.

      `,
      },
      {
        role: "user",
        content: alldetails,
      },
    ];

    // yaha par hum request bhej rahe hai with our prompt
    const aiResponse = await askAI(messages);

    // checking either response has come or not and if there is an empty response
    if (!aiResponse || !aiResponse.trim()) {
      return res
        .status(500)
        .json({ message: "AI failed to generate questions." });
    }

    // ab response se questions ko nikalenge, ho skta hai ki questions ek hi line me ho, blank questions ho, ya 5 se jyada questions ho, to un sabko handle krenge.
    const questionsArray = aiResponse
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 5);

    // kya abhi bhi jo asli questions trim kiye wo length me 0 hai to usme questions aaye hi nahi.
    if (questionsArray.length === 0) {
      return res
        .status(500)
        .json({ message: "AI failed to generate questions." });
    }

    // yaha par aa chuke matlab questions aa gaye hai to user ke credits ko minus and save the current info.
    user.credit -= 50;
    await user.save();

    // ab interview model me questions and id's and or bhi details update karenge.
    const difficultyArray = ["easy", "easy", "medium", "medium", "hard"];
    const timeLimitArray = [60, 60, 90, 90, 120];

    const interview = await interviewModel.create({
      userId: user._id,
      role: role,
      experience: experience,
      mode: mode,
      resumeText: safeResumeText,
      questions: questionsArray.map((item, index) => ({
        question: item,
        difficulty: difficultyArray[index],
        timeLimit: timeLimitArray[index],
      })),
    }); //baaki ka data jaise score, confidence level etc.. interview ke baad update krenge.

    // ab necessary info frontend ko bhejenge.
    res.json({
      interviewId: interview._id, // after interview kis interview data ko update karna hai uska address to id me hi hai. ex. frontend se post request bhejenge tab url me id deni padegi uske liye hai.
      creditsLeft: user.credit,
      username: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      catchSeBolRahaHu: "Questions generate karte hue error",
      message: error.message,
    });
  }
};

// jab answer denge frontend par tab har ek answer ke baad next button dabayenge uski moment pr is api ko call karke us particular answer ko update karenge.
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timetaken } = req.body;
    // interviewId - konse interview ko update
    // questionIndex - interview ke 5 me se konsa question
    // timetaken - agar time pura hone ke baad answer diya ya time par answer nahi diya to no update return condition.

    // database me konse question ko update karna wo nikalenge.
    const interview = await interviewModel.findById(interviewId);
    const question = interview.questions[questionIndex];

    // if no answer;
    if (!answer) {
      question.score = 0;
      question.feedback = "No answer provided.";
      question.answer = "";
      await interview.save();
      return res.json({
        feedback: question.feedback,
      });
    }

    // if timeout happened ||time exceeded
    if (timetaken > question.timeLimit) {
      question.score = 0;
      question.feedback =
        "Time Limit Exceeded. This answer will not be evaluated.";
      question.answer = answer;
      await interview.save();
      return res.json({
        feedback: question.feedback,
      });
    }

    // ab jaise hamare paas sab kuch hai answer, under timelimit etc. Tab hum AI ko request marenge or puchenge ki kya score is question ka agar ye answer hai to, or wahi se confidence level wagaraih...or uske message banana padega as prompt.
    const messages = [
      {
        role: "system",
        content: `
        You are a professional human interviewer evaluating a candidate's answer in a real interview.

        Evaluate naturally and fairly, like a real person would.

        Score the answer in these areas (0 to 10):

        1. Confidence - Does the answer sound clear, confident and well-presented?
        2. Communication - Is the language simple, clear and easy to understand? 
        3. Correctness - Is the answer accurate, relevant and complete?

        Rules:
        - Be realistic and unbiased.
        - Do not give random high scores.
        - If the answer is weak, score low.
        - If the answer is strong and detailed, score high.
        - Consider clarity, structure and relevance.

        Calculate:
        finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

        Feedback Rules:
        - Write natural human feedback.
        - 10 to 15 words only.
        - Sound like real interview feedback.
        - Can suggest improvement, if needed.
        - Do NOT repeat the question.
        - Do NOT explain scoring.
        - Keep tone professional and honest.

        Return ONLY valid JSON in this format:

        {
          "confidence":number,
          "communication":number,
          "correctness":number,
          "finalScore":number,
          "feedback":"short human feedback"
        }
        `,
      },
      {
        role: "user",
        content: `
          Question : ${question.question},
          Answer:${answer}
          `,
      },
    ];
    const aiResponse = await askAI(messages);
    const parsed = JSON.parse(aiResponse);

    // updating remaining fields inside interview model.
    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    await interview.save();

    // only sending feedback to frontend.
    return res.status(200).json({ feedback: parsed.feedback });
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

// final Score ke liye controller. Interview complete button par click karne se ispar post request jayegi - interview complete hai ya incomplete hai or finalScore ye sab is controller frontend me bhejenge.
export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await interviewModel.findById(interviewId);
    if (!interview) {
      return res.status(400).json({ message: "No such interview exists!" });
    }

    // ab hame interviewmodel se sabhi question ke score laane hai or average nikalna hai or bhejna hai frontend me.

    // pehle total no. of question nikalte hai , waise to 5 hai lekin in future badhaye to automatically calculate ho jayega.
    const totalQuestions = interview.questions.length;

    // to keep in mind kahi kahi total questions 5 nahi honge suppose user ne 2 question ke baad leave kardiya.

    // ab jo jo dikhana hai usko initialize karte hai
    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    // ab loop laga kar har questions ke marks ko inme plus karenge.
    interview.questions.forEach((item) => {
      totalScore += item.score || 0;
      totalConfidence += item.confidence || 0;
      totalCommunication += item.communication || 0;
      totalCorrectness += item.correctness || 0;
    });

    // in sab me 5 questions ke hissab se score hai ex 45, 48, 40, 50... to inka average nikalna padega----conditional isiliye ki total questions nahi bhi ho sakte hai kya paat 2 hi ho user ne 3eesre question me leave kardiya ho?
    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const finalTotalConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;
    const finalTotalCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const finalTotalCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    // DB me update krow.
    interview.finalScore = finalScore;
    interview.status = "completed";
    await interview.save();

    // ab bhejo sab kuch jo jo dikhana hai final screen par;
    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)), // toFixed se decimal digits kitni deni hai wo set hoti hai.
      confidence: Number(finalTotalConfidence.toFixed(1)),
      communication: Number(finalTotalCommunication.toFixed(1)),
      correctness: Number(finalTotalCorrectness.toFixed(1)),

      questionWiseScore: interview.questions.map((item) => ({
        question: item.question,
        score: item.score || 0,
        feedback: item.feedback || "",
        confidence: item.confidence || 0,
        communication: item.communication || 0,
        correctness: item.correctness || 0,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error: "ye hai error.",
      message: error.message,
    });
  }
};

// yaha se saare interviews ek particular user ke aayenge.
export const getMyAllInterviews = async (req, res) => {
  try {
    const recentInterview = await interviewModel
      .find({ userId: req.userID }) // find all interview for this user
      .sort({ createdAt: -1 }) // latest order me aayenge interviews
      .select("role experience mode finalScore status createdAt"); // only return these fields.

    return res.status(200).json(recentInterview);
  } catch (error) {
    return res.status(500).json({
      error: "Error Inside getMyInterviews Controller.",
      message: error.message,
    });
  }
};

// ab kisi ek interview ki details ko nikal kr bhejenge id params se aayegi.
export const getInterviewDetail = async (req, res) => {
  try {
    // console.log("req.params.id");
    // console.log(req.params.id);
    const interview = await interviewModel.findById(req.params.id);

    if (!interview) {
      return res.status(400).json({ message: "No such interview exists!" });
    }
    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((item) => {
      totalConfidence += item.confidence || 0;
      totalCommunication += item.communication || 0;
      totalCorrectness += item.correctness || 0;
    });

    const finalTotalConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;
    const finalTotalCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const finalTotalCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    // ab bhejo sab kuch jo jo dikhana hai final screen par;
    return res.status(200).json({
      finalScore: interview.finalScore,
      confidence: Number(finalTotalConfidence.toFixed(1)),
      communication: Number(finalTotalCommunication.toFixed(1)),
      correctness: Number(finalTotalCorrectness.toFixed(1)),
      questionWiseScore: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error Inside getInterviewDetail Controller.",
      message: error.message,
    });
  }
};

import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import bot from '../assets/bot.png'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Step3Report = ({ interviewReport }) => {
  console.log(interviewReport);
  const navigate = useNavigate();

  const {
    finalScore = 0, //if no value then 0
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [], // if no value then empty array atleast
  } = interviewReport;

  // need this name-score format because hame abhi graph use karna hai.
  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Question. ${index + 1}`,
    score: score.score,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagLine = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagLine = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5 && finalScore < 8) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagLine = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagLine = "Work on clarity and confidence.";
  }

  function handelPDF_download() {
    const documentPDF = new jsPDF("p", "mm", "a4");

    const pageWidth = documentPDF.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    // making title
    documentPDF.setFont("helvetica", "bold");
    documentPDF.setFontSize(20);
    documentPDF.setTextColor(34, 197, 94);
    documentPDF.text(
      "InterviewPilot.AI - Performance Report",
      pageWidth / 2,
      currentY,
      {
        align: "center",
      },
    );

    currentY += 5;

    // underline
    documentPDF.setDrawColor(34, 197, 94);
    documentPDF.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    // final score box
    documentPDF.setFillColor(240, 253, 244);
    documentPDF.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    documentPDF.setFontSize(14);
    documentPDF.setTextColor(0, 0, 0);
    documentPDF.text(
      `Final Score : ${finalScore}/10`,
      pageWidth / 2,
      currentY + 12,
      {
        align: "center",
      },
    );

    currentY += 30;

    // skills box
    documentPDF.setFillColor(249, 250, 251);
    documentPDF.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    documentPDF.setFontSize(12);
    documentPDF.text(`Confidence : ${confidence}`, margin + 10, currentY + 10);
    documentPDF.text(
      `Communication : ${communication}`,
      margin + 10,
      currentY + 18,
    );
    documentPDF.text(
      `Correctness : ${correctness}`,
      margin + 10,
      currentY + 26,
    );

    currentY += 45;

    // advice
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5 && finalScore < 8) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking clarity, and confident delivery. Practice answering aloud regularly.";
    }

    documentPDF.setFillColor(255, 255, 255);
    documentPDF.setDrawColor(220);
    documentPDF.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    documentPDF.setFont("helvetica", "bold");
    documentPDF.text(`Professional Advice`, margin + 10, currentY + 10);
    documentPDF.setFont("helvetica", "normal");
    documentPDF.setFontSize(11);

    const splitAdvice = documentPDF.splitTextToSize(advice, contentWidth - 20);
    documentPDF.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // question table;
    autoTable(documentPDF, {
      startY: currentY,
      margin: {
        left: margin,
        right: margin,
      },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((item, index) => [
        `${index + 1}`,
        item.question,
        `${item.score}/10`,
        item.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, //index
        1: { cellWidth: 55 }, //question
        2: { cellWidth: 20, halign: "center" }, //index
        3: { cellWidth: "auto" }, //question
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    // Thank you message! with image

    documentPDF.setFillColor(240, 253, 244);
    documentPDF.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    documentPDF.setFontSize(14);
    documentPDF.setTextColor(0, 0, 0);
    documentPDF.text(
      `Thanks for using InterviewPilot.AI`,
      pageWidth / 2,
      currentY + 12,
      {
        align: "center",
      },
    );

    documentPDF.save("AI_interview_report.pdf");
  }

  return (
    <>
      <div className="min-h-screen bg-linear-90 from-gray-100 to-green-200 py-8 lg:px-10 sm:px-6 px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* heading */}
          <div className="md:mb-10 w-full flex items-start gap-4 flex-wrap ">
            <button
              onClick={() => navigate("/history")}
              className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition "
            >
              {" "}
              <FaArrowLeft className="text-gray-800" />{" "}
            </button>
            <div className="">
              <h1 className="text-3xl font-bold flex-nowrap text-gray-800">
                Interview Analytics Dashboard
              </h1>
              <p className="text-gray-500 mt-2">
                AI-powered performance insights
              </p>
            </div>
          </div>

          <button
            onClick={handelPDF_download}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-nowrap"
          >
            Download PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* left area */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center"
            >
              <h3 className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base font-semibold">
                Overall Performance
              </h3>
              <div className="w-20 h-20 relative sm:w-25 sm:h-25 mx-auto">
                <CircularProgressbar
                  value={(finalScore / 10) * 100}
                  text={`${finalScore}/10`}
                  styles={buildStyles({
                    textSize: "18px",
                    pathColor: "#10b981",
                    textColor: "#ef4444",
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">Out of 10</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {performanceText}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {shortTagLine}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
                Skill Evaluation
              </h3>
              <div className="space-y-5">
                {skills.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2 text-sm sm:text-base items-center">
                      <span>{item.label}</span>
                      <span className="font-semibold text-green-600">
                        {item.value}
                      </span>
                    </div>

                    <div className="bg-gray-200 h-2 sm:h-3 rounded-full">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${item.value * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* right area */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
                Performance Chart
              </h3>
              <div className="h-64 sm:h-72">
                {/* showing chart */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#22c55e"
                      fill="#bbf7d0"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
                Question Breakdown
              </h3>
              <div className="space-y-3">
                {questionWiseScore.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="">
                        <p className="text-xs text-gray-400">
                          Question {index + 1}
                        </p>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base leading-relaxed">
                          {item.question || "Question not available"}
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit">
                        {item.score || 0}/10
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-semibold mb-1">
                        AI Feedback
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.feedback && item.feedback.trim() !== ""
                          ? item.feedback
                          : "No feedback available for this question."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3Report;

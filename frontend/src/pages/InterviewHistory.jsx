import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      async function gettingmyinterviews() {
        const result = await axios.get(
          serverURL + "/api/interview/getmyinterviews",
          { withCredentials: true },
        );
        console.log(result.data);
        setInterviews(result.data);
      }
      gettingmyinterviews();
    } catch (error) {
      console.log("Error while fetching all interviews history: ", error);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-linear-90 from-gray-100 to-green-200 py-10">
        <div className="w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto">
          {/* heading */}
          <div className="mb-10 w-full flex items-start gap-4 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition "
            >
              {" "}
              <FaArrowLeft className="text-gray-800" />{" "}
            </button>
            <div className="">
              <h1 className="text-3xl font-bold flex-nowrap text-gray-800">
                Interview History
              </h1>
              <p className="text-gray-500 mt-2">
                Track your past interviews and performance reports.
              </p>
            </div>
          </div>

          {/* mapping */}
          {interviews.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center flex flex-col gap-6 justify-center items-center">
              <p className="text-gray-600">
                No Interviews found. Start Your first interview.
              </p>
              <motion.button
                onClick={() => {
                  navigate("/new-interview");
                }}
                whileHover={{ opacity: 0.9, y: 1.03 }}
                whileTap={{ opacity: 1, y: 0.98 }}
                className="bg-black text-white px-10 py-3 rounded-full hover:opacity-70 transition shadow-md"
              >
                Start My First Interview
              </motion.button>
            </div>
          ) : (
            <div className="grid gap-6">
              {interviews.map((item, index) => (
                <div
                  onClick={() => navigate(`/interview-report/${item._id}`)}
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* left section */}
                    <div className="w-[80%]">
                      <h3 className="text-lg font-semibold text-gray-800 ">
                        {item.role}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {item.experience}
                        {" | "}
                        {item.mode}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* right section */}
                    <div className="flex items-center gap-6">
                      {/* score section */}
                      <div className="text-right flex flex-col justify-center items-center gap-1">
                        <p className="text-xl font-bold text-emerald-600">
                          {item.finalScore || 0}/10
                        </p>
                        <p className="text-xs text-gray-500">Overall Score</p>
                      </div>
                      {/* status section - completed or not */}
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-medium ${item.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterviewHistory;

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";
import { serverURL } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setUsersData } from "../redux/userSlice.js";

// onStart bas ek function hai jo parent component me jaake child component se props deta hai taaki abhi kis step par hai wo pta chalein.
const Step1SetUp = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // to store user input for our 4 input fields.
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);

  // for further uses;
  const [loading, setLoading] = useState(false);

  // jo cheezein hame AI response se milega while requesting to server.
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");

  // steps ka, resume analyzing me time lagegauske liye hai ye sab.
  const [analysisIsDone, setAnalysisIsDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // items for left side hard coded steps for taking interview.
  const listItem1 = [
    {
      icon: <FaUserTie className="text-green-600 text-xl " />,
      text: "Choose Role & Experience.",
    },
    {
      icon: <FaMicrophoneAlt className="text-green-600 text-xl " />,
      text: "Smart Voice Interview.",
    },
    {
      icon: <FaChartLine className="text-green-600 text-xl " />,
      text: "Performance Analytics.",
    },
  ];

  async function handleUploadResume() {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    // backend me multer resume naam ka formdata hi lega isiliye waha par upload.single("resume") karna padta hai.
console.log('before post request')
    try {
      const response = await axios.post(
        serverURL + "/api/interview/resume",
        formData,
        {
          withCredentials: true,
        },
      );
console.log('After post request')

      console.log(response.data);

      // bcz ye hame mil raha hai response me or hame isko frontend me dikhana ki info sahi nikal kar aayi hai.
      setRole(response.data.role || "");
      setExperience(response.data.experience || "");
      setProjects(response.data.projects || []);
      setSkills(response.data.skills || []);
      setResumeText(response.data.resumeText || "");

      setAnalysisIsDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleStart() {
    setLoading(true);
    try {
      const result = await axios.post(
        serverURL + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          resumeText,
          projects,
          skills,
        },
        { withCredentials: true },
      );

      console.log(result.data);

      if (userData) {
        dispatch(
          setUsersData({ ...userData, credit: result.data.creditsLeft }),
        );
      }

      setLoading(false);
      onStart(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center bg-linear-90 from-gray-100 to-green-200 px-4"
      >
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden my-8">
          {/* left side */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative bg-linear-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Start Your AI Interview
            </h2>

            <p className="text-gray-600 mb-10">
              Practice real interview scenarios powered by AI. Improve
              communication, technical skills and confidence.
            </p>

            <div className="space-y-5 ">
              {listItem1.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 + index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer"
                  key={index}
                >
                  {item.icon}
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* right side */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="p-12 bg-white"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Set-up for your Interview
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <FaUserTie className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Enter your role..."
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                />
              </div>
              <div className="relative">
                <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Enter your experience in years..."
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>

              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>

              {!analysisIsDone && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                >
                  <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />
                  <input
                    type="file"
                    accept="application/pdf"
                    id="resumeUpload"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />

                  <p className="text-gray-600 font-medium">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload resume (Optional)"}
                  </p>
                  {resumeFile && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadResume();
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="mt-4 bg-gray-900 text-white text-center w-full px-5 py-2 rounded-lg hover:bg-gray-800 transition font-medium cursor-pointer"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}

              {analysisIsDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 "
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Resume Analysis Result
                  </h3>

                  {/* Showing Projects */}
                  {projects.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        Projects:
                      </p>
                      <ul className="list-disc list-insdide text-gray-600 space-y-1 pl-5">
                        {projects.map((item, index) => (
                          <li key={index} className="">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Showing Skills */}
                  {skills.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((item, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.button
                disabled={!role || !experience || !analysisIsDone || loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md cursor-pointer"
                onClick={handleStart}
              >
                {loading ? "Starting...":"Start Interview"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Step1SetUp;

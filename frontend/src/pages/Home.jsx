import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthenticationModel from "../components/AuthenticationModel";
import botImage from "../assets/bot.png";
import img1 from "../assets/evaluation.jpg";
import img2 from "../assets/resume.jpg";
import img3 from "../assets/pdf_pages.jpg";
import img4 from "../assets/analytics.jpg";

import imga from "../assets/mode.jpg";
import imgb from "../assets/techMode.jpg";
import imgc from "../assets/confidence.jpg";
import imgd from "../assets/credits.jpg";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showAuthenticationModel, setShowAuthenticationModel] = useState(false);

  const serviceSteps = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP-1",
      title: "Role & Experience Selection",
      desc: "AI adjusts the difficulty levels based on selected job role.",
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP-2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP-3",
      title: "Timer based Simulation",
      desc: "Real Interview pressure with time tracking.",
    },
  ];

  const servicesStepsWithImage = [
    {
      image: img1,
      icon: <BsBarChart size={20} />,
      title: "AI Answer Evaluation",
      desc: "Scores communication, technical accuracy and confidence.",
    },
    {
      image: img2,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume Based Interview",
      desc: "Project-specific questions based on uploaded resume.",
    },
    {
      image: img3,
      icon: <BsFileEarmarkText size={20} />,
      title: "Downloadable PDF Report",
      desc: "Detailed strengths, weaknesses and improvement insights.",
    },
    {
      image: img4,
      icon: <BsBarChart size={20} />,
      title: "History & Analytics",
      desc: "Track progress with performance graphs and topic analysis.",
    },
  ];

  const typesOfModes = [
    {
      image: imga,
      title: "HR Interview Mode",
      desc: "Behavioral and communication based evaluation.",
    },
    {
      image: imgb,
      title: "Technical Interview Mode",
      desc: "Deep technical questioning based on selected role.",
    },
    {
      image: imgc,
      title: "Confidence Detection",
      desc: "Basic tone and voice analysis insights.",
    },
    {
      image: imgd,
      title: "Credits System",
      desc: "Unlock premium interview sessions easily.",
    },
  ];

  return (
    <>
      <div className="bg-[#f3f3f3] min-h-screen flex flex-col ">
        {/* <Navbar /> */}
        <div className="flex-1 px-6 py-20">
          <div className="mx-auto max-w-6xl ">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
                <HiSparkles size={20} className="bg-green-50 text-green-600 " />
                AI Powered Smart Interview Platform
              </div>
            </div>
            <div className="text-center mb-28">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto"
              >
                Do Your Preparations With Our
                <span className="relative inline-block">
                  <span className="bg-green-100 text-green-600 rounded-full px-5 py-1">
                    InterviewPilot.AI
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
              >
                Role-based mock interviews with smart follow-ups, adaptive
                difficulty and real-time performance evaluation.
              </motion.p>

              <div className="flex flex-wrap justify-center gap-4 mt-10 ">
                {/* New Interview */}
                <motion.button
                  onClick={() => {
                    if (!userData) {
                      setShowAuthenticationModel(true);
                      return;
                    }
                    navigate("/new-interview");
                  }}
                  whileHover={{ opacity: 0.9, y: 1.03 }}
                  whileTap={{ opacity: 1, y: 0.98 }}
                  className="bg-black text-white px-10 py-3 rounded-full hover:opacity-70 transition shadow-md"
                >
                  New Interview
                </motion.button>

                {/* History */}
                <div className="">
                  <motion.button
                    onClick={() => {
                      if (!userData) {
                        setShowAuthenticationModel(true);
                        return;
                      }
                      navigate("/history");
                    }}
                    whileHover={{ opacity: 0.9, y: 1.03 }}
                    whileTap={{ opacity: 1, y: 0.98 }}
                    className="border border-gray-300 px-10 bg-white py-3 rounded-full hover:bg-gray-100 transition"
                  >
                    See History
                  </motion.button>
                </div>
              </div>

              {/* 3 Features of our service */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28 mt-20">
                {serviceSteps.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 + index * 0.2 }}
                    whileHover={{ rotate: 0, y: 1.06 }}
                    key={index}
                    className={` relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl transition-all duration-300 
                    ${index === 0 ? "-rotate-4" : ""} 
                    ${index === 1 ? "rotate-3 md:mt-6 shadow-xl" : ""} 
                    ${index === 2 ? "-rotate-3" : ""} 
                    `}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ">
                      {item.icon}
                    </div>
                    <div className="pt-10 text-center">
                      <div className="text-xs text-green-600 font-semibold mb-2 tracking-wider">
                        {item.step}
                      </div>
                      <h3 className="font-semibold mb-3 text-lg ">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* showing features of our service */}
            <div className="mb-32">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-semibold text-center mb-16"
              >
                Advanced AI{" "}
                <span className="text-green-600">Capabilities</span>{" "}
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-10">
                {servicesStepsWithImage.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl transition-all p-6"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/2 flex justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-auto object-contain max-h-64 rounded-4xl"
                        />
                      </div>
                      <div className="w-full md:w-1/2 px-3 max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-center max-[500px]:items-center max-[500px]:pb-6">
                        <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 max-[500px]:-mt-4 max-[500px]:mb-2">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold mb-3 text-xl">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Showing interview modes */}
            <div className="mb-10">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-semibold text-center mb-16"
              >
                Multiple Interview{" "}
                <span className="text-green-600">Modes</span>{" "}
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-10">
                {typesOfModes.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl transition-all p-6"
                  >
                    <div className="flex justify-center items-center gap-6">
                      <div className="w-1/2">
                        <h3 className="font-semibold text-xl mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-28 h-28 object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* if not signedin ? then showing signup model/form */}
        {showAuthenticationModel && (
          <AuthenticationModel
            onclose={() => setShowAuthenticationModel(false)}
          />
        )}

        <Footer />
      </div>
    </>
  );
};

export default Home;

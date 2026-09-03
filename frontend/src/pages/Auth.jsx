import React from "react";
import { IoSparklesSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react";
import bot from "../assets/bot.png";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { serverURL } from "../App.jsx";
import { setUsersData } from "../redux/userSlice.js";
import { useDispatch } from "react-redux";

const Auth = ({ isModel = false }) => {
  const dispatch = useDispatch();

  async function handleAuthentication() {
    try {
      const userData = await signInWithPopup(auth, provider);
      console.log("User created successfully", userData);

      const name = userData?.user?.displayName;
      const email = userData?.user?.email;

      const userPosted = await axios.post(
        serverURL + "/api/auth/signup",
        { name, email },
        { withCredentials: true },
      );

      // credentials true karne se sensitive info like token, authorization, headers jaisi info ko exchange kar sakte hai (ye backend me bhi karna hota hai cors ke ander)
      console.log("credit included, UserPosted: ", userPosted.data);
      dispatch(setUsersData(userPosted.data.user));
    } catch (error) {
      console.log("Authentication Error : ", error);
      dispatch(setUsersData(null));
    }
  }

  return (
    <>
      <div
        className={`w-full ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20 "}`}
      >
        <motion.div
          transition={{ duration: 0.5 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full ${isModel ? "max-w-md p-8 rounded-3xl " : "max-w-lg p-12 rounded-lg"} bg-white shadow-2xl border border-gray-200 `}
        >
          <div className="flex justify-center items-center gap-3">
            <img className="size-6 p-0" src={bot} alt="icon_img" />
            <h2 className="font-semibold text-lg">InterviewPilot.AI</h2>
          </div>
          <div className="flex gap-1 justify-center items-center flex-col mt-4 text-[17px] font-semibold">
            <h1>Anywhere, Anytime</h1>
            <div className="flex gap-2 justify-center items-center bg-[#228be6] py-3 px-4 rounded-3xl text-white hover:text-[#228be6] hover:bg-black cursor-pointer">
              <IoSparklesSharp />
              <h1>AI Based Interview</h1>
            </div>
          </div>
          <div className=" text-gray-400">
            <p className="text-center mt-4">
              <span
                className="underline hover:text-[#1c7ed6] cursor-pointer font-semibold  text-gray-600"
                onClick={handleAuthentication}
              >
                Sign-in
              </span>{" "}
              <span>
                to start your{" "}
                <span className="text-[#228be6] font-bold">AI</span>-Interview
                journey now! Track your history, progress, performance &
                insights.{" "}
              </span>
            </p>
          </div>

          <motion.button
            onClick={handleAuthentication}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex gap-2 justify-center items-center py-3 px-4 bg-black rounded-2xl text-white w-full mt-6 text-[18px]"
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;

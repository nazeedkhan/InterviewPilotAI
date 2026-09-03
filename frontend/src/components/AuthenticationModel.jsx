import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Auth from "../pages/Auth";
import { FaTimes } from "react-icons/fa";
import { motion } from "motion/react";

const AuthenticationModel = ({ onclose }) => {
  const { userData } = useSelector((state) => state.user);

  //   if user exists already then no need to show the signin page/model.
  useEffect(() => {
    if (userData) {
      onclose();
      return;
    }
  }, [userData, onclose]);

  return (
    <>
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/20 backdrop-blue-sm px-4 backdrop-blur-[3px]">
        <div className="relative w-full max-w-md">
          <motion.button
            transition={{ duration: 2 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onclose}
            className="absolute top-8 right-5 text-gray-800 hover:text-black text-xl"
          >
            <FaTimes size={24} />
          </motion.button>
          <Auth isModel={true} />
        </div>
      </div>
    </>
  );
};

export default AuthenticationModel;

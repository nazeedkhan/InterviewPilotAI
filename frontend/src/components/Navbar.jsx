import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import bot from "../assets/bot.png";
import { BsRobot } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { RiCoinsFill } from "react-icons/ri";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverURL } from "../App";
import { setUsersData } from "../redux/userSlice";
import AuthenticationModel from "./AuthenticationModel";
import { IoHome } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  // console.log(location.pathname); // /new-interview || / || /history
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuthenticationModel, setShowAuthenticationModel] = useState(false);
  const { userData } = useSelector((state) => state.user);
  // console.log("Asli Data ye hai : ", userData);

  function handleCreditCorner() {
    if (!userData) {
      setShowAuthenticationModel(true);
      return;
    }
    setShowCreditPopup(!showCreditPopup);
    setShowUserPopup(false);
  }

  function handleProfileCorner() {
    if (!userData) {
      setShowAuthenticationModel(true);
      return;
    }
    setShowUserPopup(!showUserPopup);
    setShowCreditPopup(false);
  }

  async function handleLogout() {
    try {
      await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUsersData(null));
      setShowUserPopup(false);
      setShowCreditPopup(false);
      navigate("/");
    } catch (error) {
      console.log("Error inside navbar Logout : ", error);
    }
  }

  function handlePricingPage() {
    navigate("/pricing");
    setShowCreditPopup(false);
  }
  function handleHistoryPage() {
    navigate("/history");
    setShowUserPopup(false);
  }

  return (
    <>
      <div
        className={`flex justify-center px-4 pt-6 ${
          location.pathname === "/"
            ? "bg-[#f3f3f3]"
            : "bg-linear-90 from-gray-100 to-green-200"
        } `}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
        >
          <NavLink to={"/"} className="flex items-center gap-3 cursor-pointer">
            <img
              className="size-8 p-0"
              src={bot}
              alt="icon_img"
            />
            <h1 className="font-semibold hidden md:block text-lg">
              InterviewPilot.AI
            </h1>
          </NavLink>

          <div className="flex items-center gap-6 relative">
            {/* Credits Corner */}
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition"
                onClick={handleCreditCorner}
              >
                <RiCoinsFill className="text-yellow-500" size={28} />
                {userData?.credit || 0}
              </button>

              {showCreditPopup && (
                <div className="absolute -right-12.5 mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50">
                  <p className="text-sm text-gray-600 mb-4">
                    Need more credits to continue interviews?
                  </p>
                  <button
                    className="w-full bg-black text-white py-2 rounded-lg text-sm "
                    onClick={handlePricingPage}
                  >
                    Buy more credits
                  </button>
                </div>
              )}
            </div>

            {/* Profile Corner */}
            <div className="relative">
              <button
                className="w-9 h-9 bg-black text-white font-semibold rounded-full flex items-center justify-center"
                onClick={handleProfileCorner}
              >
                {userData ? (
                  userData?.name?.charAt(0).toUpperCase()
                ) : (
                  <FaUserAstronaut size={16} className="text-white" />
                )}
              </button>

              {showUserPopup && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50">
                  <p className="text-md text-blue-600 font-medium  mb-2 text-center">
                    {userData?.name}
                  </p>
                  <button
                    className="font-semibold w-full justify-center text-sm py-2 bg-black text-white rounded-md px-3 hover:bg-gray-600"
                    onClick={handleHistoryPage}
                  >
                    Interview History
                  </button>
                  <button
                    className="w-full text-white bg-red-500 px-3 font-semibold flex items-center justify-center text-sm py-2 gap-2 rounded-md mt-2 hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout size={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {showAuthenticationModel && (
          <AuthenticationModel
            onclose={() => setShowAuthenticationModel(false)}
          />
        )}
      </div>
    </>
  );
};

export default Navbar;

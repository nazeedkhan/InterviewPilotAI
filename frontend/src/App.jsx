import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUsersData } from "./redux/userSlice.js";
import Pricing from "./pages/Pricing.jsx";
import NewInterview from "./pages/NewInterview.jsx";
import Step2Interview from "./components/Step2Interview.jsx";
import Step3Report from "./components/Step3Report.jsx";
import InterviewHistory from "./pages/InterviewHistory.jsx";
import InterviewReport from "./pages/InterviewReport.jsx";
import Navbar from "./components/Navbar.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const serverURL = import.meta.env.VITE_SERVER_URL;

const App = () => {
  const dispatch = useDispatch();

  async function getUser() {
    try {
      const data = await axios.get(serverURL + "/api/auth/profile", {
        withCredentials: true,
      });

      // credentials true karne se sensitive info like token, authorization, headers jaisi info ko exchange kar sakte hai (ye backend me bhi karna hota hai cors ke ander)
      // console.log("Current User Data: ", data.data);

      dispatch(setUsersData(data.data));
    } catch (error) {
      console.log("Error in getting current user!", error);
      dispatch(setUsersData(null));
    }
  }

  useEffect(() => {
    // console.log("ok");
    getUser();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/new-interview" element={<NewInterview />} />
        <Route path="/history" element={<InterviewHistory />} />
        <Route path="/interview-report/:id" element={<InterviewReport />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;

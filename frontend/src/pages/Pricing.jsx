import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverURL } from "../App.jsx";
import { useDispatch } from "react-redux";
import { setUsersData } from "../redux/userSlice.js";
import { ToastContainer, toast } from "react-toastify";

const Pricing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const pricingPlans = [
    {
      id: "Free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparations.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Reports",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "Basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 200,
      description: "Great for focused practice and skill improvement.",
      features: [
        "200 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "Pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 1200,
      description: "Best value for serious job preparation.",
      features: [
        "1200 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analytics",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  async function handlePayment(plan) {
    setLoadingPlan(plan.id);

    try {
      const amount = plan.id === "Basic" ? 100 : plan.id === "Pro" ? 500 : 0;

      const result = await axios.post(
        serverURL + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );
      // console.log(result.data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewPilot.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async function (response) {
          console.log(response);
          const verifypay = await axios.post(
            serverURL + "/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true },
          );
          dispatch(setUsersData(verifypay.data.user));
          navigate("/");
          toast.success("Credits Added Successfully!");
        },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoadingPlan(null);
    } catch (error) {
      setLoadingPlan(null);
      console.log(error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-linear-90 from-gray-100 to-green-200 py-8 lg:px-10 sm:px-6 px-8">
        <div className="max-w-6xl mx-auto mb-14 flex items-start gap-4">
          <button
            className="mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div className="text-center w-full ">
            <h1 className="text-4xl font-bold text-gray-800">
              Choose Your Plan
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Flexible pricing to match your interview preparation goals.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const isSelected = selectedPlan === plan.id; // for every mapped element it gives true when current mapped element is the selected one.
            return (
              <motion.div
                key={plan.id}
                whileHover={!plan.default && { scale: 1.03 }}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative rounded-3xl p-8 transition-all duration-300 border ${isSelected ? "border-emerald-600 shadow-2xl bg-white" : "border-gray-200 bg-white shadow-md"} ${plan.default ? "cursor-default" : "cursor-pointer"}`}
              >
                {/* badge */}
                {plan.badge && (
                  <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow">
                    {plan.badge}
                  </div>
                )}

                {/* default tag */}
                {plan.default && (
                  <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                    Default
                  </div>
                )}

                {/* plan name */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mt-4">
                  <span className="text-3xl font-bold text-emerald-600 ">
                    {plan.price}
                  </span>
                  <p className="text-gray-500 mt-1">{plan.credits} Credits</p>
                </div>

                {/* description */}
                <div className="text-gray-500 mt-4 text-sm leading-relaxed ">
                  {plan.description}
                </div>

                {/* features */}
                <div className="mt-6 space-y-3 text-left">
                  {plan.features.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FaCheckCircle className="text-emerald-500 text-sm" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* button */}
                {!plan.default && (
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id);
                      } else {
                        handlePayment(plan);
                      }
                    }}
                    className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${isSelected ? "bg-emerald-600 text-white hover:opacity-90" : "bg-gray-100 text-gray-700 hover:bg-emerald-50"}`}
                  >
                    {loadingPlan === plan.id
                      ? "Processing"
                      : isSelected
                        ? "Proceed to Pay"
                        : "Select Plan"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Pricing;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthAPIs from "../../../api/auth";
import { getRouteForUserDashboard } from "../../../utils/auth";

const useForgotPassword = (opened) => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [email, otp, password, confirmPassword]);

  useEffect(() => {
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setStep(1);
  }, [opened]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmitStep1 = async () => {
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill all the required fields");
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
    } else if (password.length < 8) {
      setError("Password should be at least 8 characters");
    } else if (confirmPassword !== password) {
      setError("Passwords dont match");
    } else {
      const data = await AuthAPIs.forgotPassword(email, password);
      if (data.isError) setError(data.error);
      else {
        setStep(2);
      }
    }

    setLoading(false);
  };

  // const handleSubmitStep2 = async () => {
  //   setLoading(true);
  //   if (otp.length < 6) {
  //     setError("Please enter 6 digits");
  //   } else {
  //     const data = await AuthAPIs.verifyOTPForgotPassword(email, otp);
  //     if (data.isError) setError(data.error);
  //     else {
  //       localStorage.setItem("KGtoken2", data);
  //       const dashboardRoute = getRouteForUserDashboard(data);
  //       navigate(dashboardRoute);
  //     }
  //   }

  //   setLoading(false);
  // };

  const handleSubmitStep2 = async () => {
    setError("");
    if (otp.length < 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    const data = await AuthAPIs.verifyOTPForgotPassword(email, otp);
    if (data.isError) {
      setError(data.error);
    } else {
      localStorage.setItem("KGtoken2", data);
      const dashboardRoute = getRouteForUserDashboard(data);
      navigate(dashboardRoute);
    }

    setLoading(false);
  };

  return {
    step,

    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    otp,
    setOtp,

    loading,
    error,

    handleSubmitStep1,
    handleSubmitStep2,
  };
};

export default useForgotPassword;

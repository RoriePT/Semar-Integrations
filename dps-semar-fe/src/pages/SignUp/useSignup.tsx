import React, { useEffect, useState } from "react";
import AuthAPIs from "../../api/auth";
import { getRouteForUserDashboard } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [otp, setOtp] = useState<string | null>(null);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [
    email,
    firstName,
    lastName,
    otp,
    password,
    confirmPassword,
    referralCode,
  ]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleSubmitStep1 = async () => {
    setLoading(true);
    if (!email || !firstName || !lastName) {
      setError("Please fill all the required fields");
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
    } else {
      const data = await AuthAPIs.signup(email, firstName, lastName);
      if (data.isError) setError(data.error);
      else setCurrentStep(2);
    }

    setLoading(false);
  };

  // const handleSubmitStep2 = async () => {
  //   setLoading(true);
  //   if (otp.length < 6) {
  //     setError("Please enter 6 digits");
  //   } else {
  //     const data = await AuthAPIs.verifyOTP(email, otp);
  //     if (data.isError) setError(data.error);
  //     else setCurrentStep(3);
  //   }

  //   setLoading(false);
  // };
  const handleSubmitStep2 = async () => {
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP");

      return;
    }

    setLoading(true);

    const data = await AuthAPIs.verifyOTP(email, otp);
    if (data.isError) {
      setError(data.error);
    } else {
      setCurrentStep(3);
    }

    setLoading(false);
  };

  const handleSubmitStep3 = async () => {
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("Please fill all the required fields");
    } else if (password.length < 8) {
      setError("Password should be at least 8 characters");
    } else if (confirmPassword !== password) {
      setError("Passwords don't match");
    } else {
      const data = await AuthAPIs.registerUser(email, referralCode, password);
      if (data.isError) setError(data.error);
      else {
        localStorage.setItem("KGtoken2", data.token);
        const dashboardRoute = getRouteForUserDashboard(data.token);

        navigate(dashboardRoute);
      }
    }

    setLoading(false);
  };

  return {
    email,
    firstName,
    lastName,
    setEmail,
    setFirstName,
    setLastName,

    otp,
    setOtp,

    referralCode,
    password,
    confirmPassword,
    setReferralCode,
    setPassword,
    setConfirmPassword,

    currentStep,
    error,
    loading,

    handleSubmitStep1,
    handleSubmitStep2,
    handleSubmitStep3,
  };
};

export default useSignup;

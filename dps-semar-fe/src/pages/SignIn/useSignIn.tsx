import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import AuthAPIs from "../../api/auth";
import { getRouteForUserDashboard } from "../../utils/auth";

const useSignIn = () => {
  const validators = {
    email: (value) => {
      if (!value) {
        return "Email address is required";
      }
      // Basic email regex for validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email address";
      }
      return null;
    },

    password: (value) => {
      if (!value) {
        return "Password is required";
      }
      // Check for minimum length
      if (value.length < 8) {
        return "Password must be at least 8 characters long";
      }

      return null;
    },
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },

    validate: validators,
  });

  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [form.values]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const data = await AuthAPIs.signin(form.values.email, form.values.password);

    if (data.isError) {
      setError(data.error);
    } else {
      localStorage.setItem("KGtoken2", data);
      const dashboardRoute = getRouteForUserDashboard(data);
      navigate(dashboardRoute);
    }
    setLoading(false);
  };

  return { form, handleSubmit, error, loading };
};

export default useSignIn;

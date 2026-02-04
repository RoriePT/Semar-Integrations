import { Anchor, Container, Flex, Image, Paper } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import semarLogo from "../../assets/semar_logo.svg";
import Step1 from "./Components/Step1";
import Step2 from "./Components/Step2";
import Step3 from "./Components/Step3";
import styles from "./SignUp.module.css";
import useSignup from "./useSignup";

const SignUpForm: React.FC = () => {
  const {
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
  } = useSignup();

  return (
    <div className={styles.signInForm}>
      <Container className={styles.container}>
        <Image src={semarLogo} alt="logo" />

        <Paper
          className={styles.signInBox}
          p="xl"
          shadow="md"
          radius={"lg"}
          w={"100%"}
        >
          {currentStep === 1 && (
            <Step1
              email={email}
              firstName={firstName}
              lastName={lastName}
              setEmail={setEmail}
              setFirstName={setFirstName}
              setLastName={setLastName}
              error={error}
              loading={loading}
              handleSubmit={handleSubmitStep1}
            />
          )}
          {currentStep === 2 && (
            <Step2
              email={email}
              otp={otp}
              setOtp={setOtp}
              error={error}
              loading={loading}
              handleSubmit={handleSubmitStep2}
            />
          )}
          {currentStep === 3 && (
            <Step3
              referralCode={referralCode}
              password={password}
              confirmPassword={confirmPassword}
              setReferralCode={setReferralCode}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              error={error}
              loading={loading}
              handleSubmit={handleSubmitStep3}
            />
          )}

          <Flex
            justify="center"
            align={"center"}
            mt="xl"
            gap={"md"}
            className={styles.signInAnchors}
          >
            <Anchor component={Link} to="/about-us" c="#000">
              About Us
            </Anchor>
            |
            <Anchor component={Link} to="/terms-and-conditions" c="#000">
              Terms & Conditions
            </Anchor>
            |
            <Anchor component={Link} to="/privacy-policy" c="#000">
              Privacy Policy
            </Anchor>
          </Flex>
        </Paper>
      </Container>
    </div>
  );
};

export default SignUpForm;

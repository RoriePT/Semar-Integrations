import {
  Box,
  Button,
  Center,
  PasswordInput,
  PinInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import ModalLayout from "../../../components/ModalLayout";
import useForgotPassword from "./useForgotPassword";

const ForgotPassword = ({ opened, close }) => {
  const {
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
  } = useForgotPassword(opened);

  return (
    <ModalLayout
      opened={opened}
      close={close}
      header={
        <Title ta="center" order={3}>
          {step == 1 ? <>Forgot password</> : <>Verify OTP</>}
        </Title>
      }
      body={
        step === 1 ? (
          <>
            <TextInput
              label="Registered email"
              placeholder="Enter email address"
              description="Provide your registered email address"
              required
              withAsterisk={true}
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              description="Create a new password"
              required
              withAsterisk={true}
              size="lg"
              mt="md"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm new password"
              description="Re-enter your new password"
              required
              withAsterisk={true}
              size="lg"
              mt="md"
              mb="md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            <p style={{ color: "tomato", marginTop: "5px" }}>{error}</p>
          </>
        ) : (
          <>
            <Text ta="center" mb="lg">
              A 6 digit OTP has been sent to{" "}
              <Text component="span" c={"brand"}>
                {email}
              </Text>
            </Text>

            <Center>
              <Box>
                <Text ta={"center"} fw={600} mb={"xs"}>
                  Enter OTP
                </Text>
                <PinInput
                  size="lg"
                  w={"100%"}
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  visibleFrom="sm"
                />
                <PinInput
                  size="md"
                  w={"100%"}
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  hiddenFrom="sm"
                />
              </Box>
            </Center>
            <p
              style={{ color: "tomato", marginTop: "5px", textAlign: "center" }}
            >
              {error}
            </p>
          </>
        )
      }
      footer={
        step == 1 ? (
          <Button
            variant="filled"
            radius={"md"}
            fullWidth
            size="lg"
            onClick={handleSubmitStep1}
            loading={loading}
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="filled"
            radius={"md"}
            fullWidth
            mt="xs"
            size="lg"
            onClick={handleSubmitStep2}
            loading={loading}
          >
            Verify
          </Button>
        )
      }
    />
  );
};

export default ForgotPassword;

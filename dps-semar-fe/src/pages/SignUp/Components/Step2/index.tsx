import { Box, Button, Center, PinInput, Text, Title } from "@mantine/core";

const Step2 = ({
  email,
  otp,
  setOtp,

  error,
  loading,

  handleSubmit,
}) => {
  return (
    <>
      <Title ta="center" order={3}>
        Email Verification
      </Title>
      <Text ta="center" mb="xl">
        A 6 digit OTP has been sent to{" "}
        <Text component="span" c={"brand"}>
          {email}
        </Text>
      </Text>

      <form onSubmit={handleSubmit}>
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

        <p style={{ color: "tomato", textAlign: "center", marginTop: "5px" }}>
          {error}
        </p>

        <Button
          variant="filled"
          radius={"md"}
          fullWidth
          mt="xl"
          size="lg"
          loading={loading}
          onClick={handleSubmit}
        >
          Verify
        </Button>
      </form>
    </>
  );
};

export default Step2;

import { Flex, Loader, Paper, Text, Title } from "@mantine/core";

interface PaymentStatusDisplayProps {
  status: "PENDING" | "SUCCESS" | "FAILED" | "SUBMITTED";
}

export const PaymentStatusDisplay = ({ status }: PaymentStatusDisplayProps) => {
  const getStatusContent = () => {
    switch (status) {
      case "PENDING":
        return {
          title: "Verifying your payment. Please wait.",
          message: "Dont close this window until your payment is not verified.",
          showLoader: true,
        };

      case "SUCCESS":
        return {
          title: "Payment Successful",
          message: "Your payment has been successfully verified.",
          showLoader: false,
        };

      case "FAILED":
        return {
          title: "Payment Failure",
          message: "Your payment could not be verified.",
          showLoader: false,
        };

      case "SUBMITTED":
        return {
          title: "Payment Submitted Successfully!",
          message: "Your payment has been submitted and is being processed.",
          showLoader: false,
        };

      default:
        return {
          title: "Processing...",
          message: "Please wait while we process your payment.",
          showLoader: true,
        };
    }
  };

  const { title, message, showLoader } = getStatusContent();

  return (
    <Flex justify={"center"} h={"100dvh"}>
      <Paper
        style={{
          position: "relative",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e9ecef",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
        }}
        p={"lg"}
        id="kg-payment-page"
      >
        <Flex
          direction={"column"}
          justify={"center"}
          align={"center"}
          h={"100%"}
        >
          <Title order={4}>{title}</Title>
          <Text ta={"center"} size="sm" mb={"lg"}>
            {message}
          </Text>
          {showLoader && <Loader />}
        </Flex>
      </Paper>
    </Flex>
  );
};

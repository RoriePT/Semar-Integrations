import { Flex, Loader, Paper, Text, Title } from "@mantine/core";

interface LoadingStateProps {
  title?: string;
  message?: string;
}

export const LoadingState = ({ 
  title = "Verifying your payment. Please wait.", 
  message = "Dont close this window until your payment is not verified." 
}: LoadingStateProps) => {
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
          maxWidth: "500px",
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
          <Loader />
        </Flex>
      </Paper>
    </Flex>
  );
}; 
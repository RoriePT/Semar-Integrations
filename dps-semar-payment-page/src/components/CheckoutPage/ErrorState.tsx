import { Flex, Paper, Text, Title } from "@mantine/core";
import { MdErrorOutline } from "react-icons/md";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
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
          <MdErrorOutline size={"60px"} color="tomato" />
          <Title c={"red"}>Error</Title>
          <Text c={"red"}>{error}</Text>
        </Flex>
      </Paper>
    </Flex>
  );
};

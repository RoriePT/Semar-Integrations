import { Box, Flex, Text } from "@mantine/core";

interface PaymentAmountProps {
  amount: string;
}

export const PaymentAmount = ({ amount }: PaymentAmountProps) => {
  const displayAmount = amount || "0";

  return (
    <Box mb={"xl"}>
      <Flex direction={"column"} justify={"center"} align={"center"}>
        <Text size="sm" c={"#6c757d"} fw={500} mb={"md"}>
          Payment Amount
        </Text>
        <Box
          style={{
            border: "2px solid #A85706",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #f8f9fa 0%, #fef5eb 100%)",
            padding: "16px 24px",
            boxShadow: "0 4px 16px rgba(34, 139, 230, 0.1)",
          }}
        >
          <Text
            c={"#A85706"}
            fw={700}
            ta={"center"}
            style={{
              letterSpacing: "0.5px",
              fontSize: "28px",
              lineHeight: "1.2",
            }}
          >
            ₹ {displayAmount}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

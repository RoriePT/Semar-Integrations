import { Box, Flex, Text, Title } from "@mantine/core";
import { FaAngleRight } from "react-icons/fa6";

interface PaymentMethodCardProps {
  type: "upi" | "netbanking" | "e-wallet";
  name: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export const PaymentMethodCard = ({
  type,
  name,
  description,
  icon,
  onClick,
}: PaymentMethodCardProps) => {
  return (
    <Flex
      align={"center"}
      style={{
        borderRadius: "16px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid #e9ecef",
        boxShadow: "0 8px 25px rgba(34, 139, 230, 0.08)",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      p={"lg"}
      gap={"md"}
      w={"100%"}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 12px 35px rgba(34, 139, 230, 0.15)";
        e.currentTarget.style.border = "1px solid #A85706";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(34, 139, 230, 0.08)";
        e.currentTarget.style.border = "1px solid #e9ecef";
      }}
    >
      <Box
        w={"60px"}
        style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #e9ecef",
        }}
        h={"60px"}
      >
        <img
          src={icon}
          alt=""
          style={{ width: type === "upi" ? "45px" : "35px" }}
        />
      </Box>
      <Box style={{ flexGrow: 1 }}>
        <Title order={4} fw={600} c={"#2c3e50"} mb={4}>
          {name}
        </Title>
        <Text size="sm" c={"#6c757d"} fw={400}>
          {description}
        </Text>
      </Box>
      <FaAngleRight size={20} color="#A85706" />
    </Flex>
  );
};

import { Box, Divider, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

const SubBox = ({
  amount,
  subHeading,
  dividerLine = false,
  isForAmount = false,
}) => {
  const isTablet = useMediaQuery("(max-width: 990px)");
  return (
    <>
      <Box p="24">
        <Title
          order={4}
          style={{ fontSize: "32px", fontWeight: "600" }}
          c="#5C5F66"
        >
          {isForAmount ? `₹${amount}` : amount}
        </Title>
        <Text style={{ fontSize: "16px" }}>{subHeading}</Text>
      </Box>
      {!isTablet && dividerLine && <Divider />}
    </>
  );
};

export default SubBox;

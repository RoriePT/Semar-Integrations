import { Paper, Text, Title } from "@mantine/core";
import React from "react";

const MainBox = ({ amount, subHeading, isForAmount = false }) => {
  return (
    <Paper
      p={"24"}
      radius={"md"}
      h={"100%"}
      shadow="sm"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: "18px", color: "darkslategray" }}>
        {subHeading}
      </Text>

      <Title order={1} c="#5C5F66" style={{ fontSize: "40px" }}>
        {isForAmount ? `₹${amount}` : amount}
      </Title>
    </Paper>
  );
};

export default MainBox;

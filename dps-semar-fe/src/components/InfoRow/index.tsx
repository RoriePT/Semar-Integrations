import { Flex, Text, Title } from "@mantine/core";
import React from "react";

const InfoRow = ({ label, value }) => {
  return (
    <Flex gap={"xs"} style={{ wordBreak: "break-word" }}>
      <Title order={5}>{label}:</Title>
      <Text>{value || "Not provided"}</Text>
    </Flex>
  );
};

export default InfoRow;

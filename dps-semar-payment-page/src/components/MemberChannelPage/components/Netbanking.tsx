import React from "react";

import {
  Box,
  Button,
  CopyButton,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IoCopyOutline } from "react-icons/io5";

const Netbanking = ({
  amount,
  beneficiaryName,
  bankName,
  accountNumber,
  ifsc,
}) => {
  return (
    <>
      <Paper p="sm">
        <Box ta={"center"}>
          <Title order={4}>Payment Amount</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Transfer this amount only
          </Text>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#646464",
            }}
          >
            ₹{amount}
          </div>
          <CopyButton value={amount} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xl"}
              >
                {copied ? "Amount Copied" : "Copy Amount"}
              </Button>
            )}
          </CopyButton>
        </Box>
      </Paper>

      <Paper p="sm" mt={"sm"}>
        <Box ta={"center"}>
          <Title order={4}>Pay via Netbanking</Title>
          <Text size="xs" c={"gray"} mb={"sm"}>
            Make payment to the below details on your netbanking app
          </Text>
        </Box>

        <Flex align={"center"} justify={"space-between"} mt={"lg"}>
          <Box>
            <Title order={5}>Beneficiary name</Title>

            <Text size="lg">{beneficiaryName}</Text>
          </Box>
          <CopyButton value={beneficiaryName} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xl"}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
        <Divider my={"xs"} />

        <Flex align={"center"} justify={"space-between"}>
          <Box>
            <Title order={5}>Account number</Title>

            <Text size="lg">{accountNumber}</Text>
          </Box>
          <CopyButton value={accountNumber} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xl"}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
        <Divider my={"xs"} />

        <Flex align={"center"} justify={"space-between"}>
          <Box>
            <Title order={5}>Bank IFSC</Title>

            <Text size="lg">{ifsc}</Text>
          </Box>
          <CopyButton value={ifsc} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xl"}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
        <Divider my={"xs"} />

        <Flex align={"center"} justify={"space-between"}>
          <Box>
            <Title order={5}>Bank Name</Title>

            <Text size="lg">{bankName}</Text>
          </Box>
          <CopyButton value={bankName} timeout={10000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={<IoCopyOutline />}
                mt={"sm"}
                variant="light"
                size="xs"
                radius={"xl"}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        </Flex>
      </Paper>
    </>
  );
};

export default Netbanking;

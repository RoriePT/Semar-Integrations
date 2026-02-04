import {
  Box,
  Center,
  Divider,
  Flex,
  Modal,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import PayinStatusBadge from "../Badges/PayinStatusBadge";
import { OrderStatuses } from "../Texts/Withdrawal";
import WithdrawalsBadge from "../Badges/WithdrawalsBadge";

const WithdrawalStatusInfoModal = ({ opened, close }) => {
  const [value, setValue] = useState("pending");

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Withdrawal Order Status Details"
    >
      <Tabs value={value} onChange={(v) => setValue(v)}>
        <Center>
          <Tabs.List ta={"center"}>
            <Tabs.Tab style={{ fontSize: "12px" }} value="pending">
              Pending
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="complete">
              Complete
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="rejected">
              Rejected
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="failed">
              Failed
            </Tabs.Tab>
          </Tabs.List>
        </Center>

        {["pending", "complete", "rejected", "failed"].map((status) => {
          if (status === "complete")
            return (
              <Tabs.Panel value={status}>
                <Box ta={"center"} mt={"lg"}>
                  <WithdrawalsBadge status={status} size={"xl"} />
                  <Text mt={"lg"} ta={"left"} c={"lightslategray"} fw={500}>
                    {OrderStatuses[value].member}
                  </Text>
                  <Divider my={"md"} label="OR" />
                  <Text mt={"lg"} ta={"left"} c={"lightslategray"} fw={500}>
                    {OrderStatuses[status].gateway}
                  </Text>
                </Box>
              </Tabs.Panel>
            );
          else
            return (
              <Tabs.Panel value={status}>
                <Box ta={"center"} mt={"lg"}>
                  <WithdrawalsBadge status={status} size={"xl"} />
                  <Text mt={"lg"} ta={"left"} c={"lightslategray"} fw={500}>
                    {OrderStatuses[status]}
                  </Text>
                </Box>
              </Tabs.Panel>
            );
        })}
      </Tabs>
    </Modal>
  );
};

export default WithdrawalStatusInfoModal;

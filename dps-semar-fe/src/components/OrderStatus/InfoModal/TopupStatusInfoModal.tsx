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
import { OrderStatuses } from "../Texts/Payin";

const TopupStatusInfoModal = ({ opened, close }) => {
  const [value, setValue] = useState("initiated");

  return (
    <Modal opened={opened} onClose={close} title="Payin Order Status Details">
      <Tabs value={value} onChange={(v) => setValue(v)}>
        <Center>
          <Tabs.List ta={"center"}>
            <Tabs.Tab style={{ fontSize: "12px" }} value="initiated">
              Initiated
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="assigned">
              Assigned
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="submitted">
              Submitted
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="complete">
              Complete
            </Tabs.Tab>
            <Tabs.Tab style={{ fontSize: "12px" }} value="failed">
              Failed
            </Tabs.Tab>
          </Tabs.List>
        </Center>

        {["initiated", "assigned", "submitted", "complete", "failed"].map(
          (status) => {
            return (
              <Tabs.Panel value={status}>
                <Box ta={"center"} mt={"lg"}>
                  <PayinStatusBadge status={status} size={"xl"} />
                  <Text mt={"lg"} ta={"left"} c={"lightslategray"} fw={500}>
                    {OrderStatuses[status]}
                  </Text>
                </Box>
              </Tabs.Panel>
            );
          }
        )}
      </Tabs>
    </Modal>
  );
};

export default TopupStatusInfoModal;

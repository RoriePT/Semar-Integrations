import {
  Accordion,
  Box,
  Button,
  Flex,
  Loader,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";
import BalancesAndProfits from "./components/BalancesAndProfits";

import ModalLayout from "../../../ModalLayout";
import PayoutOrders from "../../../../api/payoutOrders";
import ChangePaymentStatus from "../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";
import { useDashboardUser } from "../../../../pages/Dashboard/DashboardProvider";

const AdminPayout = ({ opened, close, orderId, triggerReload, handlers }) => {
  const [details, setDetails] = useState(null);
  const { userData } = useDashboardUser();

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await PayoutOrders.getOnePayoutOrderDetails(
        "admin",
        orderId
      );
      if (data?.data) setDetails(data.data);
    };
    fetchData();
  }, [orderId]);

  const handlePaymentStatus = async (id, status) => {
    const res = await ChangePaymentStatus.changePaymentStatus({ status, id });
    if (res) {
      notifications.show({
        title: "success",
        message: `Payment status changed to ${status} successfully.`,
        color: "green",
        withCloseButton: true,
      });
      handlers.close();
      triggerReload();
    } else {
      notifications.show({
        title: "Failed",
        message: "Something went worng.",
        color: "red",
        withCloseButton: true,
      });
      handlers.close();
    }
  };

  return (
    <ModalLayout
      opened={opened}
      close={close}
      fullHeight
      size="lg"
      header={<Title order={4}>Payout Details</Title>}
      body={
        details ? (
          <>
            <MainDetails
              systemOrderId={details.systemOrderId}
              merchantOrderId={details.merchantOredrId || "N/A"}
              amount={details.amount}
              status={details.status}
              channel={details.channel}
              isMember={details.payoutMadeVia}
            />

            <Accordion defaultValue="1" variant="separated">
              <Accordion.Item key={"1"} value={"1"}>
                <Accordion.Control>General Details</Accordion.Control>
                <Accordion.Panel>
                  <GeneralDetails
                    payoutMadeVia={details.payoutMadeVia}
                    userName={details.user.name}
                    userEmail={details.user?.email || ""}
                    userMobile={details.user?.mobile || ""}
                    merchant={details.merchant}
                    member={details.member}
                    gateway={details.gatewayName}
                    createdOn={details.createdAt}
                    updatedOn={details.updatedAt}
                    status={details.status}
                    notificationStatus={details.notificationStatus}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item key={"1"} value={"2"}>
                <Accordion.Control>Transaction Details</Accordion.Control>
                <Accordion.Panel>
                  <Text fw={600} size="md">
                    Gateway Error:{" "}
                    {details.transactionDetails?.gatewayError || "None"}
                  </Text>

                  {details.status === "assigned" ||
                  details.status === "initiated" ? (
                    <Box>
                      <Text fw={600} size="sm">
                        Recipient channel details:{" "}
                      </Text>
                      {details.transactionDetails?.recipient &&
                        Object.keys(
                          details.transactionDetails?.recipient[details.channel]
                        ).map((key) => {
                          const value =
                            details.transactionDetails?.recipient[
                              details.channel
                            ][key];

                          return (
                            <Box key={key}>
                              <Flex gap={"4px"}>
                                <Text fw={500} size="xs">
                                  {key}:
                                </Text>
                                <Text size="xs">{value}</Text>
                              </Flex>
                            </Box>
                          );
                        })}
                    </Box>
                  ) : (
                    <TransactionDetails
                      id={details.transactionDetails?.transactionId}
                      receipt={details.transactionDetails?.receipt}
                      memberChannelDetails={details.transactionDetails?.member}
                      payinMadeOn={details.payoutMadeVia}
                      gatewayDetails={details.transactionDetails?.gateway}
                      recipientChannelDetails={
                        details.transactionDetails?.recipient
                      }
                      channel={details.channel}
                    />
                  )}
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item key={"1"} value={"3"}>
                <Accordion.Control>Balances and Commissions</Accordion.Control>
                <Accordion.Panel>
                  {!details.balancesAndProfit ? (
                    <Flex h={"30px"} align={"center"} justify={"center"}>
                      <Text c={"dimmed"}>Not available</Text>
                    </Flex>
                  ) : (
                    <BalancesAndProfits
                      status={details.status}
                      data={details.balancesAndProfit}
                    />
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </>
        ) : (
          <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
            <Loader />
          </Flex>
        )
      }
      footer={
        userData.permissionVerifyOrders &&
        details?.status === "submitted" &&
        details?.payoutMadeVia === "MEMBER" ? (
          <Flex justify={"flex-end"} gap={"md"}>
            <Button
              bg={"red"}
              onClick={() =>
                handlePaymentStatus(details.systemOrderId, "failed")
              }
            >
              Reject
            </Button>
            <Button
              bg={"green"}
              onClick={() =>
                handlePaymentStatus(details.systemOrderId, "complete")
              }
            >
              Approve
            </Button>
          </Flex>
        ) : (
          <></>
        )
      }
    />
  );
};

export default AdminPayout;

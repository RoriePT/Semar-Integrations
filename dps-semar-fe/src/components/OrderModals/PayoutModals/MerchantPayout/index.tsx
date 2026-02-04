import { Accordion, Box, Flex, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";

import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";

import ModalLayout from "../../../ModalLayout";
import PayoutOrders from "../../../../api/payoutOrders";

const MerchantPayout = ({
  opened,
  close,
  orderId,
  triggerReload,
  handlers,
}) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await PayoutOrders.getOnePayoutOrderDetails(
        "merchant",
        orderId
      );
      if (data?.data) {
        setDetails(data.data);
      }
    };
    fetchData();
  }, [orderId]);

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
              merchantOrderId={details.merchantOrderId || "N/A"}
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
                    balanceDeducted={details.balanceDetails.balanceDeducted}
                    serviceFee={details.balanceDetails.serviceFee}
                    serviceRate={details.balanceDetails.serviceRate}
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

                  {details.status == "assigned" ||
                  details.status === "initiated" ? (
                    <Box>
                      <Text fw={600} size="sm">
                        Recipient channel details:{" "}
                      </Text>
                      {details.channelDetails &&
                        Object.keys(
                          details.channelDetails[details.channel]
                        ).map((key) => {
                          const value =
                            details.channelDetails[details.channel][key];

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
                      recipientChannelDetails={details.channelDetails}
                      channel={details.channel}
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
      footer={null}
    />
  );
};

export default MerchantPayout;

import { Accordion, Flex, Loader, Modal, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";

import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";

import ModalLayout from "../../../ModalLayout";
import { getPayinOrderDetailsForMerchant } from "../../../../api/DummyOrders/OrderDetails";
import OrderAPIs from "../../../../api/order";

const MerchantPayin = ({ opened, close, orderId }) => {
  const [details, setDetails] = useState(null);

  const fetchOrderDetails = async () => {
    const data = await OrderAPIs.getOrderDetails("/payin/merchant", orderId);
    if (data) {
      setDetails(data);
    } else {
      const data = getPayinOrderDetailsForMerchant(orderId);
      setDetails(data);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  return (
    <ModalLayout
      opened={opened}
      close={close}
      fullHeight
      size="lg"
      header={<Title order={4}>Payin Details</Title>}
      body={
        details ? (
          <>
            <MainDetails
              systemOrderId={details.systemOrderId}
              merchantOrderId={details.merchantOrderId}
              amount={details.amount}
              status={details.status}
              channel={details.channel}
              isMember={details.payinMadeOn === "member"}
            />

            <Accordion defaultValue="1" variant="separated">
              <Accordion.Item key={"1"} value={"1"}>
                <Accordion.Control>General Details</Accordion.Control>
                <Accordion.Panel>
                  <GeneralDetails
                    payinMadeOn={details.payinMadeOn}
                    userName={details.user.name}
                    userEmail={details.user?.email || ""}
                    userMobile={details.user?.mobile || ""}
                    merchant={details.merchant}
                    member={details.member}
                    gateway={details.gatewayName}
                    createdOn={details.createdAt}
                    updatedOn={details.updatedAt}
                    status={details.status}
                    callbackStatus={details.callbackStatus}
                    balanceEarned={details.balanceDetails.balanceEarned}
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

                  {details.status === "assigned" ||
                  details.status === "initiated" ? (
                    <Flex h={"30px"} align={"center"} justify={"center"}>
                      <Text c={"dimmed"}>Not available</Text>
                    </Flex>
                  ) : (
                    <TransactionDetails
                      id={details.transactionDetails.transactionId}
                      memberChannelDetails={details.transactionDetails.member}
                      payinMadeOn={details.payinMadeOn}
                      gatewayDetails={details.transactionDetails.gateway}
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

export default MerchantPayin;

import {
  Accordion,
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

import ModalLayout from "../../../ModalLayout";
import OrderAPIs from "../../../../api/order";
import { getPayinOrderDetailsForMember } from "../../../../api/DummyOrders/OrderDetails";
import { notifications } from "@mantine/notifications";

const MemberPayin = ({ opened, close, orderId, reload }) => {
  const [details, setDetails] = useState(null);

  const fetchOrderDetails = async () => {
    const data = await OrderAPIs.getOrderDetails("/payin/member", orderId);
    if (data) {
      setDetails(data);
    } else {
      const data = getPayinOrderDetailsForMember(orderId);
      setDetails(data);
    }
  };

  const handleReject = async () => {
    try {
      const update = await OrderAPIs.rejectOrderForMember(
        details.systemOrderId
      );
      if (update)
        notifications.show({
          title: "Success",
          message: "Order rejected successfully!",
          color: "green",
        });
    } catch (e) {
      console.log(e);
    }
    close();
    reload();
  };

  const handleApprove = async () => {
    try {
      const update = await OrderAPIs.approveOrderForMember(
        details.systemOrderId
      );
      if (update)
        notifications.show({
          title: "Success",
          message: "Order approved successfully!",
          color: "green",
        });
    } catch (e) {
      console.log(e);
    }
    close();
    reload();
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
                    userName={details.user.name}
                    userEmail={details.user?.email || ""}
                    userMobile={details.user?.mobile || ""}
                    createdOn={details.createdAt}
                    updatedOn={details.updatedAt}
                    status={details.status}
                    quotaDeducted={details.quotaDetails.quotaDeducted}
                    commissionFee={details.quotaDetails.commissionAmount}
                    commissionRate={details.quotaDetails.commissionRate}
                    withHeldAmount={details.quotaDetails.withHeldAmount}
                    withHeldRate={details.quotaDetails.withHeldRate}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item key={"1"} value={"2"}>
                <Accordion.Control>Transaction Details</Accordion.Control>
                <Accordion.Panel>
                  {details.status === "assigned" ||
                  details.status === "initiated" ? (
                    <Flex h={"30px"} align={"center"} justify={"center"}>
                      <Text c={"dimmed"}>Not available</Text>
                    </Flex>
                  ) : (
                    <TransactionDetails
                      id={details.transactionDetails.transactionId}
                      memberChannelDetails={details.transactionDetails.member}
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
        details?.status === "submitted" ? (
          <Flex justify={"flex-end"} gap={"md"}>
            <Button bg={"red"} onClick={handleReject}>
              Reject
            </Button>
            <Button bg={"green"} onClick={handleApprove}>
              Approve
            </Button>
          </Flex>
        ) : null
      }
    />
  );
};

export default MemberPayin;

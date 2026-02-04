import {
  Accordion,
  Button,
  Divider,
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
import RecipientChannel from "./components/RecipientChannel";
import PayoutOrders from "../../../../api/payoutOrders";
import ChangePaymentStatus from "../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";
import { uploadReceipt } from "../../../../api/uploadTos3";

const MemberPayout = ({ opened, close, orderId, triggerReload, handlers }) => {
  const [details, setDetails] = useState(null);
  const [transactionProof, setTransactionProof] = useState({
    transactionId: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmitTransactionProof = async (id, file) => {
    if (!id || !file) return;
    setLoading(true);
    const fileId = await uploadReceipt(file, id);

    const res = await ChangePaymentStatus.changePaymentStatus({
      status: "submitted",
      id: details.systemOrderId,
      transactionId: transactionProof.transactionId,
      transactionReceipt: fileId,
    });

    setLoading(false);

    if (res) {
      triggerReload();
      notifications.show({
        title: "Success",
        message: "Submitted successfully.",
        color: "green",
        withCloseButton: true,
      });
      handlers.close();
    } else {
      notifications.show({
        title: "Failed",
        message: "failed",
        color: "red",
        withCloseButton: true,
      });
      handlers.close();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await PayoutOrders.getOnePayoutOrderDetails(
        "member",
        orderId
      );

      if (data?.data) setDetails(data.data);
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
              merchantOrderId={details.merchantOrderId}
              amount={details.amount}
              status={details.status}
              channel={details.channel}
              quotaEarned={details?.quotaDetails?.quotaEarned}
              commissionFee={details?.quotaDetails?.commissionAmount}
              commissionRate={details?.quotaDetails?.commissionRate}
              isMember={details.payoutMadeVia}
            />

            <Divider my={"xs"} />

            {details.status === "assigned" && (
              <>
                <RecipientChannel
                  channel={details.channel}
                  paymentDetails={details?.transactionDetails?.recipient}
                  transactionProof={transactionProof}
                  setTransactionProof={setTransactionProof}
                />
              </>
            )}

            <Accordion
              defaultValue={details.status === "assigned" ? "" : "1"}
              variant="separated"
            >
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
                  />
                </Accordion.Panel>
              </Accordion.Item>
              {!(
                details.status === "assigned" || details.status === "initiated"
              ) && (
                <Accordion.Item key={"1"} value={"2"}>
                  <Accordion.Control>Transaction Details</Accordion.Control>
                  <Accordion.Panel>
                    <TransactionDetails
                      id={details.transactionDetails?.transactionId}
                      receipt={details.transactionDetails?.receipt}
                      recipientChannelDetails={
                        details.transactionDetails?.recipient
                      }
                      channel={details.channel}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              )}
            </Accordion>
          </>
        ) : (
          <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
            <Loader />
          </Flex>
        )
      }
      footer={
        details?.status === "assigned" ? (
          <Flex justify={"space-between"} align={"center"}>
            <Text c={"gray.6"}>
              Enter the Transaction Id and Receipt to submit
            </Text>
            <Button
              loading={loading}
              onClick={() =>
                handleSubmitTransactionProof(
                  transactionProof.transactionId,
                  transactionProof.file
                )
              }
            >
              Submit Payment
            </Button>
          </Flex>
        ) : undefined
      }
    />
  );
};

export default MemberPayout;

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

import ModalLayout from "../../../ModalLayout";
import RecipientChannel from "./components/RecipientChannel";
import {
  getPayoutOrderDetailsForMember,
  getTopupOrderDetailsForMember,
} from "../../../../api/DummyOrders/OrderDetails";
import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";
import { TopupOrders } from "../../../../api/topupOrders";
import { uploadReceipt } from "../../../../api/uploadTos3";
import ChangePaymentStatus from "../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";

const MemberTopUp = ({ opened, close, orderId, handlers, triggerReload }) => {
  const [details, setDetails] = useState(null);
  const [loader, setLoader] = useState(false);
  const [transactionProof, setTransactionProof] = useState({
    transactionId: "",
    file: null,
  });

  const handleSubmitTransactionProof = async (id, file) => {
    if (!id || !file) return;
    setLoader(true);
    const fileId = await uploadReceipt(file, id);

    const res = await ChangePaymentStatus.changePaymentStatus({
      status: "submitted",
      id: details.systemOrderId,
      transactionId: transactionProof.transactionId,
      transactionReceipt: fileId,
      paymentType: "topup",
    });
    setLoader(false);

    if (res)
      notifications.show({
        title: "Success",
        message: "Submitted successfully.",
        color: "green",
        withCloseButton: true,
      });
    else
      notifications.show({
        title: "Failed",
        message: "failed",
        color: "red",
        withCloseButton: true,
      });

    triggerReload();
    handlers.close();
  };

  useEffect(() => {
    const fetchData = async () => {
      const details = await TopupOrders.getOneTopupOrderDetails(
        "member",
        orderId
      );
      if (details?.data) {
        setDetails(details.data);
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
      header={<Title order={4}>Topup Details</Title>}
      body={
        details ? (
          <>
            <MainDetails
              systemOrderId={details.systemOrderId}
              amount={details.amount}
              status={details.status}
              channel={details.channel}
              quotaEarned={details.quotaDetails?.quotaEarned}
              commissionFee={details.quotaDetails?.commissionAmount}
              commissionRate={details.quotaDetails?.commissionRate}
            />

            <Divider my={"xs"} />

            {details.status === "assigned" && (
              <>
                <RecipientChannel
                  channel={details.channel}
                  paymentDetails={details.transactionDetails.channelDetails}
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
              loading={loader}
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

export default MemberTopUp;

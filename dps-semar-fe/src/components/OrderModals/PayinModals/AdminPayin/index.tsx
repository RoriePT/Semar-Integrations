import { Accordion, Alert, Flex, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";
import BalancesAndProfits from "./components/BalancesAndProfits";

import ModalLayout from "../../../ModalLayout";
import OrderAPIs from "../../../../api/order";
import { getPayinOrderDetailsForAdmin } from "../../../../api/DummyOrders/OrderDetails";

const AdminPayin = ({ opened, close, orderId }) => {
  const [details, setDetails] = useState(null);

  const fetchOrderDetails = async () => {
    const data = await OrderAPIs.getOrderDetails("/payin/admin", orderId);
    if (data) {
      setDetails(data);
    } else {
      const data = getPayinOrderDetailsForAdmin(orderId);
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
              isMember={details.payinMadeOn === "member"}
              channel={details.channel}
            />

            {details.hasUtrMismatch && (
              <Alert
                icon={<FaExclamationTriangle size="1rem" />}
                title="UTR Mismatched"
                color="orange"
                mb="md"
              >
                <Text size="sm">
                  {details.status?.toLowerCase() === "complete" || details.status?.toLowerCase() === "failed" ? (
                    "At least one mismatch detected but now the order status is updated."
                  ) : (
                    "You can mark this order as failed or completed. Once the status is updated, it cannot be reverted."
                  )}
                </Text>
              </Alert>
            )}

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
                    upiVendor={details.transactionDetails?.upiVendor || details.upiVendor}
                    createdOn={details.createdAt}
                    updatedOn={details.updatedAt}
                    status={details.status}
                    callbackStatus={details.callbackStatus}
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
                      upiVendorDetails={details.transactionDetails?.upiVendor || details.upiVendor}
                      trackingId={details.transactionDetails?.trackingId || details.trackingId}
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
      footer={undefined}
    />
  );
};

export default AdminPayin;

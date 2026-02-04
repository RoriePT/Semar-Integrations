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

import ModalLayout from "../../../ModalLayout";
import {
  getPayoutOrderDetailsForAdmin,
  getTopupOrderDetailsForAdmin,
} from "../../../../api/DummyOrders/OrderDetails";
import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";
import BalancesAndProfits from "./components/BalancesAndProfits";
import { TopupOrders } from "../../../../api/topupOrders";
import ChangePaymentStatus from "../../../../api/updatePaymentStatus";
import { notifications } from "@mantine/notifications";
import { useDashboardUser } from "../../../../pages/Dashboard/DashboardProvider";

const AdminTopUp = ({
  opened,
  close,
  orderId,
  handlers,
  triggerReload,
  handleReload = () => {},
}) => {
  const [details, setDetails] = useState(null);
  const { userData } = useDashboardUser();

  useEffect(() => {
    const fetchData = async () => {
      const details = await TopupOrders.getOneTopupOrderDetails(
        "admin",
        orderId
      );

      if (details) {
        setDetails(details.data);
      }
    };

    fetchData();
  }, [orderId]);

  const handlePaymentStatus = async (id, status) => {
    const res = await ChangePaymentStatus.changePaymentStatus({
      status,
      id,
      paymentType: "topup",
    });

    if (res)
      notifications.show({
        title: "success",
        message: `Payment status changed to ${status} successfully.`,
        color: "green",
        withCloseButton: true,
      });
    else
      notifications.show({
        title: "Failed",
        message: "Something went worng.",
        color: "red",
        withCloseButton: true,
      });

    handlers.close();
    triggerReload();
    handleReload();
  };

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
            />

            <Accordion defaultValue="1" variant="separated">
              <Accordion.Item key={"1"} value={"1"}>
                <Accordion.Control>General Details</Accordion.Control>
                <Accordion.Panel>
                  <GeneralDetails
                    member={details.member}
                    createdOn={details.createdAt}
                    updatedOn={details.updatedAt}
                    status={details.status}
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
                      receipt={details.transactionDetails.receipt}
                      memberChannelDetails={details.transactionDetails.member}
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
        userData.permissionVerifyOrders && details?.status === "submitted" ? (
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

export default AdminTopUp;

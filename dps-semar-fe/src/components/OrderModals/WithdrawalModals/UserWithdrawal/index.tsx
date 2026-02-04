import { Accordion, Divider, Flex, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";

import ModalLayout from "../../../ModalLayout";
import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";
import WithdrawalOrderAPIs from "../../../../api/withdrawalOrders";

const UserWithdrawal = ({ opened, close, orderId, user }) => {
  const [details, setDetails] = useState(null);

  const fetchOrderDetails = async () => {
    const res = await WithdrawalOrderAPIs.getOrderDetails(
      `withdrawal/${user}`,
      orderId
    );
    if (res) setDetails(res);
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
      header={<Title order={4}>Withdrawal Details</Title>}
      body={
        details ? (
          <>
            <MainDetails
              systemOrderId={details.systemOrderId}
              amount={details.amount}
              status={details.status}
              channel={details.channel}
              serviceCharge={details.serviceCharge}
              balanceDeducted={details.balanceDeducted}
              isByAdmin={
                details.status === "complete" &&
                details.withdrawalMadeOn !== "gateway"
              }
            />

            <Divider my={"xs"} />

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
                    channelDetails={details.userChannel}
                    withdrawalMadeOn={details.withdrawalMadeOn}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item key={"1"} value={"2"}>
                <Accordion.Control>Transaction Details</Accordion.Control>
                <Accordion.Panel>
                  {!details.transactionId ? (
                    <Flex h={"30px"} align={"center"} justify={"center"}>
                      <Text c={"dimmed"}>Not available</Text>
                    </Flex>
                  ) : (
                    <TransactionDetails
                      id={details.transactionId}
                      receipt={details.transactionReceipt}
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

export default UserWithdrawal;

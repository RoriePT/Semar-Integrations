import {
  Accordion,
  Button,
  Flex,
  Loader,
  Popover,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

import ModalLayout from "../../../ModalLayout";

import MainDetails from "./components/MainDetails";
import GeneralDetails from "./components/GeneralDetails";
import TransactionDetails from "./components/TransactionDetails";
import BalancesAndProfits from "./components/BalancesAndProfits";
import RecipientChannel from "./components/RecipientChannel";
import WithdrawalOrderAPIs from "../../../../api/withdrawalOrders";
import CommonAPIs from "../../../../api/common";
import { notifications } from "@mantine/notifications";

const AdminWithdrawal = ({ opened, close, orderId, reload }) => {
  const [isForProcess, setIsSetForProcess] = useState(false);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    transactionId: "",
    transactionReceipt: File,
  });

  const fetchOrderDetails = async () => {
    const data = await WithdrawalOrderAPIs.getOrderDetails(
      "withdrawal/admin",
      orderId
    );
    if (data) setDetails(data);
  };

  const handleProcessWithdrawal = async (paymentMethod: string) => {
    if (paymentMethod === "ADMIN") setIsSetForProcess(true);
    if (paymentMethod === "GATEWAY") {
      setLoading(true);
      const res = await WithdrawalOrderAPIs.processGatewayWithdrawal({
        orderId,
        userId: 1,
      });
      if (res)
        notifications.show({
          title: "Success",
          message: "Withdrawal order successfully completed!",
          color: "green",
        });
      reload();
      close();
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !transactionDetails.transactionId ||
      !transactionDetails.transactionReceipt
    ) {
      setError("Transaction ID and receipt/screenshot required!");
      return;
    }

    setLoading(true);
    const uploadFile = await CommonAPIs.uploadFile(
      transactionDetails.transactionReceipt,
      orderId
    );
    if (!uploadFile) {
      setError("Failed to upload file!");
      setLoading(false);
      return;
    }

    const payload = {
      withdrawalMadeOn: "ADMIN",
      id: orderId,
      transactionId: transactionDetails.transactionId,
      transactionReceipt: uploadFile?.key,
    };

    const res = await WithdrawalOrderAPIs.processWithdrawal(payload);

    if (res)
      notifications.show({
        title: "Success",
        message: "Withdrawal order completed successfully!",
        color: "green",
      });
    setIsSetForProcess(false);
    setTransactionDetails({
      transactionId: "",
      transactionReceipt: File,
    });
    setLoading(false);
    reload();
    close();
  };

  const handleReject = async () => {
    const res = await WithdrawalOrderAPIs.rejectWithdrawal({ id: orderId });
    if (res)
      notifications.show({
        title: "Success",
        message: "Withdrawal order rejected successfully!",
        color: "green",
      });
    setIsSetForProcess(false);
    setTransactionDetails({
      transactionId: "",
      transactionReceipt: File,
    });
    reload();
    close();
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
              isByAdmin={
                details.status === "complete" &&
                details.withdrawalMadeOn !== "gateway"
              }
            />

            {!isForProcess && (
              <Accordion defaultValue="1" variant="separated">
                <Accordion.Item key={"1"} value={"1"}>
                  <Accordion.Control>General Details</Accordion.Control>
                  <Accordion.Panel>
                    <GeneralDetails
                      withdrawalMadeVia={details.withdrawalMadeOn}
                      user={details.user}
                      gateway={details.gatewayName}
                      createdOn={details.createdAt}
                      updatedOn={details.updatedAt}
                      status={details.status}
                      notificationStatus={details.notificationStatus}
                      userChanelDetails={details.userChannel}
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
                        withdrawalMadeOn={details.withdrawalMadeOn}
                      />
                    )}
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item key={"1"} value={"3"}>
                  <Accordion.Control>
                    Balances and Commissions
                  </Accordion.Control>
                  <Accordion.Panel>
                    {!details.balancesAndProfit ||
                    !details.balancesAndProfit?.length ? (
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
            )}

            {isForProcess && (
              <RecipientChannel
                channel={details.channel}
                paymentDetails={details.userChannel}
                transactionDetails={transactionDetails}
                setTransactionDetails={setTransactionDetails}
              />
            )}
          </>
        ) : (
          <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
            <Loader />
          </Flex>
        )
      }
      footer={
        details?.status === "pending" && (
          <>
            {isForProcess ? (
              <Flex justify={"space-between"} align={"center"}>
                {error ? (
                  <Text c={"red"}>{error}</Text>
                ) : details.isPayoutProcessing ? (
                  <Text c={"gray.6"} size={"18px"} fw={400}>
                    Payment Processing....
                  </Text>
                ) : (
                  <Text c={"gray.6"}>
                    Enter the Transaction Id and Receipt to submit
                  </Text>
                )}
                <Button 
                  onClick={handleSubmit} 
                  loading={loading} 
                  disabled={details.isPayoutProcessing}
                >
                  Submit Payment
                </Button>
              </Flex>
            ) : (
              <Flex justify={"flex-end"} gap={"md"}>
                {details.isPayoutProcessing || details.transactionId ? (
                  <Text size={"18px"} fw={400}>
                    {details.isPayoutProcessing ? "Payment Processing...." : "Payment is in progress..."}
                  </Text>
                ) : (
                  <>
                    {" "}
                    <Popover>
                      <Popover.Target>
                        <Button bg={"red"} disabled={loading || details.isPayoutProcessing}>
                          Reject Withdrawal
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown
                        style={{
                          boxShadow:
                            "2px 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        }}
                      >
                        <Flex direction={"column"} p={"4px"} gap={"8px"}>
                          <Text size={"16px"} fw={600} mb={"sm"} ta={"center"}>
                            Are you sure to reject this order?
                          </Text>
                          <Button
                            variant="outline"
                            color={"red"}
                            w={"100%"}
                            onClick={handleReject}
                            disabled={details.isPayoutProcessing}
                          >
                            Yes, Reject
                          </Button>
                        </Flex>
                        <Text></Text>
                      </Popover.Dropdown>
                    </Popover>
                    <Popover>
                      <Popover.Target>
                        <Button bg={"green"} disabled={details.isPayoutProcessing}>
                          Process Withdrawal
                        </Button>
                      </Popover.Target>
                      <Popover.Dropdown
                        style={{
                          boxShadow:
                            "2px 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        }}
                      >
                        <Flex direction={"column"} p={"4px"} gap={"8px"}>
                          <Text size={"16px"} fw={600} mb={"sm"} ta={"center"}>
                            Please choose any one payment method to proceed
                          </Text>
                          <Flex gap={"8px"}>
                            <Button
                              variant="outline"
                              color={"green"}
                              w={"50%"}
                              disabled={loading || details.isPayoutProcessing}
                              onClick={() => {
                                handleProcessWithdrawal("ADMIN");
                              }}
                            >
                              Offline Remmitance
                            </Button>
                            <Button
                              variant="outline"
                              color={"green"}
                              w={"50%"}
                              loading={loading}
                              disabled={details.isPayoutProcessing}
                              onClick={() => {
                                handleProcessWithdrawal("GATEWAY");
                              }}
                            >
                              Gateway
                            </Button>
                          </Flex>
                        </Flex>
                        <Text></Text>
                      </Popover.Dropdown>
                    </Popover>
                  </>
                )}
              </Flex>
            )}
          </>
        )
      }
    />
  );
};

export default AdminWithdrawal;

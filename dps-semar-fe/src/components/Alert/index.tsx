import { Button, List, Modal, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { AlertType } from "../../types/enums";
import { changeAlertStatusToRead } from "../../api/alertsAndNotifications";
import { useDisclosure } from "@mantine/hooks";
import PayoutModal from "../OrderModals/PayoutModals";
import WithdrawalModals from "../OrderModals/WithdrawalModals";

const Alert = ({ opened, close, alerts }) => {
  if (!alerts?.length) return;

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAlert = alerts[currentIndex];
  const [orderId, setOrderId] = useState(0);
  const [payoutDetails, payoutDetailsHandler] = useDisclosure();
  const [withdrawalDetails, withdrawalDetailsHandler] = useDisclosure();

  const getHeadingText = () => {
    let heading = "";

    switch (currentAlert?.type) {
      case AlertType.PAYOUT_FAILED:
        heading = `Payout Order Failed!`;
        break;

      case AlertType.PAYOUT_SUCCESS:
        heading = `Payout Order Completed!`;
        break;

      case AlertType.WITHDRAWAL_COMPLETE:
        heading = `Withdrawal Order Completed!`;
        break;

      case AlertType.WITHDRAWAL_FAILED:
        heading = `Withdrawal Order Failed!`;
        break;

      case AlertType.WITHDRAWAL_REJECTED:
        heading = `Withdrawal Order Rejected!`;
        break;

      case AlertType.USER_PAYIN_LIMIT:
        heading = "User Payin Limit Exceeded!";
        break;

      default:
        return "";
    }

    return heading;
  };

  const closeCurrentAlert = () => {
    let newIndex = currentIndex + 1;
    if (newIndex < alerts.length) setCurrentIndex(newIndex);
    else close();
  };

  const handleViewOrderDetails = () => {
    setOrderId(currentAlert.data?.orderId);
    const orderType = currentAlert?.type;

    if (
      orderType === AlertType.PAYOUT_FAILED ||
      orderType === AlertType.PAYOUT_SUCCESS
    )
      payoutDetailsHandler.open();
    else withdrawalDetailsHandler.open();
  };

  useEffect(() => {
    if (opened) changeAlertStatusToRead(currentAlert?.id);
  }, [currentIndex]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={closeCurrentAlert}
        title={<Text fw={600}>{getHeadingText()}</Text>}
      >
        {currentAlert?.type !== AlertType.USER_PAYIN_LIMIT ? (
          <>
            <Text size="md">{currentAlert?.text}</Text>
            <Button mt={"12px"} onClick={handleViewOrderDetails}>
              View Order Details
            </Button>
          </>
        ) : (
          <>
            <List>
              <List.Item>
                <b>User ID: </b> {currentAlert?.data?.userId}
              </List.Item>
              <List.Item>
                <b> User Name: </b> {currentAlert?.data?.name}
              </List.Item>
              <List.Item>
                <b> User Email: </b> {currentAlert?.data?.email}
              </List.Item>
              <List.Item>
                <b> User Mobile: </b> {currentAlert?.data?.mobile}
              </List.Item>
              <List.Item>
                <b> Merchant Name: </b> {currentAlert?.data?.merchant}
              </List.Item>
              <List.Item>
                <b> Total Payin Amount: </b> ₹
                {currentAlert?.data?.totalPayinAmount}
              </List.Item>
              <List.Item>
                <b>Total Payout Amount: </b> ₹
                {currentAlert?.data?.totalPayoutAmount}
              </List.Item>
              <List.Item>
                <b>Today's Payin Amount (Gateways): </b> ₹
                {currentAlert?.data?.payinAmountUsingGateways}
              </List.Item>
              <List.Item>
                <b>Current Order's Amount: </b> ₹
                {currentAlert?.data?.currentPayinOrderAmount}
              </List.Item>
            </List>
          </>
        )}
      </Modal>

      <PayoutModal
        opened={payoutDetails}
        close={payoutDetailsHandler.close}
        mode={"merchant"}
        orderId={orderId}
        handlers={payoutDetailsHandler}
        triggerReload={() => {}}
      />

      <WithdrawalModals
        opened={withdrawalDetails}
        close={withdrawalDetailsHandler.close}
        mode={"user"}
        orderId={orderId}
        user={currentAlert?.userType?.toLowerCase()}
        reload={() => {}}
      />
    </>
  );
};

export default Alert;

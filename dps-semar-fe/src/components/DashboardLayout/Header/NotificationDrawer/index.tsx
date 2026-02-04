import { Box, Button, Divider, Drawer, Flex, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationType } from "../../../../types/enums";
import PayinModal from "../../../OrderModals/PayinModals";
import PayoutModal from "../../../OrderModals/PayoutModals";
import TopUpModal from "../../../OrderModals/TopUpModals";

export interface NotificationProps {
  type: NotificationType;
  message: string;
  date: string;
  isUnread: boolean;
  data: any;
}

interface NotificationDrawerProps {
  opened: boolean;
  onClose: () => void;
  notifications: NotificationProps[];
  showIndicator: boolean;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  opened,
  onClose,
  notifications,
  showIndicator,
}) => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const currentPath = window.location.pathname;
  const isUpiVendor = currentPath.includes("/upi-vendor");

  const handleGoToBulletin = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/upi-vendor")) {
      navigate("/upi-vendor/bulletin-board");
    } else {
      navigate("/member/bulletin-board");
    }
    onClose();
  };

  const unreadCount = notifications.filter(
    (notification) => notification.isUnread,
  ).length;

  const handleOpenModal = (type: NotificationType, orderId: string) => {
    switch (type) {
      case NotificationType.PAYIN_FOR_VERIFY:
        setOrderId(orderId);
        setOrderType("payin");

        break;
      case NotificationType.PAYOUT_REJECTED:
        setOrderId(orderId);
        setOrderType("payout");
        break;
      case NotificationType.PAYOUT_VERIFIED:
        setOrderId(orderId);
        setOrderType("payout");
        break;
      case NotificationType.TOPUP_REJETCED:
        setOrderId(orderId);
        setOrderType("topup");
        break;
      case NotificationType.TOPUP_VERIFIED:
        setOrderId(orderId);
        setOrderType("topup");
        break;

      default:
        break;
    }
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Drawer
        opened={opened}
        size={isMobile ? "100%" : "md"}
        onClose={onClose}
        title={
          <Flex align="center">
            <Title order={4}>Notifications</Title>
            {unreadCount > 0 && (
              <Box
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#d9d9d9",
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "8px",
                  fontSize: "12px",
                }}
              >
                {unreadCount}
              </Box>
            )}
          </Flex>
        }
        padding="md"
        position="left"
        offset="10"
        radius="md"
      >
        <Divider />

        {notifications.reverse().map((notification, index) => (
          <Box
            key={index}
            py="sm"
            px="md"
            mx="sm"
            my="sm"
            style={{
              backgroundColor: notification.isUnread ? "#fff" : "transparent",
              border: "1px solid #D9D9D9",
              borderRadius: "10px",
            }}
          >
            <Flex align="center" justify="space-between" gap="sm">
              <Text>{notification.message}</Text>
              {showIndicator && notification.isUnread && (
                <Box
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#A85706",
                  }}
                />
              )}
            </Flex>
            <Text size="xs" c="gray">
              {notification.date}
            </Text>

            {notification.type === NotificationType.GRAB_PAYOUT ||
            notification.type === NotificationType.GRAB_TOPUP ? (
              <Button onClick={handleGoToBulletin} size="xs" mt={"xs"}>
                Go to Bulletin
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleOpenModal(notification.type, notification.data.orderId);
                }}
                size="xs"
                mt={"xs"}
              >
                View order details
              </Button>
            )}

            {/* for other view order details btn, Open modal */}

            {/* {notification.type === "request" && (
            <Flex gap="sm" mt="xs">
              <Button variant="outline" bg="#fff" color="grey" size="xs">
                Decline
              </Button>
              <Button size="xs">Accept</Button>
            </Flex>
          )}

          {notification.type === "alert" && (
            <Button size="xs" variant="outline" bg="#fff" color="grey" mt="xs">
              View
            </Button>
          )} */}
          </Box>
        ))}

        {notifications.length === 0 && (
          <Flex h={"500px"} align={"center"} justify={"center"}>
            <Text>No new notifications.</Text>
          </Flex>
        )}
      </Drawer>
      <PayinModal
        mode={isUpiVendor ? "upi-vendor" : "member"}
        opened={orderType === "payin" && orderId}
        orderId={orderId}
        close={() => {
          setOrderType(null);
          setOrderId(null);
        }}
      />
      {!isUpiVendor && (
        <>
          <PayoutModal
            opened={orderType === "payout" && orderId}
            close={() => {
              setOrderType(null);
              setOrderId(null);
            }}
            mode={"member"}
            orderId={orderId}
            triggerReload={() => {}}
            handlers={{ close: () => {} }}
          />
          <TopUpModal
            opened={orderType === "topup" && orderId}
            close={() => {
              setOrderType(null);
              setOrderId(null);
            }}
            mode={"user"}
            orderId={orderId}
            triggerReload={() => {}}
            handlers={{ close: () => {} }}
          />
        </>
      )}
    </>
  );
};

export default NotificationDrawer;

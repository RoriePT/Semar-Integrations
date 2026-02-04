import { Box, Divider, Flex, Menu, Paper, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { IoMdMenu, IoMdNotificationsOutline } from "react-icons/io";
import AdminIcon from "../../../assets/admin.png";
import AgentIcon from "../../../assets/agent.png";
import MemberIcon from "../../../assets/member.png";
import MerchantIcon from "../../../assets/merchant.png";
import styles from "./Header.module.css";

import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { changeNotificationStatusToRead } from "../../../api/alertsAndNotifications";
import { NotificationType } from "../../../types/enums";
import NotificationDrawer from "./NotificationDrawer";

interface NotificationItemType {
  type: NotificationType;
  data: any;
  text: string;
  date: Date;
  id: number;
}

const AppHeader: React.FC<{
  toggleSidebar: any;
  userData: any;
  notifications2: NotificationItemType[];
}> = ({ toggleSidebar, userData, notifications2 }) => {
  const { pathname } = useLocation();
  const [notifications, setNotifications] = useState([]);

  const role: any = pathname.split("/")[1];
  const tabName = pathname.split("/")[2];

  const isMobile = useMediaQuery("(max-width: 767px)");
  const [drawerOpened, setDrawerOpened] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const newNotifications = notifications2.map((item) => {
      const existing = notifications.find((elem) => elem.id === item.id);
      return {
        type: item.type,
        message: item.text,
        date: moment(item.date).fromNow(),
        isUnread: existing ? existing.isUnread : true,
        id: item.id,
        data: item.data,
      };
    });

    setNotifications(newNotifications);
  }, [notifications2]);

  function formatTabName(input) {
    // Replace hyphens with spaces
    const spacedString = input?.replace(/-/g, " ");

    // Capitalize the first letter of each word, but keep "UPI" in all caps
    const capitalizedString = spacedString
      ?.split(" ")
      ?.map((word) => {
        // Keep UPI in all caps
        if (word.toLowerCase() === "upi") {
          return "UPI";
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      ?.join(" ");

    return capitalizedString;
  }

  const getUserRoleIcon = () => {
    switch (userData?.userType) {
      case "Super Admin":
      case "Sub Admin":
        return AdminIcon;
      case "Member":
        return MemberIcon;
      case "Merchant":
      case "Sub-Merchant":
        return MerchantIcon;
      case "Agent":
        return AgentIcon;
      case "UPI Vendor":
        return MemberIcon;
    }

    return "";
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("KGtoken2");
    navigate("/sign-in");
  };

  const markNotificationsToRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false }))
    );
    const payload = notifications.map((item) => item.id);
    changeNotificationStatusToRead(payload);
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  useEffect(() => {
    if (drawerOpened && notifications.length > 0) {
      markNotificationsToRead();
    }
  }, [drawerOpened]);

  return (
    <Paper p="md" shadow="xs" bg="#ffffff" mb={15} className={styles.header}>
      <Flex justify={"space-between"} align={"center"} w={"100%"}>
        <Flex justify={"center"} align={"center"} gap={"md"}>
          <IoMdMenu
            className={styles.HeaderLogo}
            size={30}
            onClick={toggleSidebar}
            style={{ cursor: "pointer" }}
          />

          <Title className={styles.HeaderTitle} order={2}>
            {formatTabName(tabName)}
          </Title>
        </Flex>

        {isMobile ? (
          <Flex gap="8px">
            {(userData?.userType === "Member" || userData?.userType === "UPI Vendor") && (
              <>
                <Box
                  onClick={() => setDrawerOpened(true)}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    border: "1px solid gainsboro",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5px 5px",
                    gap: "xs",
                  }}
                >
                  <IoMdNotificationsOutline size={24} />
                  {unreadCount > 0 && (
                    <Box
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        backgroundColor: "red",
                        borderRadius: "50%",
                        color: "white",
                        padding: "2px 5px",
                        fontSize: "10px",
                      }}
                    >
                      {unreadCount}
                    </Box>
                  )}
                </Box>
                <NotificationDrawer
                  opened={drawerOpened}
                  onClose={() => setDrawerOpened(false)}
                  notifications={notifications}
                  showIndicator={true}
                />
              </>
            )}
            <Menu trigger="click" position="bottom-end" withArrow>
              <Menu.Target>
                <Flex
                  direction="row"
                  align={"center"}
                  gap={"xs"}
                  style={{
                    border: "1px solid gainsboro",
                    borderRadius: "10px",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  <img
                    className={styles.HeaderLogo}
                    src={getUserRoleIcon()}
                    alt=""
                  />
                </Flex>
              </Menu.Target>
              <Menu.Dropdown w="250">
                <Box p="md">
                  <Title order={5}>
                    {userData?.firstName} {userData?.lastName}
                  </Title>
                  <Text c={"gray.6"} size="xs">
                    {userData?.userType}
                  </Text>
                  <Divider my="xs" />
                  <Menu.Item onClick={handleLogout}>
                    <Flex align="center" gap="sm">
                      <FiLogOut />
                      <span>Logout</span>
                    </Flex>
                  </Menu.Item>
                </Box>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        ) : (
          <>
            <Flex gap="10px">
              {(userData?.userType === "Member" || userData?.userType === "UPI Vendor") && (
                <>
                  <Box
                    onClick={() => setDrawerOpened(true)}
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      border: "1px solid gainsboro",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "5px 10px",
                      gap: "xs",
                    }}
                  >
                    <IoMdNotificationsOutline size={24} />
                    {unreadCount > 0 && (
                      <Box
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          backgroundColor: "red",
                          borderRadius: "50%",
                          color: "white",
                          padding: "2px 5px",
                          fontSize: "10px",
                        }}
                      >
                        {unreadCount}
                      </Box>
                    )}
                  </Box>
                  <NotificationDrawer
                    opened={drawerOpened}
                    onClose={() => setDrawerOpened(false)}
                    notifications={notifications}
                    showIndicator={true}
                  />
                </>
              )}
              <Menu trigger="click" position="bottom-end" withArrow>
                <Menu.Target>
                  <Flex
                    direction="row"
                    align={"center"}
                    gap={"xs"}
                    style={{
                      border: "1px solid gainsboro",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    px={"md"}
                    py={"5px"}
                  >
                    <img
                      className={styles.HeaderLogo}
                      src={getUserRoleIcon()}
                      alt=""
                    />
                    <Box>
                      <Title order={5}>
                        {userData?.firstName} {userData?.lastName}
                      </Title>
                      <Text c={"gray.6"} size="xs">
                        {userData?.userType}
                      </Text>
                    </Box>
                  </Flex>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={handleLogout}>
                    <Flex align="center" gap="sm">
                      <FiLogOut />
                      <span>Logout</span>
                    </Flex>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </>
        )}
      </Flex>
    </Paper>
  );
};

export default AppHeader;

import {
  Box,
  Collapse,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import semarLogo from "../../../assets/semar_logo.svg";
import { useDashboardUser } from "../../../pages/Dashboard/DashboardProvider";
import dashboardRoutes from "../../../pages/Dashboard/dashboardRoutes";
import GoogleTranslateWidget from "../../GoogleTranslateWidget";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  role: string;
  style?: React.CSSProperties;
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, style, onLinkClick }) => {
  const [openTabs, setOpenTabs] = useState<Set<number>>(new Set());
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [recentlyExploredTab, setRecentlyExploredTab] = useState<number | null>(
    null,
  );
  const theme = useMantineTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, loading } = useDashboardUser();
  const {
    permissionChannelsAndGateways,
    permissionSystemConfig,
    permissionAdmins,
    permissionUsers,
    permissionHandleWithdrawals,
  } = userData || {};

  useEffect(() => {
    const currentRoute = location.pathname.substring(1);
    const newActiveLink =
      dashboardRoutes[role]
        ?.flatMap((item) =>
          item.children.length > 0
            ? item.children.map((child) => child.route)
            : [item.route],
        )
        .find((route) => currentRoute.includes(route || "")) || null;

    setActiveLink(newActiveLink);

    const newOpenTabs = new Set<number>();
    if (newActiveLink) {
      dashboardRoutes[role]?.forEach((item, index) => {
        if (item.children.some((child) => child.route === newActiveLink)) {
          newOpenTabs.add(index);
        }
      });
    }

    if (recentlyExploredTab !== null) {
      newOpenTabs.add(recentlyExploredTab);
    }

    setOpenTabs(newOpenTabs);
  }, [location, role, recentlyExploredTab]);

  const handleToggle = (tabIndex: number) => {
    const newOpenTabs = new Set<number>(openTabs);

    if (newOpenTabs.has(tabIndex)) {
      newOpenTabs.delete(tabIndex);
    } else {
      newOpenTabs.add(tabIndex);
    }

    setOpenTabs(newOpenTabs);
    setRecentlyExploredTab(tabIndex);
  };

  const handleLinkClick = (route: string, tabIndex: number | null) => {
    setActiveLink(route);

    const newOpenTabs = new Set<number>(openTabs);
    if (tabIndex !== null) {
      newOpenTabs.add(tabIndex);
    }

    setOpenTabs(newOpenTabs);
    setRecentlyExploredTab(tabIndex);
    navigate(`/${route}`);

    if (onLinkClick) onLinkClick();
  };

  return (
    <Paper
      //  p="md"
      py="md"
      pl="md"
      shadow="xs"
      w="300px"
      style={{
        height: "100%",
        backgroundColor: "var(--color-white)",
        ...style,
      }}
    >
      <Box px={"xl"}>
        <Image
          src={semarLogo}
          alt="Sidebar Logo"
          w={"100%"}
          maw={"160px"}
          fit="contain"
          style={{ borderRadius: theme.radius.md }}
          mt={"xs"}
        />
      </Box>

      <Divider my={"lg"} />

      <ScrollArea className={styles.scrollableContent}>
        {dashboardRoutes[role]
          ?.filter((item) => {
            if (false) {
              return;
            } else if (!permissionAdmins && item.label === "Admin Management") {
              return;
            } else if (
              !permissionUsers &&
              (item.label === "Merchant Management" ||
                item.label === "Agent Management" ||
                item.label === "Member Management" ||
                item.label === "UPI Vendor Management")
            ) {
              return;
            } else if (
              !permissionSystemConfig &&
              item.label === "System Config"
            ) {
              return;
            } else if (
              !permissionChannelsAndGateways &&
              item.label === "Channels & Gateways"
            ) {
              return;
            } else return item;
          })
          .map((item, index) => (
            <Box key={index}>
              {item.children.length > 0 ? (
                <>
                  <Group
                    onClick={() => handleToggle(index)}
                    className={styles.groupWithChildren}
                    justify="space-between"
                    align="center"
                  >
                    <Flex align="center" gap="5">
                      {item.haveIcon && item.icon && <item.icon size={14} />}
                      <Text
                        className={
                          openTabs.has(index)
                            ? styles.activeGroupLabel
                            : styles.groupLabel
                        }
                      >
                        {item.label}
                      </Text>
                    </Flex>
                    {openTabs.has(index) ? <ChevronUp /> : <ChevronDown />}
                  </Group>
                  <Collapse in={openTabs.has(index)}>
                    {item.children.map((child, childIndex) => {
                      if (
                        !permissionHandleWithdrawals &&
                        child.label === "Withdrawal Orders"
                      ) {
                        return;
                      } else {
                        return (
                          <NavLink
                            key={childIndex}
                            to={child.route ? `/${child.route}` : "#"}
                            className={({ isActive }) =>
                              `${styles.navLink} ${styles.childNavLink} ${
                                isActive ? styles.active : ""
                              }`
                            }
                            onClick={() => {
                              if (child.route) {
                                handleLinkClick(child.route, index);
                              }
                            }}
                          >
                            <Flex align="center" gap="5">
                              {child.haveIcon && child.icon && (
                                <child.icon size={14} />
                              )}
                              {child.label}
                            </Flex>
                          </NavLink>
                        );
                      }
                    })}
                  </Collapse>
                </>
              ) : (
                <NavLink
                  key={index}
                  to={item.route ? `/${item.route}` : "#"}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={() => {
                    if (item.route) {
                      handleLinkClick(item.route, null);
                    }
                  }}
                >
                  <Flex align="center" gap="5">
                    {item.haveIcon && item.icon && <item.icon size={14} />}
                    {item.label}
                  </Flex>
                </NavLink>
              )}
            </Box>
          ))}
      </ScrollArea>
      <div className={styles.googleTranslateWrapper}>
        <GoogleTranslateWidget />
      </div>
    </Paper>
  );
};

export default Sidebar;

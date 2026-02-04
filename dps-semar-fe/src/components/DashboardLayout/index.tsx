import React, { useState, useEffect, useRef } from "react";
import { Box, Container, Paper, Title, useMantineTheme } from "@mantine/core";

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import AppHeader from "./Header";
import AppFooter from "./Footer";
import styles from "./Layout.module.css";
import { useDashboardUser } from "../../pages/Dashboard/DashboardProvider";
import { useMediaQuery } from "@mantine/hooks";

interface DashboardLayoutProps {
  role: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { userData, loading, notifications } = useDashboardUser();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const theme = useMantineTheme();

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      window.innerWidth <= 1190
    ) {
      setSidebarVisible(false);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 1190) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1190) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isMobile = useMediaQuery("(max-width: 720px)");

  return (
    <Box className={styles.container}>
      <div
        ref={sidebarRef}
        className={`${styles.sidebarWrapper} ${
          sidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
        }`}
      >
        <Sidebar role={role} onLinkClick={handleLinkClick} />
      </div>
      <Box
        className={`${styles.content} ${
          sidebarVisible ? "" : styles.contentSidebarHidden
        }`}
      >
        <AppHeader
          toggleSidebar={toggleSidebar}
          userData={userData}
          notifications2={notifications}
        />

        <Box className={styles.contentArea}>
          <Container
            size="l"
            p={0}
            style={{ height: isMobile ? "800px" : "100%" }}
          >
            <Outlet />
          </Container>
        </Box>

        <AppFooter />
      </Box>
    </Box>
  );
};

export default DashboardLayout;

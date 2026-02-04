import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { DashboardProvider } from "./DashboardProvider";
import dashboardRoutes from "./dashboardRoutes";
import { DefaultProvider } from "./DefaultValue";

type UserRole = "ADMIN" | "MEMBER" | "MERCHANT" | "AGENT" | "UPI_VENDOR";

interface DashboardProps {
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const { pathname } = useLocation();

  const getDefaultRoute = (role: string) => {
    const routes = dashboardRoutes[role];
    if (routes && routes.length > 0) {
      const firstItem = routes[0];
      if (firstItem.route) {
        return `/${firstItem.route}`;
      } else if (firstItem.children.length > 0 && firstItem.children[0].route) {
        return `/${firstItem.children[0].route}`;
      }
    }
    return "/";
  };

  const defaultRoute = getDefaultRoute(userRole);
  const basePath = `/${userRole.toLowerCase().replace("_", "-")}`;

  return (
    <DefaultProvider>
      <DashboardProvider>
        {pathname === basePath ? <Navigate to={defaultRoute} /> : null}
        <DashboardLayout role={userRole} />
      </DashboardProvider>
    </DefaultProvider>
  );
};

export default Dashboard;

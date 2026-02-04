import React from "react";
import SubAccount from "./SubAccount";
import MainAccount from "./MainAccount";
import { useDashboardUser } from "../../../DashboardProvider";

const MyAccount = () => {
  const { userData } = useDashboardUser();

  const isSubMerchant = userData.userType === "Sub-Merchant";

  if (isSubMerchant) return <SubAccount />;
  return <MainAccount />;
};

export default MyAccount;

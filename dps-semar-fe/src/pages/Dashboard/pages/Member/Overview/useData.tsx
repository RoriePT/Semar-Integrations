import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { UserOverviewAPIs } from "../../../../../api/overview";
import { useDashboardUser } from "../../../DashboardProvider";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState(true);
  const { userData } = useDashboardUser();

  const [balances, setBalances] = useState({
    quota: 0,
    balance: 0,
    withdrawal: 0,
  });

  const [payinData, setPayinData] = useState({
    ordersPending: 0,
    ordersCompleted: 0,
    commission: 0,
  });

  const [payoutData, setPayoutData] = useState({
    ordersPending: 0,
    ordersCompleted: 0,
    commission: 0,
  });

  const [topupData, setTopupData] = useState({
    ordersCompleted: 0,
    commission: 0,
  });

  const getAllData = async () => {
    setLoading(true);

    const data = await UserOverviewAPIs.member();

    setPayinData(data.payins);
    setPayoutData(data.payouts);
    setTopupData(data.topups);
    setBalances(data.balances);

    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    isTablet,
    payinData,
    payoutData,
    topupData,
    balances,
    loading,
  };
};

export default useData;

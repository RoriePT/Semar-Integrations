import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { UserOverviewAPIs } from "../../../../../api/overview";
import { useDashboardUser } from "../../../DashboardProvider";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");
  const { userData } = useDashboardUser();

  const [loading, setLoading] = useState(true);

  const [graphData, setGraphData] = useState([
    {
      date: "March",
      Payins: 0,
    },
    {
      date: "April",
      Payins: 0,
    },
    {
      date: "May",
      Payins: 0,
    },
    {
      date: "June",
      Payins: 0,
    },
    {
      date: "July",
      Payins: 0,
    },
  ]);

  const [payinData, setPayinData] = useState({
    totalOrders: 0,
    ordersPending: 0,
    ordersCompleted: 0,
    ordersFailed: 0,
    income: 0,
    serviceFee: 0,
  });

  const [payoutData, setPayoutData] = useState({
    totalOrders: 0,
    ordersPending: 0,
    ordersCompleted: 0,
    ordersFailed: 0,
    payoutAmount: 0,
    serviceFee: 0,
  });

  const [balances, setBalances] = useState({
    balance: 0,
    withdrawal: 0,
  });

  const getAllData = async () => {
    setLoading(true);

    const data = await UserOverviewAPIs.merchant();

    setPayinData(data.payins);
    setPayoutData(data.payouts);
    setBalances(data.balances);
    setGraphData(data.graph);

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
    balances,
    graphData,
    loading,
  };
};

export default useData;

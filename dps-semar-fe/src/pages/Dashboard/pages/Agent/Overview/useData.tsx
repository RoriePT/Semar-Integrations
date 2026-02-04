import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { UserOverviewAPIs } from "../../../../../api/overview";
import { useDashboardUser } from "../../../DashboardProvider";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const { userData } = useDashboardUser();

  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState({
    balance: 0,
    withdrawalAmount: 0,
    commissions: 0,
    commissionAmount: 0,
  });

  const [graphData, setGraphData] = useState([
    {
      date: "March",
      Commissions: 0,
    },
    {
      date: "April",
      Commissions: 0,
    },
    {
      date: "May",
      Commissions: 0,
    },
    {
      date: "June",
      Commissions: 0,
    },
    {
      date: "July",
      Commissions: 0,
    },
  ]);

  const getAllData = async () => {
    setLoading(true);

    const data = await UserOverviewAPIs.agent();

    setGraphData(data.graphData);
    setOrders(data.orders);

    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    orders,
    graphData,
    loading,
  };
};

export default useData;

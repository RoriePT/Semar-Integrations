import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { UserOverviewAPIs } from "../../../../../api/overview";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState(true);

  const [totalSettlement, setTotalSettlement] = useState(0);

  const [payinData, setPayinData] = useState({
    ordersPending: 0,
    ordersCompleted: 0,
    pendingAmount: 0,
    completedAmount: 0,
    totalAmount: 0,
  });

  const [commissionData, setCommissionData] = useState({
    total: 0,
    monthlyData: [],
  });

  const [upiIds, setUpiIds] = useState([]);

  const getAllData = async () => {
    setLoading(true);

    const data = await UserOverviewAPIs.upiVendor();

    setTotalSettlement(data?.totalSettlement || 0);
    setPayinData(data?.payins || {
      ordersPending: 0,
      ordersCompleted: 0,
      pendingAmount: 0,
      completedAmount: 0,
      totalAmount: 0,
    });
    setCommissionData(data?.commission || { total: 0, monthlyData: [] });
    setUpiIds(data?.upiIds || []);

    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    isTablet,
    totalSettlement,
    payinData,
    commissionData,
    upiIds,
    loading,
  };
};

export default useData;


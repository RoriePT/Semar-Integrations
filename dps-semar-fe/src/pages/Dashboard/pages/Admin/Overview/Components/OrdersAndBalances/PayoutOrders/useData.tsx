import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../../api/overview";

const useData = (selectedMerchant) => {
  const getSpan = () => (isMobile ? 12 : 5);
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [orders, setOrders] = useState([
    {
      amount: "0",
      subHeading: "Total orders",
      colSpan: getSpan(),
      key: "total",
    },

    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total failed amount",
      colSpan: getSpan(),
      key: "totalFailed",
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total pending amount",
      colSpan: getSpan(),
      key: "totalPending",
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total completed amount",
      colSpan: getSpan(),
      key: "totalCompleted",
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Merchant service fee",
      colSpan: getSpan(),
      key: "totalServiceFee",
    },
    {
      isForAmount: false,
      amount: "0",
      subHeading: "Success rate",
      colSpan: getSpan(),
      key: "successRate",
    },
  ]);

  const [pieChartData, setPieChartData] = useState([
    { name: "Initiated", value: 0, color: "gray", key: "initiated" },
    { name: "Assigned", value: 0, color: "grape", key: "assigned" },
    { name: "Submitted", value: 0, color: "yellow", key: "submitted" },
    { name: "Completed", value: 0, color: "green", key: "completed" },
    { name: "Failed", value: 0, color: "red", key: "failed" },
  ]);

  const [lineChartData, setLineChartData] = useState([
    { date: "March", Orders: 0 },
    { date: "April", Orders: 0 },
    { date: "May", Orders: 0 },
    { date: "June", Orders: 0 },
    { date: "July", Orders: 0 },
  ]);

  const mapWithObject1 = (arr, obj, key) => {
    const temp = [...arr];
    for (const item of temp) {
      item[key] = obj[item.key];
    }
    return temp;
  };

  const getAllData = async (start = "01/01/2024", end = "12/12/2030") => {
    setLoading(true);
    setLoading2(true);
    const data = await AdminOverviewAPIs.ordersAndBalances.payoutOrders({
      startDate: start,
      endDate: end,
      merchantId: selectedMerchant,
    });

    const newOrders = mapWithObject1(orders, data.orders, "amount");
    setOrders(newOrders);

    const newPieChartData = mapWithObject1(
      pieChartData,
      data.pieChartData,
      "value"
    );
    setPieChartData(newPieChartData);

    setLineChartData(data.lineChartData);

    setLoading(false);
    setLoading2(false);
  };

  const getDateData = async (start = "01/01/2024", end = "12/12/2030") => {
    setLoading2(true);
    const data = await AdminOverviewAPIs.ordersAndBalances.payoutOrders({
      startDate: start,
      endDate: end,
      merchantId: selectedMerchant,
    });

    const newOrders = mapWithObject1(orders, data.orders, "amount");
    setOrders(newOrders);

    const newPieChartData = mapWithObject1(
      pieChartData,
      data.pieChartData,
      "value"
    );
    setPieChartData(newPieChartData);

    setLoading2(false);
  };

  useEffect(() => {
    getAllData();
  }, [selectedMerchant]);

  return {
    isMobile,
    isTablet,
    orders,
    pieChartData,
    lineChartData,
    loading,
    loading2,
    getDateData,
  };
};

export default useData;

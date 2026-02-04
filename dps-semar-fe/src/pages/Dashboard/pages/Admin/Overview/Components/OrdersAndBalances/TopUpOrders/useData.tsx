import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../../api/overview";
import moment from "moment";

const useData = () => {
  const getSpan = () => (isMobile ? 12 : 3);

  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [orders, setOrders] = useState([
    {
      amount: "0",
      subHeading: "Total orders completed",
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
      subHeading: "Total completed amount",
      colSpan: getSpan(),
      key: "totalCompleted",
    },
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
    for (const iterator of temp) {
      iterator[key] = obj[iterator.key];
    }
    return temp;
  };

  const getAllData = async (start = "01/01/2024", end = "12/12/2030") => {
    setLoading(true);
    setLoading2(true);
    const data = await AdminOverviewAPIs.ordersAndBalances.topupOrders({
      startDate: start,
      endDate: end,
    });

    const newOrders = mapWithObject1(orders, data.orders, "amount");
    setOrders(newOrders);

    setLineChartData(data.lineChartData);

    setLoading(false);
    setLoading2(false);
  };

  const getDateData = async (start = "01/01/2024", end = "12/12/2030") => {
    setLoading2(true);
    const data = await AdminOverviewAPIs.ordersAndBalances.topupOrders({
      startDate: start,
      endDate: end,
    });

    const newOrders = mapWithObject1(orders, data.orders, "amount");
    setOrders(newOrders);

    setLoading2(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    isTablet,
    orders,

    lineChartData,
    loading,
    loading2,
    getDateData,
  };
};

export default useData;

import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../../api/overview";
import moment from "moment";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");
  const getSpan = () => (isMobile ? 12 : 5);

  const [loading, setLoading] = useState({
    payins: true,
    withdrawls: true,
    payouts: true,
  });

  const [payinData, setPayinData] = useState({
    orders: [
      {
        amount: "7500",
        subHeading: "Total orders",
        colSpan: getSpan(),
        key: "total",
      },
      {
        amount: "7500",
        subHeading: "Total completed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalCompleted",
      },
      {
        amount: "7500",
        subHeading: "Total failed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalFailed",
      },
      {
        amount: "7500",
        subHeading: "Total pending amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalPending",
      },
    ],
    distribution: [
      { name: "Initiated", value: 200, color: "gray", key: "initiated" },
      { name: "Assigned", value: 200, color: "grape", key: "assigned" },
      { name: "Submitted", value: 180, color: "yellow", key: "submitted" },
      { name: "Completed", value: 70, color: "green", key: "completed" },
      { name: "Failed", value: 40, color: "red", key: "failed" },
    ],
  });

  const [payoutData, setPayoutData] = useState({
    orders: [
      {
        amount: "7500",
        subHeading: "Total orders",
        colSpan: getSpan(),
        key: "total",
      },
      {
        amount: "7500",
        subHeading: "Total completed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalCompleted",
      },
      {
        amount: "7500",
        subHeading: "Total failed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalFailed",
      },
      {
        amount: "7500",
        subHeading: "Total pending amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalPending",
      },
    ],
    distribution: [
      { name: "Initiated", value: 200, color: "gray", key: "initiated" },
      { name: "Assigned", value: 200, color: "grape", key: "assigned" },
      { name: "Submitted", value: 180, color: "yellow", key: "submitted" },
      { name: "Completed", value: 70, color: "green", key: "completed" },
      { name: "Failed", value: 40, color: "red", key: "failed" },
    ],
  });

  const [withdrawalData, setWithdrawalData] = useState({
    orders: [
      {
        amount: "7500",
        subHeading: "Total orders",
        colSpan: getSpan(),
        key: "total",
      },
      {
        amount: "7500",
        subHeading: "Total completed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalCompleted",
      },
      {
        amount: "7500",
        subHeading: "Total failed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalFailed",
      },
      {
        amount: "7500",
        subHeading: "Total pending amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalPending",
      },
    ],
    distribution: [
      { name: "Pending", value: 200, color: "yellow", key: "pending" },
      { name: "Completed", value: 70, color: "green", key: "completed" },
      { name: "Rejected", value: 180, color: "gray", key: "rejected" },
      { name: "Failed", value: 40, color: "red", key: "failed" },
    ],
  });

  const mapWithObject1 = (arr, obj, key) => {
    const temp = [...arr];
    for (const iterator of temp) {
      iterator[key] = obj[iterator.key];
    }
    return temp;
  };

  const getAllData = async (
    orderType = null,
    startDate = "01/01/2024",
    endDate = "12/12/2030"
  ) => {
    if (!orderType)
      setLoading({ payins: true, payouts: true, withdrawls: true });
    else {
      setLoading((prev) => ({ ...prev, [orderType]: true }));
    }

    const data = await AdminOverviewAPIs.channels.eWallet({
      startDate: startDate,
      endDate: endDate,
      mode: orderType ? orderType.toUpperCase() : null,
    });

    if (!orderType || orderType === "payins") {
      const newPayinData = {
        orders: mapWithObject1(payinData.orders, data.payins.orders, "amount"),
        distribution: mapWithObject1(
          payinData.distribution,
          data.payins.distribution,
          "value"
        ),
      };

      setPayinData(newPayinData);
    }

    if (!orderType || orderType === "payouts") {
      const newPayoutData = {
        orders: mapWithObject1(
          payoutData.orders,
          data.payouts.orders,
          "amount"
        ),
        distribution: mapWithObject1(
          payoutData.distribution,
          data.payouts.distribution,
          "value"
        ),
      };

      setPayoutData(newPayoutData);
    }

    if (!orderType || orderType === "withdrawls") {
      const newWithdrawalData = {
        orders: mapWithObject1(
          withdrawalData.orders,
          data.withdrawals.orders,
          "amount"
        ),
        distribution: mapWithObject1(
          withdrawalData.distribution,
          data.withdrawals.distribution,
          "value"
        ),
      };

      setWithdrawalData(newWithdrawalData);
    }

    if (!orderType)
      setLoading({ payins: false, payouts: false, withdrawls: false });
    else {
      setLoading((prev) => ({ ...prev, [orderType]: false }));
    }
  };

  const getDateData = async (start, end, orderType) => {
    getAllData(orderType);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    isTablet,
    payinData,
    payoutData,
    withdrawalData,
    loading,
    getDateData,
  };
};

export default useData;

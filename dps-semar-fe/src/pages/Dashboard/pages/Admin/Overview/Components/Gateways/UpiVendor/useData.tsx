import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../../api/overview";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");
  const getSpan = () => (isMobile ? 12 : 5);

  const [loading, setLoading] = useState({
    payins: true,
  });

  const [payinData, setPayinData] = useState({
    orders: [
      {
        amount: "0",
        subHeading: "Total orders",
        colSpan: getSpan(),
        key: "total",
      },
      {
        amount: "0",
        subHeading: "Total completed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalCompleted",
      },
      {
        amount: "0",
        subHeading: "Total failed amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalFailed",
      },
      {
        amount: "0",
        subHeading: "Total pending amount",
        colSpan: getSpan(),
        isForAmount: true,
        key: "totalPending",
      },
    ],
    distribution: [
      { name: "Assigned", value: 0, color: "grape", key: "assigned" },
      { name: "Submitted", value: 0, color: "yellow", key: "submitted" },
      { name: "Completed", value: 0, color: "green", key: "completed" },
      { name: "Failed", value: 0, color: "red", key: "failed" },
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
    if (!orderType) setLoading({ payins: true });
    else {
      setLoading((prev) => ({ ...prev, [orderType]: true }));
    }

    const data = await AdminOverviewAPIs.gateways.upiVendor({
      startDate: startDate ? startDate : "01/01/2024",
      endDate: endDate ? endDate : "31/12/2030",
      mode: orderType ? orderType.toUpperCase() : null,
    });

    if (!data) {
      if (!orderType) setLoading({ payins: false });
      else {
        setLoading((prev) => ({ ...prev, [orderType]: false }));
      }
      return;
    }

    if (!orderType || orderType === "payins") {
      setPayinData((prevPayinData) => {
        const newPayinData = {
          orders: mapWithObject1(prevPayinData.orders, data.orders || {}, "amount"),
          distribution: mapWithObject1(
            prevPayinData.distribution,
            data.distribution || {},
            "value"
          ),
        };
        return newPayinData;
      });
    }

    if (!orderType) setLoading({ payins: false });
    else {
      setLoading((prev) => ({ ...prev, [orderType]: false }));
    }
  };

  const getDateData = async (start, end, orderType) => {
    getAllData(orderType, start, end);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    isTablet,
    payinData,
    loading,
    getDateData,
  };
};

export default useData;


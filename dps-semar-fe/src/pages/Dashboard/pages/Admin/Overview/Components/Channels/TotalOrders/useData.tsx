import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../../api/overview";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState({
    payins: true,
    withdrawls: true,
    payouts: true,
  });

  const [payinData, setPayinData] = useState({
    orders: [
      { name: "UPI", value: 0, color: "indigo.6", key: "upi" },
      { name: "QRIS", value: 0, color: "teal.6", key: "qris" },
      { name: "Netbanking", value: 0, color: "brand.6", key: "netBanking" },
      { name: "E-wallet", value: 0, color: "green.6", key: "eWallet" },
    ],
    distribution: [
      {
        channel: "UPI",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "upi",
      },
      {
        channel: "QRIS",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "qris",
      },
      {
        channel: "Netbanking",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "netBanking",
      },
      {
        channel: "E-wallet",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "eWallet",
      },
    ],
  });

  const [payoutData, setPayoutData] = useState({
    orders: [
      { name: "UPI", value: 0, color: "indigo.6", key: "upi" },
      { name: "QRIS", value: 0, color: "teal.6", key: "qris" },
      { name: "Netbanking", value: 0, color: "brand.6", key: "netBanking" },
      { name: "E-wallet", value: 0, color: "green.6", key: "eWallet" },
    ],
    distribution: [
      {
        channel: "UPI",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "upi",
      },
      {
        channel: "QRIS",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "qris",
      },
      {
        channel: "Netbanking",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "netBanking",
      },
      {
        channel: "E-wallet",
        "Member Channels": 0,
        PhonePe: 0,
        Razorpay: 0,
        BenakPay: 0,
        PayU: 0,
        Cashfree: 0,
        DOKU: 0,
        Midtrans: 0,
        Xendit: 0,
        key: "eWallet",
      },
    ],
  });

  const mapWithObject1 = (arr, obj) => {
    const temp = [...arr];
    for (const iterator of temp) {
      iterator.value = obj[iterator.key] || 0;
    }
    return temp;
  };

  const mapWithObject2 = (arr, obj) => {
    const temp = [...arr];
    for (const iterator of temp) {
      iterator["Member Channels"] = obj[iterator.key]?.memberChannel || 0;
      iterator["PhonePe"] = obj[iterator.key]?.phonepe || 0;
      iterator["Razorpay"] = obj[iterator.key]?.razorpay || 0;
      iterator["BenakPay"] =
        obj[iterator.key]?.uniqPay || obj[iterator.key]?.uniqpay || 0;
      iterator["PayU"] = obj[iterator.key]?.payU || 0;
      iterator["Cashfree"] = obj[iterator.key]?.cashfree || 0;
      iterator["DOKU"] = obj[iterator.key]?.doku || 0;
      iterator["Midtrans"] = obj[iterator.key]?.midtrans || 0;
      iterator["Xendit"] = obj[iterator.key]?.xendit || 0;
    }
    return temp;
  };

  const getAllData = async (
    orderType = null,
    startDate = "01/01/2024",
    endDate = "12/12/2030",
  ) => {
    if (!orderType)
      setLoading({ payins: true, payouts: true, withdrawls: true });
    else {
      setLoading((prev) => ({ ...prev, [orderType]: true }));
    }

    const data = await AdminOverviewAPIs.channels.all({
      startDate: startDate,
      endDate: endDate,
      mode: orderType ? orderType.toUpperCase() : null,
    });

    if (!orderType || orderType === "payins") {
      const newPayinData = {
        orders: mapWithObject1(payinData.orders, data.payins.orders),
        distribution: mapWithObject2(
          payinData.distribution,
          data.payins.distribution,
        ),
      };

      setPayinData(newPayinData);
    }

    if (!orderType || orderType === "payouts") {
      const newPayoutData = {
        orders: mapWithObject1(payinData.orders, data.payouts.orders),
        distribution: mapWithObject2(
          payinData.distribution,
          data.payouts.distribution,
        ),
      };

      setPayoutData(newPayoutData);
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
    loading,
    getDateData,
  };
};

export default useData;

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
      {
        name: "Member Channels",
        value: 0,
        color: "indigo.6",
        key: "memberChannel",
      },
      { name: "UPI Vendor", value: 0, color: "cyan.6", key: "upiVendor" },
      { name: "PhonePe", value: 0, color: "brand.6", key: "phonepe" },
      { name: "Razorpay", value: 0, color: "green.6", key: "razorpay" },
      { name: "BenakPay", value: 0, color: "orange.6", key: "uniqpay" },
      { name: "PayU", value: 0, color: "violet.6", key: "payU" },
      { name: "Cashfree", value: 0, color: "yellow.6", key: "cashfree" },
      { name: "DOKU", value: 0, color: "teal.6", key: "doku" },
      { name: "Midtrans", value: 0, color: "blue.6", key: "midtrans" },
      { name: "Xendit", value: 0, color: "pink.6", key: "xendit" },
    ],
    distribution: [
      {
        gateway: "Member Channels",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "memberChannel",
      },
      {
        gateway: "UPI Vendor",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "upiVendor",
      },
      {
        gateway: "Razorpay",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "razorpay",
      },
      {
        gateway: "PhonePe",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "phonepe",
      },
      {
        gateway: "BenakPay",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "uniqpay",
      },
      {
        gateway: "PayU",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "payU",
      },
      {
        gateway: "Cashfree",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "cashfree",
      },
      {
        gateway: "DOKU",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "doku",
      },
      {
        gateway: "Midtrans",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "midtrans",
      },
      {
        gateway: "Xendit",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "xendit",
      },
    ],
  });

  const [payoutData, setPayoutData] = useState({
    orders: [
      {
        name: "Member Channels",
        value: 0,
        color: "indigo.6",
        key: "memberChannel",
      },
      { name: "UPI Vendor", value: 0, color: "cyan.6", key: "upiVendor" },
      { name: "PhonePe", value: 0, color: "brand.6", key: "phonepe" },
      { name: "Razorpay", value: 0, color: "green.6", key: "razorpay" },
      { name: "BenakPay", value: 0, color: "orange.6", key: "uniqpay" },
      { name: "PayU", value: 0, color: "violet.6", key: "payU" },
      { name: "Cashfree", value: 0, color: "yellow.6", key: "cashfree" },
      { name: "DOKU", value: 0, color: "teal.6", key: "doku" },
      { name: "Midtrans", value: 0, color: "blue.6", key: "midtrans" },
      { name: "Xendit", value: 0, color: "pink.6", key: "xendit" },
    ],
    distribution: [
      {
        gateway: "Member Channels",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "memberChannel",
      },
      {
        gateway: "UPI Vendor",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "upiVendor",
      },
      {
        gateway: "Razorpay",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "razorpay",
      },
      {
        gateway: "PhonePe",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "phonepe",
      },
      {
        gateway: "BenakPay",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "uniqpay",
      },
      {
        gateway: "PayU",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "payU",
      },
      {
        gateway: "Cashfree",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "cashfree",
      },
      {
        gateway: "DOKU",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "doku",
      },
      {
        gateway: "Midtrans",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "midtrans",
      },
      {
        gateway: "Xendit",
        UPI: 0,
        Netbanking: 0,
        "E-wallet": 0,
        key: "xendit",
      },
    ],
  });

  const mapWithObject1 = (arr, obj) => {
    const temp = [...arr];
    for (const item of temp) {
      item.value = obj[item.key] || 0;
    }
    return temp;
  };

  const mapWithObject2 = (arr, obj) => {
    const temp = [...arr];
    for (const item of temp) {
      item["UPI"] = obj[item.key]?.upi || obj[item.key]?.qris || 0;
      item["Netbanking"] = obj[item.key]?.netBanking || 0;
      item["E-wallet"] = obj[item.key]?.eWallet || 0;
    }
    return temp;
  };

  const getAllData = async (
    orderType = null,
    startDate = null,
    endDate = null,
  ) => {
    if (!orderType)
      setLoading({ payins: true, payouts: true, withdrawls: true });
    else {
      setLoading((prev) => ({ ...prev, [orderType]: true }));
    }

    const data = await AdminOverviewAPIs.gateways.all({
      startDate: startDate ? startDate : "01/01/2024",
      endDate: endDate ? endDate : "31/12/2030",
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
    getAllData(orderType, start, end);
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

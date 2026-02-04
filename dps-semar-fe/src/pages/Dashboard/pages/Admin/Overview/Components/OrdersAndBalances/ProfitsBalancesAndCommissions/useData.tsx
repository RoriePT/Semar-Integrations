import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../../api/overview";

const useData = () => {
  const getSpan = () => (isMobile ? 12 : 2);
  const getSpan2 = () => (isMobile ? 12 : 5);
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [balances, setBalances] = useState([
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Merchant Balance",
      key: "merchantBalance",
      colSpan: getSpan(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Member Quota",
      key: "memberQuota",
      colSpan: getSpan(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Agent Balance",
      key: "agentBalance",
      colSpan: getSpan(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total System Balance",
      key: "systemBalance",
      colSpan: getSpan(),
    },
  ]);

  const [commissions, setCommissions] = useState([
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Merchant Income",
      key: "merchantIncome",
      colSpan: getSpan2(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Merchant Fees",
      key: "merchantFees",
      colSpan: getSpan2(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Member Commissions",
      key: "memberCommissions",
      colSpan: getSpan2(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Agent Commissions",
      key: "agentCommissions",
      colSpan: getSpan2(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total UPI Vendor Commission",
      key: "upiVendorCommissions",
      colSpan: getSpan2(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total Gateway Service Charge",
      key: "gatewayCharge",
      colSpan: getSpan2(),
    },
    {
      isForAmount: true,
      amount: "0",
      subHeading: "Total System Income",
      key: "systemIncome",
      colSpan: getSpan2(),
    },
  ]);

  const [graphData, setGraphData] = useState([
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
  ]);

  const mapWithObject1 = (arr, obj) => {
    const temp = [...arr];
    for (const item of temp) {
      item.amount = obj[item.key];
    }
    return temp;
  };

  const mapWithObject2 = (arr, obj) => {
    const temp = [...arr];

    for (const item of temp) {
      if (obj[item.key]) {
        item["UPI"] = obj[item.key].upi || 0;
        item["Netbanking"] = obj[item.key].netBanking || 0;
        item["E-wallet"] = obj[item.key].eWallet || 0;
      } else {
        item["UPI"] = 0;
        item["Netbanking"] = 0;
        item["E-wallet"] = 0;
      }
    }

    // Ensure all items have the correct structure for Mantine charts
    const processedData = temp.map((item) => ({
      gateway: String(item.gateway),
      UPI: Number(item["UPI"]) || 0,
      Netbanking: Number(item["Netbanking"]) || 0,
      "E-wallet": Number(item["E-wallet"]) || 0,
      key: String(item.key),
    }));

    return processedData;
  };

  const getAllData = async (start = "01/01/2024", end = "12/12/2030") => {
    setLoading(true);
    setLoading2(true);

    const data = await AdminOverviewAPIs.ordersAndBalances.profitsAndBalances({
      startDate: start,
      endDate: end,
    });

    const newBalances = mapWithObject1(balances, data.balances);
    setBalances(newBalances);

    const newCommissions = mapWithObject1(commissions, data.commissions);
    setCommissions(newCommissions);

    // const newGraphData = mapWithObject2(graphData, data.graphData);
    // setGraphData(newGraphData);

    setLoading(false);
    setLoading2(false);
  };

  const getGraphData = async (start = "01/01/2024", end = "12/12/2030") => {
    setLoading2(true);
    const data = await AdminOverviewAPIs.ordersAndBalances.profitsAndBalances({
      startDate: start,
      endDate: end,
    });

    const newGraphData = mapWithObject2(graphData, data.graphData);
    setGraphData(newGraphData);
    setLoading2(false);
  };

  useEffect(() => {
    getAllData();
    getGraphData();
  }, []);

  return {
    isMobile,
    isTablet,
    balances,
    commissions,
    graphData,
    loading,
    loading2,
    getGraphData,
    getAllData,
  };
};

export default useData;

import { ScrollArea, SegmentedControl, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import Ewallet from "./Components/Channels/Ewallet";
import NetBanking from "./Components/Channels/NetBanking";
import TotalOrders from "./Components/Channels/TotalOrders";
import Upi from "./Components/Channels/Upi";
import AllGateways from "./Components/Gateways/AllGateways";
import Cashfree from "./Components/Gateways/Cashfree";
import MemberChannel from "./Components/Gateways/MemberChannel";
import PayU from "./Components/Gateways/PayU";
import Phonepe from "./Components/Gateways/Phonepe";
import Razorpay from "./Components/Gateways/Razorpay";
import Uniqpay from "./Components/Gateways/Uniqpay";
import UpiVendor from "./Components/Gateways/UpiVendor";
import PayinOrders from "./Components/OrdersAndBalances/PayinOrders";
import PayoutOrders from "./Components/OrdersAndBalances/PayoutOrders";
import ProfitsBalancesAndCommissions from "./Components/OrdersAndBalances/ProfitsBalancesAndCommissions";
import SettlementOrders from "./Components/OrdersAndBalances/SettlementOrders";
import TopUpOrders from "./Components/OrdersAndBalances/TopUpOrders";
import WithdrawalOrders from "./Components/OrdersAndBalances/WithdrawalOrders";
import UserAnalytics from "./Components/UserAnalytics";

const Overview = () => {
  const [value, setValue] = useState("orders");
  const [activeTab, setActiveTab] = useState<string | null>("profits");

  useEffect(() => {
    if (value === "orders") setActiveTab("profits");
    if (value === "gateways") setActiveTab("all");
    if (value === "channels") setActiveTab("allChannels");
  }, [value]);

  return (
    <>
      <ScrollArea
        type="hover"
        offsetScrollbars
        scrollbarSize="5px"
        style={{ width: "100%", flexGrow: 1 }}
      >
        <SegmentedControl
          color="#A85706"
          value={value}
          onChange={setValue}
          data={[
            { label: "Orders & Balances", value: "orders" },
            { label: "Gateways", value: "gateways" },
            { label: "Channels", value: "channels" },
            { label: "User Analytics", value: "analytics" },
          ]}
        />
      </ScrollArea>
      {value === "orders" && (
        <Tabs defaultValue="profits" onChange={setActiveTab} pt="26">
          <ScrollArea
            type="hover"
            offsetScrollbars
            scrollbarSize="5px"
            style={{ width: "100%", flexGrow: 1 }}
          >
            <Tabs.List style={{ flexWrap: "nowrap", paddingLeft: "26px" }}>
              <Tabs.Tab value="profits">
                Profits, Balances and Commissions
              </Tabs.Tab>
              <Tabs.Tab value="payins">Payin Orders</Tabs.Tab>
              <Tabs.Tab value="payouts">Payout Orders</Tabs.Tab>
              <Tabs.Tab value="withdrawals">Withdrawal Orders</Tabs.Tab>
              <Tabs.Tab value="topups">Topup Orders</Tabs.Tab>
              <Tabs.Tab value="settlements">Settlement Orders</Tabs.Tab>
            </Tabs.List>
          </ScrollArea>

          <Tabs.Panel value={activeTab}>
            {activeTab === "profits" && <ProfitsBalancesAndCommissions />}
            {activeTab === "payins" && <PayinOrders />}
            {activeTab === "payouts" && <PayoutOrders />}
            {activeTab === "withdrawals" && <WithdrawalOrders />}
            {activeTab === "topups" && <TopUpOrders />}
            {activeTab === "settlements" && <SettlementOrders />}
          </Tabs.Panel>
        </Tabs>
      )}

      {value === "gateways" && (
        <Tabs defaultValue="all" onChange={setActiveTab} pt="26">
          <ScrollArea
            type="hover"
            offsetScrollbars
            scrollbarSize="5px"
            style={{ width: "100%", flexGrow: 1 }}
          >
            <Tabs.List style={{ flexWrap: "nowrap", paddingLeft: "26px" }}>
              <Tabs.Tab value="all">All Gateways</Tabs.Tab>
              <Tabs.Tab value="memberChannel">Member Channels</Tabs.Tab>
              <Tabs.Tab value="upiVendor">UPI Vendor</Tabs.Tab>
              <Tabs.Tab value="phonepe">Phonepe</Tabs.Tab>
              <Tabs.Tab value="razorpay">Razorpay</Tabs.Tab>
              <Tabs.Tab value="uniqpay">BenakPay</Tabs.Tab>
              <Tabs.Tab value="payu">PayU</Tabs.Tab>
              <Tabs.Tab value="cashfree">Cashfree</Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
          <Tabs.Panel value={activeTab}>
            {activeTab === "all" && <AllGateways />}
            {activeTab === "memberChannel" && <MemberChannel />}
            {activeTab === "upiVendor" && <UpiVendor />}
            {activeTab === "phonepe" && <Phonepe />}
            {activeTab === "razorpay" && <Razorpay />}
            {activeTab === "uniqpay" && <Uniqpay />}
            {activeTab === "payu" && <PayU />}
            {activeTab === "cashfree" && <Cashfree />}
          </Tabs.Panel>
        </Tabs>
      )}

      {value === "channels" && (
        <Tabs defaultValue="allChannels" onChange={setActiveTab} pt="26">
          <ScrollArea
            type="hover"
            offsetScrollbars
            scrollbarSize="5px"
            style={{ width: "100%", flexGrow: 1 }}
          >
            <Tabs.List style={{ flexWrap: "nowrap", paddingLeft: "26px" }}>
              <Tabs.Tab value="allChannels">All Channels</Tabs.Tab>
              <Tabs.Tab value="upi">UPI</Tabs.Tab>
              <Tabs.Tab value="netBanking">Netbanking</Tabs.Tab>
              <Tabs.Tab value="eWallet">E-Wallet</Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
          <Tabs.Panel value={activeTab}>
            {activeTab === "allChannels" && <TotalOrders />}
            {activeTab === "upi" && <Upi />}
            {activeTab === "netBanking" && <NetBanking />}
            {activeTab === "eWallet" && <Ewallet />}
          </Tabs.Panel>
        </Tabs>
      )}

      {value === "analytics" && <UserAnalytics />}
    </>
  );
};

export default Overview;

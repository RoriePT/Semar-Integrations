import { useEffect, useState } from "react";

import { Tabs } from "@mantine/core";

import usePagination from "../../../../../hook/usePagination";
import PayoutUsers from "./Users";
import AllPayouts from "./AllPayouts";

const PayoutOrders = () => {
  const [activeTab, setActiveTab] = useState("payouts");

  const { triggerReload } = usePagination({
    table: activeTab === "payouts" ? "payout/merchant" : "payout/merchant",
  });

  useEffect(() => {
    triggerReload();
  }, [activeTab]);

  return (
    <>
      <Tabs
        defaultValue="payouts"
        variant="outline"
        bg="white"
        h={"100%"}
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List mb={"xs"}>
          <Tabs.Tab value="payouts" p={"md"}>
            All Payouts
          </Tabs.Tab>
          {/* <Tabs.Tab value="users" p={"md"}>
            User Channels
          </Tabs.Tab> */}
        </Tabs.List>

        <Tabs.Panel value="payouts" h={"100%"}>
          <AllPayouts />
        </Tabs.Panel>

        <Tabs.Panel value="users" h={"100%"}>
          <PayoutUsers />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default PayoutOrders;

import React, { useEffect, useState } from "react";
import PendingPayouts from "./Pending";
import AllPayouts from "./AllPayouts";
import { Tabs } from "@mantine/core";
import usePagination from "../../../../../../hook/usePagination";

const Payouts = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const [reload, setReload] = useState(false);

  useEffect(() => {
    setReload((prev) => !prev);
  }, [activeTab]);

  return (
    <>
      <Tabs
        defaultValue="pending"
        variant="outline"
        bg="white"
        h={"100%"}
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List mb={"xs"}>
          <Tabs.Tab value="pending" p={"md"}>
            To be Verified
          </Tabs.Tab>
          <Tabs.Tab value="all" p={"md"}>
            All Payouts
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" h={"100%"}>
          <PendingPayouts reload={reload} />
        </Tabs.Panel>

        <Tabs.Panel value="all" h={"100%"}>
          <AllPayouts reload={reload} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Payouts;

import { Tabs } from "@mantine/core";
import PendingWithdrawals from "./Pending";
import AllWithdrawals from "./AllWithdrawals";
import { useEffect, useState } from "react";
import usePagination from "../../../../../../hook/usePagination";

const WithdrawalOrders = () => {
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
            Pending Withdrawals
          </Tabs.Tab>
          <Tabs.Tab value="all" p={"md"}>
            All Withdrawals
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="pending" h={"100%"}>
          <PendingWithdrawals reload={reload} />
        </Tabs.Panel>

        <Tabs.Panel value="all" h={"100%"}>
          <AllWithdrawals reload={reload} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default WithdrawalOrders;

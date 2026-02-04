import { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import AllUsers from "./AllUsers";
import Alerts from "./Alerts";

const EndUsers = () => {
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
            All Users
          </Tabs.Tab>
          <Tabs.Tab value="all" p={"md"}>
            Alerts
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" h={"100%"}>
          <AllUsers reload={reload} />
        </Tabs.Panel>

        <Tabs.Panel value="all" h={"100%"}>
          <Alerts />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default EndUsers;

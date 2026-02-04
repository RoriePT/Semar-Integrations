import React, { useEffect, useState } from "react";
import AllPayins from "./AllPayins";
import MismatchedUtrPayins from "./MismatchedUtrPayins";
import { Box, Tabs } from "@mantine/core";
import { FaExclamationCircle } from "react-icons/fa";
import CommonAPIs from "../../../../../../api/common";

const Payins = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [reload, setReload] = useState(false);
  const [mismatchedCount, setMismatchedCount] = useState(0);

  useEffect(() => {
    setReload((prev) => !prev);
  }, [activeTab]);

  const fetchMismatchedCount = async () => {
    try {
      const data = await CommonAPIs.paginate(
        "admin/paginate/mismatched-utr",
        {
          pageSize: 1,
          pageNumber: 1,
          search: "",
          sortBy: "latest",
          startDate: undefined,
          endDate: undefined,
          userId: undefined,
          status: "",
          userEmail: undefined,
        },
        "",
        true
      );
      if (data && data.total !== undefined) {
        setMismatchedCount(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch mismatched count:", error);
    }
  };

  useEffect(() => {
    fetchMismatchedCount();
    // Refresh count periodically
    const interval = setInterval(fetchMismatchedCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Refresh count when switching to mismatched tab or on reload
    if (activeTab === "mismatched") {
      fetchMismatchedCount();
    }
  }, [activeTab, reload]);

  return (
    <>
      <Tabs
        defaultValue="all"
        variant="outline"
        bg="white"
        h={"100%"}
        value={activeTab}
        onChange={setActiveTab}
      >
        <Tabs.List mb={"xs"}>
          <Tabs.Tab value="all" p={"md"}>
            All Payins
          </Tabs.Tab>
          <Tabs.Tab value="mismatched" p={"md"}>
            <Box style={{ position: "relative", display: "inline-block", paddingRight: "24px" }}>
              UTR Mismatched Pending Orders
              {mismatchedCount > 0 && (
                <Box
                  style={{
                    position: "absolute",
                    top: -4,
                    right: 0,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    color: "white",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FaExclamationCircle size={12} />
                </Box>
              )}
            </Box>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" h={"100%"}>
          <AllPayins reload={reload} />
        </Tabs.Panel>

        <Tabs.Panel value="mismatched" h={"100%"}>
          <MismatchedUtrPayins reload={reload} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Payins;

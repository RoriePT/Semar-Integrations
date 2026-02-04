import { Flex, Tabs } from "@mantine/core";
import PendingOrders from "./PendingOrders";
import GrabOrders from "./GrabOrders";
import PayinModal from "../../../../../components/OrderModals/PayinModals";
import PayoutModal from "../../../../../components/OrderModals/PayoutModals";
import TopUpModal from "../../../../../components/OrderModals/TopUpModals";
import { useEffect, useState } from "react";
import usePagination from "../../../../../hook/usePagination";
import { useMediaQuery } from "@mantine/hooks";
import { useDashboardUser } from "../../../DashboardProvider";

const BulletinBoard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reload, setReload] = useState(false);
  const tablet = useMediaQuery("(max-width:1300px)");
  const { notifications } = useDashboardUser();

  useEffect(() => {
    setReload((prev) => !prev);
  }, [notifications]);

  const handleView = (order) => {
    setReload((prev) => !prev);
    setSelectedOrder(order);
  };

  // const [activeTab, setActiveTab] = useState("grab");

  // const { triggerReload } = usePagination({
  //   table:
  //     activeTab === "grab"
  //       ? "bulletin"
  //       : activeTab === "payins"
  //       ? "payin/member"
  //       : "bulletin",
  // });

  // useEffect(() => {
  //   triggerReload();
  // }, [activeTab]);

  return (
    <>
      <Flex
        align={"stretch"}
        justify={"space-between"}
        gap={"md"}
        w={"100%"}
        mih={"100%"}
        direction={tablet ? "column" : "row"}
      >
        <GrabOrders
          handleGrab={handleView}
          reload={reload}
          setReload={setReload}
        />
        <PendingOrders handleView={handleView} reload={reload} />
      </Flex>

      {selectedOrder?.type === "payin" && (
        <PayinModal
          mode={"member"}
          opened={selectedOrder?.type === "payin"}
          orderId={selectedOrder?.systemOrderId}
          close={() => {
            setSelectedOrder(null);
            setReload((prev) => !prev);
          }}
        />
      )}

      {selectedOrder?.type === "payout" && (
        <PayoutModal
          mode={"member"}
          opened={selectedOrder?.type === "payout"}
          orderId={selectedOrder?.systemOrderId}
          close={() => {
            setSelectedOrder(null);
            setReload((prev) => !prev);
          }}
          handlers={{
            close: () => {
              setSelectedOrder(null);
            },
          }}
          triggerReload={() => {
            setReload((prev) => !prev);
          }}
        />
      )}

      {selectedOrder?.type === "topup" && (
        <TopUpModal
          opened={selectedOrder?.type === "topup"}
          close={() => {
            setSelectedOrder(null);
            setReload((prev) => !prev);
          }}
          mode="user"
          orderId={selectedOrder?.systemOrderId}
          handlers={{
            close: () => {
              setSelectedOrder(null);
              setReload((prev) => !prev);
            },
          }}
          triggerReload={() => {
            setReload((prev) => !prev);
          }}
        />
      )}
    </>
  );
};

export default BulletinBoard;

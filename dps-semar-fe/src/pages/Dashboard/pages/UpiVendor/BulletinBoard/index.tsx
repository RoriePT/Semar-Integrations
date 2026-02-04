import { Box, Flex } from "@mantine/core";
import PendingOrders from "./PendingOrders";
import PendingSettlementOrders from "./PendingSettlementOrders";
import PayinModal from "../../../../../components/OrderModals/PayinModals";
import SettlementModal from "./SettlementModal";
import { useEffect, useState } from "react";
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

  return (
    <>
      <Flex
        align={"stretch"}
        justify={"flex-start"}
        gap={"md"}
        w={"100%"}
        h={"100%"}
        direction={tablet ? "column" : "row"}
        style={{ overflow: "hidden" }}
      >
        {/* Left Side - Pending Settlement Orders (50%) */}
        <Box style={{ 
          width: tablet ? "100%" : "50%", 
          height: "100%",
          overflow: "hidden",
          flexShrink: 0
        }}>
          <PendingSettlementOrders handleView={handleView} reload={reload} />
        </Box>

        {/* Right Side - Pending Payin Orders (50%) */}
        <Box style={{ 
          width: tablet ? "100%" : "50%", 
          height: "100%",
          overflow: "hidden",
          flexShrink: 0
        }}>
          <PendingOrders handleView={handleView} reload={reload} />
        </Box>
      </Flex>

      {/* Payin Modal */}
      {selectedOrder?.type === "payin" && (
        <PayinModal
          mode={"upi-vendor"}
          opened={selectedOrder?.type === "payin"}
          orderId={selectedOrder?.systemOrderId}
          close={() => {
            setSelectedOrder(null);
            setReload((prev) => !prev);
          }}
          reload={() => setReload((prev) => !prev)}
        />
      )}

      {/* Settlement Modal */}
      {selectedOrder?.type === "settlement" && (
        <SettlementModal
          opened={selectedOrder?.type === "settlement"}
          orderId={selectedOrder?.id}
          close={() => {
            setSelectedOrder(null);
            setReload((prev) => !prev);
          }}
        />
      )}
    </>
  );
};

export default BulletinBoard;


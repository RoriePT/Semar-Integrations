import React, { useEffect, useState } from "react";
import PayoutModal from "../../../../../../components/OrderModals/PayoutModals";
import PayinModal from "../../../../../../components/OrderModals/PayinModals";
import TableLayout from "../../../../../../components/TableLayout2";
import { ActionIcon, Badge, Button, Table } from "@mantine/core";
import usePagination from "../../../../../../hook/usePagination";
import { useNavigate } from "react-router-dom";
import { useDashboardUser } from "../../../../DashboardProvider";
import { getMemberBulletinPayins } from "../../../../../../api/DummyOrders/Paginate";
import { FaListAlt } from "react-icons/fa";
import { getMemberBulletinGrabOrders } from "../../../../../../api/bulletin";

const GrabOrders = ({ handleGrab }) => {
  const { userData } = useDashboardUser();

  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getMemberBulletinGrabOrders(userData?.id);
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userData?.id]);

  const columns = ["Order Type", "Amount", "Commission", , "Channel", ""];

  const grabOrder = (order) => {
    //  api
    // reload
    handleGrab(order);
  };

  const mappedRows = rows.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Badge variant="filled" radius={"sm"} fullWidth color="gray.6">
          {row.type}
        </Badge>
      </Table.Td>

      <Table.Td>₹{row.amount}</Table.Td>

      <Table.Td>₹{row.commission}</Table.Td>

      <Table.Td>
        <Badge fullWidth variant="light" fw={400} color="black">
          {row.channel}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Button size="xs" onClick={() => grabOrder(row)}>
          Grab
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"Grab Orders"}
        subtext={"Grab Payout and Topup orders to credit your quota"}
        showAddBtn={false}
        addBtnText={""}
        addBtnHandler={null}
        showDownloadBtn={false}
        showSearch={false}
        searchPlaceholder={null}
        showDateRange={false}
        showFilter={false}
        showSort={false}
        showStatus={false}
        showReload={false}
        showPagination={false}
        columns={columns}
        rows={mappedRows}
        loading={loading}
        search={null}
        handleSearch={null}
        startDate={null}
        handleStartDate={() => {}}
        endDate={null}
        handleEndDate={() => {}}
        handleReload={() => {}}
        totalPages={null}
        pageNumber={null}
        handleSetCurrentPage={() => {}}
        pageSize={null}
        handleSetPageSize={() => {}}
        startRecord={null}
        endRecord={null}
        totalRecords={null}
        sortBy={null}
        setSortBy={() => {}}
        fullHeight={false}
      />

      {/* <PayinModal
        mode={"member"}
        opened={opened}
        orderId={orderId}
        close={() => {
          setOpened(false);
          triggerReload();
        }}
      /> */}
    </>
  );
};

export default GrabOrders;

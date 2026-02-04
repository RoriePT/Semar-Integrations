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
import { getMemberBulletinPendingOrders } from "../../../../../../api/bulletin";

const PendingOrders = ({ handleView, reload }) => {
  const { userData } = useDashboardUser();

  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getMemberBulletinPendingOrders(userData?.id);
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [userData?.id, reload]);

  const columns = ["Order Type", "Amount", "Commission", , "Channel", ""];

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
        <ActionIcon onClick={() => handleView(row)}>
          <FaListAlt />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TableLayout
        table={"admin"}
        headerText={"Pending Order Actions"}
        subtext={"Manage your pending Payin, Payout and Topup orders."}
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
          reload();
        }}
      /> */}
    </>
  );
};

export default PendingOrders;

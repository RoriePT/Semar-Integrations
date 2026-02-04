import { useEffect, useState } from "react";
import ModalLayout from "../../../../../../components/ModalLayout";
import { Badge, Center, Modal, Table, Title } from "@mantine/core";
import CopyButton from "../../../../../../components/CopyButton";
import moment from "moment";
import {
  getFullName,
  getReferralStatusColor,
} from "../../../../../../utils/helpers";
import CommonAPIs from "../../../../../../api/common";

const ReferralModal = ({ opened, close, teamId }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchCodesData = async () => {
      const response = await CommonAPIs.getReferralCodesList(teamId);
      setRows(response);
    };
    fetchCodesData();
  }, [teamId]);

  const mappedRows = rows?.map((row, index) => {
    return (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <Center>
            <span>{row.referralCode}</span>
            <CopyButton value={row.referralCode} />
          </Center>
        </Table.Td>

        <Table.Td>
          <Badge variant="dot" color={getReferralStatusColor(row.status)}>
            {row.status}
          </Badge>
        </Table.Td>
        <Table.Td>{getFullName(row.referredMember)}</Table.Td>
        <Table.Td>{getFullName(row.member)}</Table.Td>
      </Table.Tr>
    );
  });

  const columns = [
    "SNo.",
    "Code",
    "Status",
    // "Created on",
    "Referee",
    "Created by",
  ];

  const body = (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {columns.map((item) => (
            <Table.Th>{item}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{mappedRows}</Table.Tbody>
    </Table>
  );

  return (
    <>
      <ModalLayout
        opened={opened}
        close={close}
        header={<Title order={4}>Referral codes</Title>}
        body={body}
        footer={""}
        size="xl"
      />
    </>
  );
};

export default ReferralModal;

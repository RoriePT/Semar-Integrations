import { Accordion, Badge } from "@mantine/core";
import InfoRow from "../../../../../../../components/InfoRow";
import { formatDateIST } from "../../../../../../../utils";

const SettlementInfo = ({ data }) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "grape",
      submitted: "yellow",
      approved: "brand",
      completed: "green",
      rejected: "red",
    };

    return (
      <Badge color={statusColors[status?.toLowerCase()] || "gray"} size="md">
        {status?.toLowerCase() || "N/A"}
      </Badge>
    );
  };

  return (
    <Accordion.Item value="settlement-info">
      <Accordion.Control>Settlement Information</Accordion.Control>
      <Accordion.Panel>
        <InfoRow label="System Order ID" value={data?.systemOrderId || "N/A"} />
        <InfoRow label="Status" value={getStatusBadge(data?.status)} />
        <InfoRow
          label="Settlement Amount"
          value={`₹${data?.settlementAmount || 0}`}
        />
        <InfoRow label="Paid Amount" value={`₹${data?.paidAmount || 0}`} />
        <InfoRow
          label="Remaining Amount"
          value={`₹${data?.remainingAmount || 0}`}
        />
        <InfoRow label="Transaction ID" value={data?.transactionId || "N/A"} />
        <InfoRow
          label="Created At"
          value={formatDateIST(data?.createdAt) || "N/A"}
        />
        {data?.updatedAt && (
          <InfoRow
            label="Updated At"
            value={formatDateIST(data?.updatedAt) || "N/A"}
          />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default SettlementInfo;

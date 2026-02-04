import { Box, Button, Divider, Flex } from "@mantine/core";
import { useState } from "react";
import InfoRow from "../../../InfoRow";
import Tree from "../../../Tree";
import { useDisclosure } from "@mantine/hooks";
import { formatDateIST } from "../../../../utils";

const Merchant = ({ userDetails }) => {
  const [opened, handlers] = useDisclosure();
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  return (
    <>
      <Flex justify={"space-between"}>
        <Box>
          <InfoRow label="Name" value={userDetails?.name} />
          <InfoRow label="Email" value={userDetails?.email} />
          <InfoRow
            label="Registered on"
            value={formatDateIST(userDetails?.joinedOn)}
          />
          <InfoRow label="Referrer Agent" value={userDetails?.referral} />
        </Box>
        <Box>
          <InfoRow label="Role" value={userDetails?.role} />
          <InfoRow label="Phone" value={userDetails?.phone} />
          <InfoRow
            label="Status"
            value={userDetails?.status ? "ENABLED" : "DISABLED"}
          />
        </Box>
      </Flex>

      {userDetails?.organizationId && (
        <Flex gap={"md"} direction={"column"} mt={"md"}>
          <InfoRow
            label="Organisation Id"
            value={userDetails?.organizationId}
          />
          <Button
            size="xs"
            maw={"200px"}
            onClick={() => {
              handlers.open();
              setSelectedTeamId(userDetails?.organizationId);
            }}
          >
            View Organisation
          </Button>
        </Flex>
      )}

      <Divider my={"md"} />

      <InfoRow label="Balance" value={`₹${userDetails?.balance}`} />
      <InfoRow label="Payin Income" value={`₹${userDetails?.payinIncome}`} />
      <InfoRow label="Payin Service Fee" value={`₹${userDetails?.payinFee}`} />
      <InfoRow label="Payout Amount" value={`₹${userDetails?.payoutAmount}`} />
      <InfoRow
        label="Payout Service Fee"
        value={`₹${userDetails?.payoutFee}`}
      />
      <InfoRow
        label="Withdrawn Amount"
        value={`₹${userDetails?.withdrawanAmount}`}
      />
      <InfoRow
        label="Withdrawal Service Fee"
        value={`₹${userDetails?.withdrawalFee}`}
      />
      <InfoRow label="Frozen Amount" value={`₹${userDetails?.frozenAmount}`} />

      <Tree
        opened={opened}
        close={() => {
          handlers.close();
          setSelectedTeamId(null);
        }}
        type={"agents"}
        forUser="admin"
        teamId={selectedTeamId}
      />
    </>
  );
};

export default Merchant;

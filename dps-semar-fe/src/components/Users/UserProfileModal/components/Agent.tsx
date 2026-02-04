import { useState } from "react";
import InfoRow from "../../../InfoRow";
import { Box, Button, Divider, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Tree from "../../../Tree";
import { formatDateIST } from "../../../../utils";

const Agent = ({ userDetails }) => {
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
      <InfoRow
        label="No. of Referrals"
        value={`${userDetails?.referralsCount}`}
      />
      <InfoRow
        label="Referral Commissions"
        value={`₹${userDetails?.referralCommissions}`}
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

export default Agent;

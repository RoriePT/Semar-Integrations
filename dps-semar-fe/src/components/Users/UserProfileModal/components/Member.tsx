import { Box, Button, Divider, Flex } from "@mantine/core";
import { useState } from "react";
import InfoRow from "../../../InfoRow";
import { useDisclosure } from "@mantine/hooks";
import Tree from "../../../Tree";
import { formatDateIST } from "../../../../utils";

const Member = ({ userDetails }) => {
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

      {userDetails?.teamId && (
        <Flex gap={"md"} direction={"column"} mt={"md"}>
          <InfoRow label="Team Id" value={userDetails?.teamId} />
          <Button
            size="xs"
            maw={"200px"}
            onClick={() => {
              handlers.open();
              setSelectedTeamId(userDetails?.teamId);
            }}
          >
            View Team
          </Button>
        </Flex>
      )}

      <Divider my={"md"} />

      <InfoRow label="Quota" value={`₹${userDetails?.quota}`} />
      <InfoRow
        label="No. of Referrals"
        value={userDetails?.referralsCount || "0"}
      />
      <InfoRow
        label="Payin Commissions"
        value={`₹${userDetails?.payinCommissions}`}
      />
      <InfoRow
        label="Payout Commissions"
        value={`₹${userDetails?.payoutCommissions}`}
      />
      <InfoRow
        label="Topup Commissions"
        value={`₹${userDetails?.topupCommissions}`}
      />
      <InfoRow
        label="Referral Commissions"
        value={`₹${userDetails?.referralCommissions}`}
      />

      <Tree
        opened={opened}
        close={() => {
          handlers.close();
          setSelectedTeamId(null);
        }}
        type={"members"}
        forUser="admin"
        teamId={selectedTeamId}
      />
    </>
  );
};

export default Member;

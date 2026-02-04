import { useState } from "react";
import { Badge, Flex, Modal, SegmentedControl, Title } from "@mantine/core";
import InfoRow from "../../../../../../components/InfoRow";
import CopyButton from "../../../../../../components/CopyButton";
import {
  getFullName,
  getReferralStatusColor,
} from "../../../../../../utils/helpers";
import { useMediaQuery } from "@mantine/hooks";

const ReferralCodeView = ({ opened, close, isForAgent, data }) => {
  const [value, setValue] = useState<string>("referrer");
  const isTablet = useMediaQuery("(min-width: 768px)");

  return (
    <Modal
      centered
      opened={opened}
      onClose={close}
      title="Referral code details"
    >
      <Flex align={"center"} gap={"5px"}>
        <InfoRow label={"Referral Code"} value={data.referralCode} />
        <CopyButton value={data.referralCode} />
      </Flex>

      {!isForAgent && (
        <>
          <InfoRow label={"Referrer"} value={getFullName(data.member)} />
          <InfoRow
            label={"Referrer Email"}
            value={data.member?.identity?.email || "None"}
          />
        </>
      )}

      <InfoRow label={"Referee"} value={getFullName(data.referredMember)} />
      <InfoRow
        label={"Referee Email"}
        value={data.referredMember?.identity?.email || "None"}
      />

      <Flex gap={"xs"} align={"center"} my={"md"}>
        <Title order={5}>Status: </Title>
        <Badge variant="dot" color={getReferralStatusColor(data.status)}>
          {data.status}
        </Badge>
      </Flex>

      <SegmentedControl
        w={"100%"}
        my={"md"}
        value={value}
        onChange={(v) => setValue(v)}
        orientation={isTablet ? "horizontal" : "vertical"}
        data={[
          {
            label: isForAgent ? "Your Commissions" : "Referrer Commissions",
            value: "referrer",
          },
          { label: "Referee Commissions", value: "referee" },
        ]}
      />

      {value === "referrer" && (
        <>
          <InfoRow
            label={"Payin commission rate"}
            value={data.payinCommission + "%"}
          />
          <InfoRow
            label={"Payout commission rate"}
            value={data.payoutCommission + "%"}
          />
          <InfoRow
            label={"Top-up commission rate"}
            value={data.topupCommission + "%"}
          />
        </>
      )}

      {value === "referee" && (
        <>
          <InfoRow
            label={"Payin commission rate"}
            value={data.referredMemberPayinCommission + "%"}
          />
          <InfoRow
            label={"Payout commission rate"}
            value={data.referredMemberPayoutCommission + "%"}
          />
          <InfoRow
            label={"Top-up commission rate"}
            value={data.referredMemberTopupCommission + "%"}
          />
        </>
      )}
    </Modal>
  );
};

export default ReferralCodeView;

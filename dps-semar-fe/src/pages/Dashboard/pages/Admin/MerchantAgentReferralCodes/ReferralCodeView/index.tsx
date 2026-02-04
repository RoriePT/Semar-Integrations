import { useState } from "react";
import {
  Badge,
  Divider,
  Flex,
  Modal,
  SegmentedControl,
  Title,
} from "@mantine/core";
import InfoRow from "../../../../../../components/InfoRow";
import CopyButton from "../../../../../../components/CopyButton";
import {
  getFullName,
  getReferralStatusColor,
} from "../../../../../../utils/helpers";
import { useMediaQuery } from "@mantine/hooks";

const ReferralCodeView = ({ opened, close, isForAgent, data }) => {
  let referralType = data.agentType || "agent";
  const referee =
    data.agentType === "merchant" ? data.referredMerchant : data.referredAgent;
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
      <InfoRow
        label={"Referral Type"}
        value={referralType === "agent" ? "For Agent" : "For Merchant"}
      />

      {!isForAgent && (
        <>
          <InfoRow
            label={"Referrer"}
            value={data.agent?.firstName + " " + data.agent?.lastName}
          />
          <InfoRow
            label={"Referrer Email"}
            value={data.agent?.identity?.email}
          />
        </>
      )}

      <InfoRow label={"Referee"} value={getFullName(referee)} />
      <InfoRow
        label={"Referee Email"}
        value={referee?.identity?.email || "None"}
      />

      <Flex gap={"xs"} align={"center"} my={"md"}>
        <Title order={5}>Status: </Title>
        <Badge variant="dot" color={getReferralStatusColor(data.status)}>
          {data.status}
        </Badge>
      </Flex>

      {referralType === "agent" && (
        <>
          <Divider my={"md"} />

          <Title order={5} td={"underline"}>
            {isForAgent ? <>Your commissions: </> : <>Referrer commissions: </>}
          </Title>
        </>
      )}

      {referralType === "merchant" && (
        <SegmentedControl
          w={"100%"}
          mb={"md"}
          value={value}
          orientation={isTablet ? "horizontal" : "vertical"}
          onChange={(v) => setValue(v)}
          data={[
            {
              label: isForAgent ? "Your Commissions" : "Referrer Commissions",
              value: "referrer",
            },
            { label: "Referee Service Rates", value: "referee" },
          ]}
        />
      )}

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
        </>
      )}
      {value === "referee" && (
        <>
          <InfoRow
            label={"Payin service rate"}
            value={data.merchantPayinServiceRate + "%"}
          />
          <InfoRow
            label={"Payout service rate"}
            value={data.merchantPayoutServiceRate + "%"}
          />
        </>
      )}
    </Modal>
  );
};

export default ReferralCodeView;

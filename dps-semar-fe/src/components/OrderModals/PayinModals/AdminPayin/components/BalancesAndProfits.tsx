import { Badge, Box, Divider, Flex, Text } from "@mantine/core";
import React from "react";

const Merchant = ({
  name,
  serviceRate,
  serviceFee,
  balanceEarned,
  balanceBefore,
  balanceAfter,
}) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>{name}</Text>
        <Badge size="xs" color="gray.6">
          Merchant
        </Badge>
      </Flex>

      <Flex mt={"2px"} justify={"space-between"}>
        <Box>
          <Text size="xs">
            Service Fee: ₹{serviceFee} ({serviceRate})
          </Text>

          <Text size="xs">Balance before: ₹{balanceBefore}</Text>
        </Box>
        <Box>
          <Text size="xs">Balance earned: ₹{balanceEarned}</Text>
          <Text size="xs">Balance after: ₹{balanceAfter}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

const Member = ({
  name,
  commissionRate,
  commissionAmount,
  quotaDeducted,
  quotaBefore,
  quotaAfter,
}) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>{name}</Text>
        <Badge size="xs" color="gray.6">
          Member
        </Badge>
      </Flex>

      <Flex mt={"2px"} justify={"space-between"}>
        <Box>
          <Text size="xs">
            Commission: ₹{commissionAmount} ({commissionRate})
          </Text>
          <Text size="xs">Quota before: ₹{quotaBefore}</Text>
        </Box>
        <Box>
          <Text size="xs">Quota deducted: ₹{quotaDeducted}</Text>
          <Text size="xs">Quota after: ₹{quotaAfter}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

const Agent = ({
  isMember,
  agentOf,
  name,
  commissionRate,
  commissionAmount,
  balanceBefore,
  balanceAfter,
}) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>{name}</Text>
        <Badge size="xs" color="gray.6">
          {isMember ? "Member agent" : "Merchant agent"}
        </Badge>
      </Flex>
      <Text size="xs" c={"dimmed"}>
        Agent of {agentOf}
      </Text>

      <Box mt={"2px"}>
        <Text size="xs">
          Commission: ₹{commissionAmount} ({commissionRate})
        </Text>

        <Flex justify={"space-between"}>
          <Text size="xs">
            {isMember ? "Quota" : "Balance"} before: ₹{balanceBefore}
          </Text>
          <Text size="xs">
            {isMember ? "Quota" : "Balance"} after: ₹{balanceAfter}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

const UpiVendor = ({
  name,
  commissionRate,
  commissionAmount,
  rateText,
  upiId,
  upiTitle,
  commissionBefore,
  commissionAfter,
}) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>{name}</Text>
        <Badge size="xs" color="cyan.6">
          UPI Vendor
        </Badge>
      </Flex>

      <Flex mt={"2px"} justify={"space-between"}>
        <Box>
          <Text size="xs">
            Commission Earned: ₹{commissionAmount} ({rateText || `${commissionRate}%`})
          </Text>
          {upiId && (
            <Text size="xs" mt="xs">
              UPI ID: {upiId} {upiTitle && `(${upiTitle})`}
            </Text>
          )}
        </Box>
      </Flex>
      <Flex mt={"2px"} justify={"space-between"}>
        <Text size="xs">Commission before: ₹{commissionBefore || 0}</Text>
        <Text size="xs">Commission after: ₹{commissionAfter || 0}</Text>
      </Flex>
    </Box>
  );
};

const Gateway = ({ name, upstreamRate, upstreamFee }) => {
  return (
    <Box>
      <Flex justify={"space-between"}>
        <Text fw={600}>Gateway Fee</Text>
        <Badge size="xs" color="gray.6">
          Gateway
        </Badge>
      </Flex>

      <Flex mt={"2px"} justify={"space-between"}>
        <Text size="xs">
          Upstream fee: ₹{upstreamFee} ({upstreamRate}% of total payin amount)
        </Text>
      </Flex>
    </Box>
  );
};

const System = ({ profit, balanceBefore, balanceAfter }) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>System Profit</Text>
      </Flex>

      <Box mt={"2px"}>
        <Text size="xs">
          Profit: ₹{profit} (After all commissions and cuts)
        </Text>

        <Flex justify={"space-between"}>
          <Text size="xs">Balance before: ₹{balanceBefore}</Text>
          <Text size="xs">Balance after: ₹{balanceAfter}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

const BalancesAndProfits = ({ status, data }) => {
  return (
    <>
      {status !== "complete" && (
        <Text size="xs" c={"dimmed"} mb={"md"}>
          <span
            style={{
              display: "inline-block",
              fontWeight: 500,
              color: "black",
              marginRight: "4px",
            }}
          >
            Note:
          </span>
          These profits, commissions and balance updates will not be final until
          the order is not complete
        </Text>
      )}

      {data.map((details) => {
        if (details.role === "merchant") {
          return (
            <>
              <Merchant
                name={details.name}
                serviceRate={details.rateText}
                serviceFee={details.serviceFee}
                balanceEarned={details.balanceEarned}
                balanceBefore={details.balanceBefore}
                balanceAfter={details.balanceAfter}
              />
              <Divider my={"xs"} />
            </>
          );
        }

        if (details.role === "member")
          return (
            <>
              <Member
                name={details.name}
                commissionRate={details.rateText}
                commissionAmount={details.commissionAmount}
                quotaDeducted={details.quotaDeducted}
                quotaBefore={details.quotaBefore}
                quotaAfter={details.quotaAfter}
              />
              <Divider my={"xs"} />
            </>
          );

        if (details.role === "agent")
          return (
            <>
              <Agent
                isMember={details.isMember}
                agentOf={details.isAgentOf}
                name={details.name}
                commissionRate={details.rateText}
                commissionAmount={details.commissionAmount}
                balanceBefore={details.balanceBefore}
                balanceAfter={details.balanceAfter}
              />
              <Divider my={"xs"} />
            </>
          );

        if (details.role === "upi_vendor")
          return (
            <>
              <UpiVendor
                name={details.name}
                commissionRate={details.commissionRate}
                commissionAmount={details.commissionAmount}
                rateText={details.rateText}
                upiId={details.upiId}
                upiTitle={details.upiTitle}
                commissionBefore={details.commissionBefore}
                commissionAfter={details.commissionAfter}
              />
              <Divider my={"xs"} />
            </>
          );

        if (details.role === "gateway")
          return (
            <>
              <Gateway
                name={details.name}
                upstreamRate={details.upstreamRate}
                upstreamFee={details.upstreamFee}
              />
              <Divider my={"xs"} />
            </>
          );

        if (details.role === "system")
          return (
            <System
              profit={details.profit}
              balanceBefore={details.balanceBefore}
              balanceAfter={details.balanceAfter}
            />
          );
      })}
    </>
  );
};

export default BalancesAndProfits;

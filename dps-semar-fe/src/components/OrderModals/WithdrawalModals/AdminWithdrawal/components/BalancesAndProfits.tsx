import { Badge, Box, Divider, Flex, Text } from "@mantine/core";
import React from "react";

const Merchant = ({
  name,
  serviceRate,
  serviceFee,
  balanceDeducted,
  balanceBefore,
  balanceAfter,
  role = "merchant",
}) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>{name}</Text>
        <Badge size="xs" color="gray.6">
          {role}
        </Badge>
      </Flex>

      <Flex mt={"2px"} justify={"space-between"}>
        <Box>
          <Text size="xs">
            Service Fee: ₹{serviceFee} ({serviceRate}%)
          </Text>
          <Text size="xs">Balance before: ₹{balanceBefore}</Text>
        </Box>
        <Box>
          <Text size="xs">Balance deducted: ₹{balanceDeducted}</Text>
          <Text size="xs">Balance after: ₹{balanceAfter}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

const Gateway = ({ name, upstreamRate, upstreamFee }) => {
  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Text fw={600}>Gateway Fee</Text>
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
      {data.map((details) => {
        if (
          details.role === "merchant" ||
          details.role === "member" ||
          details.role === "agent"
        )
          return (
            <>
              <Merchant
                name={details.name}
                serviceRate={details.serviceRate}
                serviceFee={details.serviceFee}
                balanceDeducted={details.balanceDeducted}
                balanceBefore={details.balanceBefore}
                balanceAfter={details.balanceAfter}
                role={details.role}
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

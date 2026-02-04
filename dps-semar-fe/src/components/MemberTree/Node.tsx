import { Box, Flex, Text, Title } from "@mantine/core";
import { Handle, Position } from "@xyflow/react";

const handleStyle = { left: 10 };

function CustomNode({ data }) {
  return (
    <>
      {!data.isRootNode && <Handle type="target" position={Position.Top} />}

      <div
        style={{
          padding: "10px 20px",
          background: data.currentNode ? "#A85706" : "white",
          position: "relative",
          borderRadius: "8px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <Box>
          <Title order={5} c={data.currentNode ? "white" : "#636465"}>
            {data.name}
          </Title>

          <Text size="xs" c={data.currentNode ? "white" : "gray"}>
            {data.email}
          </Text>
        </Box>

        {!data.isRootNode && (
          <Box mt={"sm"}>
            <Text
              size="xs"
              fw={600}
              c={data.currentNode ? "white" : "#636465"}
              td={"underline"}
            >
              Referrer Commission rates
            </Text>
            <Flex justify={"space-between"}>
              <Box ta={"center"}>
                <Text
                  size="xs"
                  c={data.currentNode ? "white" : "gray"}
                  fw={500}
                >
                  Payin
                </Text>
                <Text size="xs" c={data.currentNode ? "white" : "gray"}>
                  {data.payinCommission}
                </Text>
              </Box>

              <Box ta={"center"}>
                <Text
                  size="xs"
                  c={data.currentNode ? "white" : "gray"}
                  fw={500}
                >
                  Payout
                </Text>
                <Text size="xs" c={data.currentNode ? "white" : "gray"}>
                  {data.payoutCommission}
                </Text>
              </Box>

              <Box ta={"center"}>
                <Text
                  size="xs"
                  c={data.currentNode ? "white" : "gray"}
                  fw={500}
                >
                  Top-up
                </Text>
                <Text size="xs" c={data.currentNode ? "white" : "gray"}>
                  {data.topupCommission}
                </Text>
              </Box>
            </Flex>
          </Box>
        )}

        <Box mt={"sm"}>
          <Text
            size="xs"
            fw={600}
            c={data.currentNode ? "white" : "#636465"}
            td={"underline"}
          >
            Member Commission rates
          </Text>
          <Flex justify={"space-between"}>
            <Box ta={"center"}>
              <Text size="xs" c={data.currentNode ? "white" : "gray"} fw={500}>
                Payin
              </Text>
              <Text size="xs" c={data.currentNode ? "white" : "gray"}>
                {data.referredMemberPayinCommission}
              </Text>
            </Box>

            <Box ta={"center"}>
              <Text size="xs" c={data.currentNode ? "white" : "gray"} fw={500}>
                Payout
              </Text>
              <Text size="xs" c={data.currentNode ? "white" : "gray"}>
                {data.referredMemberPayoutCommission}
              </Text>
            </Box>

            <Box ta={"center"}>
              <Text size="xs" c={data.currentNode ? "white" : "gray"} fw={500}>
                Top-up
              </Text>
              <Text size="xs" c={data.currentNode ? "white" : "gray"}>
                {data.referredMemberTopupCommission}
              </Text>
            </Box>
          </Flex>
        </Box>
      </div>

      {!data.isLeafNode && <Handle type="source" position={Position.Bottom} />}
    </>
  );
}

export default CustomNode;

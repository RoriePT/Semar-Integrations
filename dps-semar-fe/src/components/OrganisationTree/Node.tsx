import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { ActionIcon, Box, Center, Divider, Flex, Text, Title } from "@mantine/core";
import { FaPlus } from "react-icons/fa6";
import { useDisclosure } from "@mantine/hooks";
import TransferQuota from "../TransferQuota";

const handleStyle = { left: 10 };

function CustomNode({ data }) {
  const [opened, handlers] = useDisclosure(false);

  return (
    <>
      {!data.isRootNode && <Handle type="target" position={Position.Top} />}

      <div
        style={{
          padding: "10px 20px",
          position: "relative",
          borderRadius: "8px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
      >
        <Box>
          <Title order={5} c={"gray"}>
            {data.name}
          </Title>

          <Text size="xs" c={"gray"}>
            {data.email}
          </Text>
          {!data.isRootNode && data.isDescendant && (
            <>
              <Divider my="6" />
              <Flex justify="center" style={{ alignItems: "center" }} mt="2">
                <Text
                  style={{
                    fontSize: "14px",
                    color: "slategray",
                    fontWeight: "500",
                    marginRight: "6px",
                  }}
                  c={"gray"}
                >
                  <strong> Quota :</strong> ₹{data.quota}
                </Text>
                <ActionIcon
                  size="xs"
                  mx="6"
                  radius="xl"
                  onClick={handlers.open}
                >
                  <FaPlus size={8} />
                </ActionIcon>
              </Flex>
            </>
          )}
        </Box>
      </div>

      {!data.isLeafNode && <Handle type="source" position={Position.Bottom} />}
      <TransferQuota
        opened={opened}
        close={handlers.close}
        receivingId={data}
        reload={data.reload}
      />
    </>
  );
}

export default CustomNode;

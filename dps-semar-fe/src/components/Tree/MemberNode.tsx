import { Box, Button, Flex, Text, Title } from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { Handle, Position } from "@xyflow/react";
import TransferQuota from "../TransferQuota";

const handleStyle = { left: 10 };

function MemberNode({ data }) {
  const { hovered, ref } = useHover();
  const [openTransfer, handlerTransfer] = useDisclosure();

  const isEnabledForSelection = () => {
    if (
      data.selectedNodes[data.selectedNodes.length - 1]?.nodeId ===
        data.parentId ||
      !data.isEditMode ||
      data.selectedNodes[data.selectedNodes.length - 1]?.nodeId ===
        data.nodeId ||
      (data.isRootNode && !data.selectedNodes.length)
    )
      return true;

    return false;
  };

  return (
    <>
      <div ref={ref}>
        {!data.isRootNode && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ width: 1, height: 1 }}
          />
        )}

        {!data.isRootNode && (
          <Box
            mt={"sm"}
            bg={"gray"}
            style={{ borderRadius: "5px", color: "white" }}
            mb={"4px"}
          >
            <Box mt={"lg"} p={"sm"} pos={"relative"}>
              <Text
                size="xs"
                fw={600}
                mb={"sm"}
                pos={"absolute"}
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "-20px",
                  borderRadius: "6px",
                  textWrap: "nowrap",
                }}
                bg={"gray"}
              >
                &nbsp; Referral Commission rates &nbsp;
              </Text>
              <Flex justify={"space-between"} gap={"lg"} align={"center"}>
                <Flex gap={"6px"}>
                  <Text size="xs" fw={500}>
                    Payin Orders:
                  </Text>
                  <Text size="xs">{data.ratesOfAgent?.payin}%</Text>
                </Flex>

                <Flex gap={"6px"}>
                  <Text size="xs" fw={500}>
                    Payout Orders:
                  </Text>
                  <Text size="xs">{data.ratesOfAgent?.payout}%</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        )}

        <div
          style={{
            padding: data.isEditMode ? "0" : "10px 20px",
            position: "relative",
            borderRadius: "8px",
            border: "1px solid gainsboro",
            overflow: "hidden",
            background: data.selectedNodes?.some(
              (node) => node.nodeId === data.nodeId,
            )
              ? "#A85706"
              : "white",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
            opacity: isEnabledForSelection() ? 1 : 0.3,
            outline:
              isEnabledForSelection() && data.isEditMode
                ? "2px solid #A85706"
                : "none",
          }}
        >
          {hovered &&
            data.for !== "admin" &&
            !data.isRootNode &&
            data.isDescendant && (
              <div
                style={{
                  position: "absolute",
                  inset: -1,
                  background: "#000000b0",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button size="xs" onClick={handlerTransfer.open}>
                  Transfer Quota
                </Button>
              </div>
            )}

          {!data.isEditMode && (
            <>
              {" "}
              <Flex gap={"xl"} align={"center"} justify={"space-between"}>
                <Box>
                  <Title order={5}>{data.name}</Title>
                </Box>

                <Box>
                  <Flex gap={"6px"}>
                    <Text size="xs" fw={500}>
                      Quota:
                    </Text>
                    <Text size="xs">₹ {data.quota}</Text>
                  </Flex>
                </Box>
              </Flex>
              <Box
                mt={"lg"}
                style={{ border: "1px solid gainsboro", borderRadius: "5px" }}
                p={"sm"}
                pos={"relative"}
              >
                <Text
                  size="xs"
                  fw={600}
                  mb={"sm"}
                  pos={"absolute"}
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "-10px",
                    background: "white",
                    textWrap: "nowrap",
                  }}
                >
                  Member Commission rates
                </Text>
                <Flex justify={"space-between"} gap={"lg"} align={"center"}>
                  <Flex gap={"6px"}>
                    <Text size="xs" fw={500}>
                      Payin Orders:
                    </Text>
                    <Text size="xs">{data.memberRates?.payin}%</Text>
                  </Flex>

                  <Flex gap={"6px"}>
                    <Text size="xs" fw={500}>
                      Payout Orders:
                    </Text>
                    <Text size="xs">{data.memberRates?.payout}%</Text>
                  </Flex>
                </Flex>
              </Box>
            </>
          )}

          {data.isEditMode && (
            <Flex
              justify={"center"}
              align={"center"}
              p={"sm"}
              onClick={() => {
                isEnabledForSelection() && data.handleSelectedNodes(data);
              }}
            >
              <Text ta={"center"} fw={500}>
                {data.name}
              </Text>
            </Flex>
          )}
        </div>

        {!data.isLeafNode && (
          <Handle type="source" position={Position.Bottom} />
        )}
      </div>

      <TransferQuota
        opened={openTransfer}
        close={handlerTransfer.close}
        receivingId={data}
        reload={data.triggerReload}
      />
    </>
  );
}

export default MemberNode;

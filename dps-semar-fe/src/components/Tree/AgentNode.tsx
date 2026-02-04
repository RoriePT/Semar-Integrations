import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Badge, Box, Button, Flex, Text, Title } from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import EditRateModal from "../EditRateModalOrganization";
import EditRateModalOrganization from "../EditRateModalOrganization";

const handleStyle = { left: 10 };

function AgentNode({ data }) {
  const { hovered, ref } = useHover();
  const [opened, handler] = useDisclosure();

  const getMerchantServiceRate = (type) => {
    const serviceRate = data?.serviceRate[type];
    if (!serviceRate) return "";

    if (serviceRate.mode === "PERCENTAGE")
      return `${serviceRate?.percentageAmount}%`;
    if (serviceRate.mode === "ABSOLUTE")
      return `₹ ${serviceRate?.absoluteAmount}`;
    if (serviceRate.mode === "COMBINATION")
      return `₹ ${serviceRate?.absoluteAmount} + ${serviceRate?.percentageAmount}%`;
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
            padding: "10px 20px",
            position: "relative",
            borderRadius: "8px",
            background: "white",
            border: "1px solid gainsboro",
            overflow: "hidden",

            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
          }}
        >
          {hovered &&
            data.for === "admin" &&
            data.isAgent &&
            !data.isRootNode && (
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
                <Button size="xs" onClick={handler.open}>
                  Edit Rates
                </Button>
              </div>
            )}

          <Flex gap={"xl"} align={"flex-start"} justify={"space-between"}>
            <Box>
              <Title order={5}>{data.name}</Title>
              <Flex gap={"6px"}>
                <Text size="xs" fw={500}>
                  Balance:
                </Text>
                <Text size="xs">₹ {data.balance}</Text>
              </Flex>
            </Box>

            <Box ta={"end"}>
              <Badge size="xs" color="gray.6" mb={"4px"}>
                {data.isAgent ? <>Agent</> : <>Merchant</>}
              </Badge>
              {data.isAgent ? (
                <Flex gap={"6px"}>
                  {/* <Text size="xs" fw={500}>
                    Referral Income:
                  </Text>
                  <Text size="xs">₹ {data.income}</Text> */}
                </Flex>
              ) : (
                <Flex gap={"6px"}>
                  {/* <Text size="xs" fw={500}>
                    Payin Income:
                  </Text>
                  <Text size="xs">₹ {data.income}</Text> */}
                </Flex>
              )}
            </Box>
          </Flex>
          {!data.isAgent && (
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
                Merchant Service rates
              </Text>
              <Flex justify={"space-between"} gap={"lg"} align={"center"}>
                <Flex gap={"6px"}>
                  <Text size="xs" fw={500}>
                    Payin Orders:
                  </Text>
                  <Text size="xs">{getMerchantServiceRate("payin")}</Text>
                </Flex>

                <Flex gap={"6px"}>
                  <Text size="xs" fw={500}>
                    Payout Orders:
                  </Text>
                  <Text size="xs">{getMerchantServiceRate("payout")}</Text>
                </Flex>
              </Flex>
            </Box>
          )}
        </div>
        {!data.isLeafNode && (
          <Handle type="source" position={Position.Bottom} />
        )}
      </div>

      <EditRateModalOrganization
        isOpen={opened}
        onClose={handler.close}
        data={data}
        triggerReload={data.triggerReload}
      />
    </>
  );
}

export default AgentNode;

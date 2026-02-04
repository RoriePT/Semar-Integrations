import { Box, Button, Divider, Flex, Text } from "@mantine/core";
import CopyButton from "../../../../CopyButton";
import TransactionReceipt from "../../../TransactionReceipt";
import { useDisclosure } from "@mantine/hooks";

const TransactionDetails = ({
  id,
  payinMadeOn,
  memberChannelDetails,
  gatewayDetails,
}) => {
  const [opened, openHandlers] = useDisclosure();
  return (
    <>
      <Flex gap={"sm"} align={"center"}>
        <Text fw={500}>Transaction Id:</Text>
        <Flex>
          <Text>{id}</Text>
          <CopyButton value={id} />
        </Flex>
      </Flex>

      {/* {payinMadeOn === "member" ? (
        <>
          {" "}
          <Divider my={"xs"} />
          <Box>
            <Text fw={600} size="sm">
              Member channel details:{" "}
            </Text>
            {Object.keys(memberChannelDetails).map((key) => (
              <>
                <Flex gap={"xs"} align={"center"}>
                  <Text fw={500} size="sm">
                    {key}:{" "}
                  </Text>
                  <Text size="xs" c={"dimmed"}>
                    {memberChannelDetails[key]}
                  </Text>
                </Flex>
              </>
            ))}
          </Box>
        </>
      ) : (
        <>
          {" "}
          <Divider my={"xs"} />
          <Box>
            <Text fw={600} size="sm">
              Other transaction details (Gateway):{" "}
            </Text>
            {gatewayDetails &&
              Object.keys(gatewayDetails).map((key) => (
                <>
                  <Flex gap={"xs"} align={"center"}>
                    <Text fw={500} size="sm">
                      {key}:{" "}
                    </Text>
                    <Text size="xs" c={"dimmed"}>
                      {gatewayDetails[key]}
                    </Text>
                  </Flex>
                </>
              ))}
          </Box>
        </>
      )} */}
    </>
  );
};

export default TransactionDetails;

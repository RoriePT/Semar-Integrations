import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import arrayMove from "array-move";
import { useEffect, useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { GatewayName } from "../../../../../../../api/gateway";
import useForm from "./useForm";

const GatewayAndTimeouts = () => {
  const [payinGateways, setPayinGateways] = useState([
    GatewayName.RAZORPAY,
    GatewayName.PHONEPE,
    GatewayName.UNIQPAY,
    GatewayName.PAYU,
    GatewayName.CASHFREE,
  ]);
  const [payoutGateways, setPayoutGateways] = useState([
    GatewayName.RAZORPAY,
    GatewayName.PHONEPE,
    GatewayName.UNIQPAY,
    GatewayName.PAYU,
    GatewayName.CASHFREE,
  ]);
  const [withdrawalGateways, setWithdrawalGateways] = useState([
    GatewayName.RAZORPAY,
    GatewayName.PHONEPE,
    GatewayName.UNIQPAY,
    GatewayName.PAYU,
    GatewayName.CASHFREE,
  ]);

  const { formState, handleChange, errors, handleSubmit, gateways } = useForm(
    payinGateways,
    payoutGateways,
    withdrawalGateways
  );

  const onSortEndPayin = (oldIndex: number, newIndex: number) =>
    setPayinGateways((array) => arrayMove(array, oldIndex, newIndex));

  const onSortEndPayout = (oldIndex: number, newIndex: number) =>
    setPayoutGateways((array) => arrayMove(array, oldIndex, newIndex));

  const onSortEndWithdrawal = (oldIndex: number, newIndex: number) =>
    setWithdrawalGateways((array) => arrayMove(array, oldIndex, newIndex));

  useEffect(() => {
    if (
      formState.defaultPayinGateway &&
      formState.defaultPayoutGateway &&
      formState.defaultWithdrawalGateway
    ) {
      setPayinGateways(Object.values(formState.defaultPayinGateway));
      setPayoutGateways(Object.values(formState.defaultPayoutGateway));
      setWithdrawalGateways(Object.values(formState.defaultWithdrawalGateway));
    }
  }, [
    formState.defaultPayinGateway,
    formState.defaultPayoutGateway,
    formState.defaultWithdrawalGateway,
  ]);

  return (
    <Paper p={"md"}>
      <Center>
        <Title order={4}>Gateways and Timeouts</Title>
      </Center>
      <Stack mt={"md"}>
        <Paper withBorder p="xs">
          <Text fw="500" size="sm">
            Default gateway for 3rd party Payins
          </Text>
          <Text c="#868E96" fw="400" size="xs" mb="xs">
            Drag and Drop the gateways to change the priorities
          </Text>
          <SortableList onSortEnd={onSortEndPayin}>
            {payinGateways.map((item, index) => (
              <Flex key={index} justify="space-between" align="center" mb="xs">
                <Box
                  ta="center"
                  style={{
                    border: "1px solid grey",
                    borderRadius: "5px",
                    padding: "5px",
                    width: "48%",
                    background: "#f1f1f1",
                  }}
                >
                  Priority {index + 1}
                </Box>
                <SortableItem>
                  <Box
                    ta="center"
                    style={{
                      border: "1px solid grey",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "48%",
                      cursor: "grab",
                      background: "#fff",
                    }}
                  >
                    {item === "UNIQPAY" ? "BENAKPAY" : item}
                  </Box>
                </SortableItem>
              </Flex>
            ))}
          </SortableList>
        </Paper>

        <Paper withBorder p="xs">
          <Text fw="500" size="sm">
            Default gateway for 3rd party Payouts
          </Text>
          <Text c="#868E96" fw="400" size="xs" mb="xs">
            Drag and Drop the gateways to change the priorities
          </Text>
          <SortableList
            onSortEnd={onSortEndPayout}
            draggedItemClassName="dragged"
          >
            {payoutGateways.map((item, index) => (
              <Flex key={index} justify="space-between" align="center" mb="xs">
                <Box
                  ta="center"
                  style={{
                    border: "1px solid grey",
                    borderRadius: "5px",
                    padding: "5px",
                    width: "48%",
                    background: "#f1f1f1",
                  }}
                >
                  Priority {index + 1}
                </Box>
                <SortableItem>
                  <Box
                    ta="center"
                    style={{
                      border: "1px solid grey",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "48%",
                      cursor: "grab",
                      background: "#fff",
                    }}
                  >
                    {item === "UNIQPAY" ? "BENAKPAY" : item}
                  </Box>
                </SortableItem>
              </Flex>
            ))}
          </SortableList>
        </Paper>

        <Paper withBorder p="xs">
          <Text fw="500" size="sm">
            Default gateway for 3rd party Withdrawals
          </Text>
          <Text c="#868E96" fw="400" size="xs" mb="xs">
            Drag and Drop the gateways to change the priorities
          </Text>
          <SortableList
            onSortEnd={onSortEndWithdrawal}
            draggedItemClassName="dragged"
          >
            {withdrawalGateways.map((item, index) => (
              <Flex key={index} justify="space-between" align="center" mb="xs">
                <Box
                  ta="center"
                  style={{
                    border: "1px solid grey",
                    borderRadius: "5px",
                    padding: "5px",
                    width: "48%",
                    background: "#f1f1f1",
                  }}
                >
                  Priority {index + 1}
                </Box>
                <SortableItem>
                  <Box
                    ta="center"
                    style={{
                      border: "1px solid grey",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "48%",
                      cursor: "grab",
                      background: "#fff",
                    }}
                  >
                    {item === "UNIQPAY" ? "BENAKPAY" : item}
                  </Box>
                </SortableItem>
              </Flex>
            ))}
          </SortableList>
        </Paper>

        <NumberInput
          label={"Timeout window member payin channel fallback"}
          value={formState.payinTimeout}
          onChange={(value) => handleChange("payinTimeout", value)}
          error={errors.payinTimeout}
          rightSection={<Text pr={"md"}>sec</Text>}
        />

        <NumberInput
          label={"Timeout window member payout channel fallback"}
          value={formState.payoutTimeout}
          onChange={(value) => handleChange("payoutTimeout", value)}
          error={errors.payoutTimeout}
          rightSection={<Text pr={"md"}>sec</Text>}
        />

        <Group align="flex-start">
          <Button size="md" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default GatewayAndTimeouts;

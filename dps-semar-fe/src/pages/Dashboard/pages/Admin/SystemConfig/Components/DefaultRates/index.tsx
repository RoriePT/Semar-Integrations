import {
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Title,
  Text,
  Flex,
} from "@mantine/core";
import useForm from "./useForm";

const DefaultRates = () => {
  const {
    formState,
    handleChange,
    handleSubmit,
    errors,
    loading,
    openConfirm,
    setOpenConfirm,
  } = useForm();

  const handleConfirm = () => {
    setOpenConfirm(true);
  };

  return (
    <>
      <Paper p={"md"}>
        <Center>
          <Title order={4}>System Profit Rates</Title>
        </Center>
        <Stack mt={"md"}>
          <NumberInput
            label={"Payin system profit rate"}
            value={formState?.payinSystemProfitRate}
            onChange={(value) => handleChange("payinSystemProfitRate", +value)}
            error={errors.payinSystemProfitRate}
            rightSection={"%"}
          />
          <NumberInput
            label={"Payout system profit rate"}
            value={formState?.payoutSystemProfitRate}
            onChange={(value) => handleChange("payoutSystemProfitRate", +value)}
            error={errors.payoutSystemProfitRate}
            rightSection={"%"}
          />

          <Group align="flex-start">
            <Button size="md" onClick={handleConfirm} loading={loading}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Modal
        opened={openConfirm}
        onClose={() => {
          setOpenConfirm((prev) => !prev);
        }}
        title={<Text fw={500}>Proceed with caution!</Text>}
      >
        <Text>
          Altering system profit rates may lead to disparities in member agent
          commision rates. sure you want to continue?
        </Text>
        <Flex justify={"space-between"} gap={"md"} mt={"md"}>
          <Button
            color={"green"}
            w={"50%"}
            onClick={() => {
              setOpenConfirm(false);
            }}
          >
            No, Cancel
          </Button>
          <Button
            color={"red"}
            w={"50%"}
            onClick={() => {
              handleSubmit();
              setOpenConfirm(false);
            }}
          >
            Yes, Save Changes
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default DefaultRates;

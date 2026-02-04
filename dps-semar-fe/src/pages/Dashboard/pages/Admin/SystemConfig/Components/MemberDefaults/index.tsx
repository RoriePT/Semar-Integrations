import {
  Button,
  Center,
  Flex,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import useForm from "./useForm";

const MemberDefaults = () => {
  const {
    formState,
    handleChange,
    handleSubmit,
    errors,
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
          <Title order={4}>Member Defaults</Title>
        </Center>
        <Stack mt={"md"}>
          <NumberInput
            label="Payin commission rate"
            placeholder="Enter payin commission rate"
            rightSection={"%"}
            withAsterisk
            value={formState.payinCommissionRateForMember}
            onChange={(value) =>
              handleChange("payinCommissionRateForMember", value)
            }
            error={errors.payinCommissionRateForMember}
          />
          <NumberInput
            label="Payout commission rate"
            placeholder="Enter payout commission rate"
            rightSection={"%"}
            withAsterisk
            value={formState.payoutCommissionRateForMember}
            onChange={(value) =>
              handleChange("payoutCommissionRateForMember", value)
            }
            error={errors.payoutCommissionRateForMember}
          />
          <NumberInput
            label="Top-up commission rate"
            placeholder="Enter top-up commission rate"
            rightSection={"%"}
            withAsterisk
            value={formState.topupCommissionRateForMember}
            onChange={(value) =>
              handleChange("topupCommissionRateForMember", value)
            }
            error={errors.topupCommissionRateForMember}
          />

          <NumberInput
            label="Minimum single payout amount"
            withAsterisk
            min={0}
            value={formState.minimumPayoutAmountForMember}
            onChange={(value) =>
              handleChange("minimumPayoutAmountForMember", value)
            }
            error={errors.minimumPayoutAmountForMember}
          />
          <NumberInput
            label="Maximum single payout amount"
            withAsterisk
            max={10000000}
            value={formState.maximumPayoutAmountForMember}
            onChange={(value) =>
              handleChange("maximumPayoutAmountForMember", value)
            }
            error={errors.maximumPayoutAmountForMember}
          />

          <NumberInput
            label="Maximum total daily payout amount"
            withAsterisk
            max={10000000}
            value={formState.maximumDailyPayoutAmountForMember}
            onChange={(value) =>
              handleChange("maximumDailyPayoutAmountForMember", value)
            }
            error={errors.maximumDailyPayoutAmountForMember}
          />
          <Group align="flex-start">
            <Button size="md" onClick={handleConfirm}>
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
          Altering default member rates may lead to disparities in member agent
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

export default MemberDefaults;

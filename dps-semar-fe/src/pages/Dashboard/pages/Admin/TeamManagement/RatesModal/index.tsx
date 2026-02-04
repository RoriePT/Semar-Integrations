import ModalLayout from "../../../../../../components/ModalLayout";
import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import useForm from "./useForm";

const RatesModal = ({
  opened,
  close,
  teamId,
  commissionRates,
  triggerReload,
}) => {
  const {
    handleChange,
    handleSubmit,
    errors,
    formState,
    loading,
    openConfirm,
    setOpenConfirm,
  } = useForm(teamId, commissionRates, close, triggerReload);

  const handleConfirm = () => {
    setOpenConfirm(true);
  };

  return (
    <>
      <ModalLayout
        opened={opened}
        close={close}
        size="lg"
        header={<Title order={4}>Team Commission Rates</Title>}
        body={
          <Stack>
            <NumberInput
              label="Payin commission rate"
              value={formState.teamPayinCommissionRate}
              onChange={(value) =>
                handleChange("teamPayinCommissionRate", +value)
              }
              error={errors?.teamPayinCommissionRate}
              rightSection={"%"}
            />
            <NumberInput
              label="Payout commission rate"
              value={formState.teamPayoutCommissionRate}
              onChange={(value) =>
                handleChange("teamPayoutCommissionRate", +value)
              }
              error={errors?.teamPayoutCommissionRate}
              rightSection={"%"}
            />
            <NumberInput
              label="Topup commission rate"
              value={formState.teamTopupCommissionRate}
              onChange={(value) =>
                handleChange("teamTopupCommissionRate", +value)
              }
              error={errors?.teamTopupCommissionRate}
              rightSection={"%"}
            />
          </Stack>
        }
        footer={
          <Button
            onClick={() => {
              handleConfirm();
            }}
            loading={loading}
          >
            Save Changes
          </Button>
        }
      />

      <Modal
        opened={openConfirm}
        onClose={() => {
          setOpenConfirm((prev) => !prev);
        }}
        title={<Text fw={500}>Proceed with caution!</Text>}
      >
        <Text>
          Altering team direct commission rates may lead to disparities in
          member agent commision rates. sure you want to continue?
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

export default RatesModal;

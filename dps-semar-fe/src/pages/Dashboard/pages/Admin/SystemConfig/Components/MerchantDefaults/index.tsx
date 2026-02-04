import {
  Button,
  Center,
  Group,
  NumberInput,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import useForm from "./useForm";
import ServiceRate from "../../../../../../../components/ServiceRate";

const MerchantDefaults = () => {
  const { formState, handleChange, handleSubmit, errors } = useForm();

  return (
    <Paper p={"md"}>
      <Center>
        <Title order={4}>Merchant Defaults</Title>
      </Center>
      <Stack mt={"md"}>
        <Paper withBorder p={"10px"}>
          <ServiceRate
            label="Payin Service Rate Mode"
            formState={formState.payinServiceRateForMerchant}
            onValueChange={(value) =>
              handleChange("payinServiceRateForMerchant", value)
            }
            errorMessage={errors?.payin ? errors.payin : {}}
          />
        </Paper>

        <Paper withBorder p={"10px"}>
          <ServiceRate
            label="Payout Service Rate Mode"
            formState={formState.payoutServiceRateForMerchant}
            onValueChange={(value) =>
              handleChange("payoutServiceRateForMerchant", value)
            }
            errorMessage={errors?.payout ? errors.payout : {}}
          />
        </Paper>

        <NumberInput
          label="Minimum payout amount"
          withAsterisk
          defaultValue={0}
          value={formState.minimumPayoutAmountForMerchant}
          onChange={(v) => handleChange("minimumPayoutAmountForMerchant", v)}
          error={errors.minimumPayoutAmountForMerchant}
        />

        <NumberInput
          label="Maximum payout amount"
          withAsterisk
          defaultValue={1000000}
          value={formState.maximumPayoutAmountForMerchant}
          onChange={(v) => handleChange("maximumPayoutAmountForMerchant", v)}
          error={errors.maximumPayoutAmountForMerchant}
        />

        <NumberInput
          label="End user daily payin limit"
          withAsterisk
          //min={1000000}
          defaultValue={10000}
          value={formState.endUserPayinLimit}
          onChange={(v) => handleChange("endUserPayinLimit", v)}
          error={errors.endUserPayinLimit}
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

export default MerchantDefaults;

import { TextInput, Stack } from "@mantine/core";

const CashfreeKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
  const handleChange = (key) => (e) => {
    const value = e.target.value;

    setFields({
      ...fields,
      [key]: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  return (
    <Stack>
      {currentTab === "live" ? (
        <>
          <TextInput
            label="Payins Client ID"
            placeholder="Enter your Payin Client ID"
            value={fields.client_id}
            onChange={handleChange("client_id")}
            error={errors.client_id}
          />
          <TextInput
            label="Payins Client Secret"
            placeholder="Enter your Payin Client Secret"
            value={fields.client_secret}
            onChange={handleChange("client_secret")}
            error={errors.client_secret}
          />

          <TextInput
            label="Payouts Client ID"
            placeholder="Enter your Payouts Client ID"
            value={fields.payouts_client_id}
            onChange={handleChange("payouts_client_id")}
            error={errors.payouts_client_id}
          />
          <TextInput
            label="Payouts Client Secret"
            placeholder="Enter your Payouts Client Secret"
            value={fields.payouts_client_secret}
            onChange={handleChange("payouts_client_secret")}
            error={errors.payouts_client_secret}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Sandbox Key ID"
            placeholder="Enter your Sandbox Key ID"
            value={fields.sandbox_client_id}
            onChange={handleChange("sandbox_client_id")}
            error={errors.sandbox_client_id}
          />
          <TextInput
            label="Sandbox Key Secret"
            placeholder="Enter your Sandbox Key Secret"
            value={fields.sandbox_client_secret}
            onChange={handleChange("sandbox_client_secret")}
            error={errors.sandbox_client_secret}
          />
        </>
      )}
    </Stack>
  );
};

export default CashfreeKeys;

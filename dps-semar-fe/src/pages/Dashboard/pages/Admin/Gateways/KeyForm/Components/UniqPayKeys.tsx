import { Stack, TextInput } from "@mantine/core";

const UniqPayKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
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
            label="BenakPay ID"
            placeholder="Enter your BenakPay ID"
            value={fields.uniqpay_id}
            onChange={handleChange("uniqpay_id")}
            error={errors.uniqpay_id}
          />
          <TextInput
            label="BenakPay Client ID"
            placeholder="Enter your BenakPay Client ID"
            value={fields.client_id}
            onChange={handleChange("client_id")}
            error={errors.client_id}
          />
          <TextInput
            label="BenakPay Client Secret"
            placeholder="Enter your BenakPay Client Secret"
            value={fields.client_secret}
            onChange={handleChange("client_secret")}
            error={errors.client_secret}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Sandbox Key ID"
            placeholder="Enter your Sandbox Key ID"
            value={fields.sandbox_key_id}
            onChange={handleChange("sandbox_key_id")}
            error={errors.sandbox_key_id}
          />
          <TextInput
            label="Sandbox Key Secret"
            placeholder="Enter your Sandbox Key Secret"
            value={fields.sandbox_key_secret}
            onChange={handleChange("sandbox_key_secret")}
            error={errors.sandbox_key_secret}
          />
        </>
      )}
    </Stack>
  );
};

export default UniqPayKeys;

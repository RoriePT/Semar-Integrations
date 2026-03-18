import { Stack, TextInput } from "@mantine/core";

const DokuKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
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
            label="Merchant ID"
            placeholder="Enter DOKU Merchant ID"
            value={fields.merchant_id}
            onChange={handleChange("merchant_id")}
            error={errors.merchant_id}
          />
          <TextInput
            label="Client ID"
            placeholder="Enter DOKU Client ID"
            value={fields.client_id}
            onChange={handleChange("client_id")}
            error={errors.client_id}
          />
          <TextInput
            label="Secret Key"
            placeholder="Enter DOKU Secret Key"
            value={fields.secret_key}
            onChange={handleChange("secret_key")}
            error={errors.secret_key}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Sandbox Merchant ID"
            placeholder="Enter DOKU Sandbox Merchant ID"
            value={fields.sandbox_merchant_id}
            onChange={handleChange("sandbox_merchant_id")}
            error={errors.sandbox_merchant_id}
          />
          <TextInput
            label="Sandbox Client ID"
            placeholder="Enter DOKU Sandbox Client ID"
            value={fields.sandbox_client_id}
            onChange={handleChange("sandbox_client_id")}
            error={errors.sandbox_client_id}
          />
          <TextInput
            label="Sandbox Secret Key"
            placeholder="Enter DOKU Sandbox Secret Key"
            value={fields.sandbox_secret_key}
            onChange={handleChange("sandbox_secret_key")}
            error={errors.sandbox_secret_key}
          />
        </>
      )}
    </Stack>
  );
};

export default DokuKeys;

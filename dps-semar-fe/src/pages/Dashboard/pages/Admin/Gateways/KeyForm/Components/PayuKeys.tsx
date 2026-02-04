import { TextInput, Stack } from "@mantine/core";

const PayuKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
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
            placeholder="Enter your merchant ID"
            value={fields.merchant_id}
            onChange={handleChange("merchant_id")}
            error={errors.merchant_id}
          />
          <TextInput
            label="PayU Client ID"
            placeholder="Enter your PayU Client ID"
            value={fields.client_id}
            onChange={handleChange("client_id")}
            error={errors.client_id}
          />
          <TextInput
            label="PayU Client Secret"
            placeholder="Enter your PayU Client Secret"
            value={fields.client_secret}
            onChange={handleChange("client_secret")}
            error={errors.client_secret}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Sandbox Merchant ID"
            placeholder="Enter your sandbox merchant ID"
            value={fields.sandbox_merchant_id}
            onChange={handleChange("sandbox_merchant_id")}
            error={errors.sandbox_merchant_id}
          />
          <TextInput
            label="Sandbox Client ID"
            placeholder="Enter your sandbox client ID"
            value={fields.sandbox_key_id}
            onChange={handleChange("sandbox_key_id")}
            error={errors.sandbox_key_id}
          />
          <TextInput
            label="Sandbox Client Secret"
            placeholder="Enter your Sandbox Client Secret"
            value={fields.sandbox_key_secret}
            onChange={handleChange("sandbox_key_secret")}
            error={errors.sandbox_key_secret}
          />
        </>
      )}
    </Stack>
  );
};

export default PayuKeys;

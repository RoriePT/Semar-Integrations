import { TextInput, Stack } from "@mantine/core";
import { useEffect } from "react";

const PhonepeKeys = ({ fields, errors,setErrors, setFields, currentTab }) => {
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
      {currentTab === "live" && (
        <>
          <TextInput
            label="Merchant ID"
            placeholder="Enter your Merchant ID"
            value={fields.merchant_id}
            onChange={handleChange("merchant_id")}
            error={errors.merchant_id}
          />
          <TextInput
            label="Salt Key"
            placeholder="Enter your Salt Key"
            value={fields.salt_key}
            onChange={handleChange("salt_key")}
            error={errors.salt_key}
          />
          <TextInput
            label="Salt Index"
            placeholder="Enter your Salt Index"
            value={fields.salt_index}
            onChange={handleChange("salt_index")}
            error={errors.salt_index}
          />
        </>
      )}

      {currentTab === "sandbox" && (
        <>
          <TextInput
            label="Sandbox Merchant ID"
            placeholder="Enter your Sandbox Merchant ID"
            value={fields.sandbox_merchant_id}
            onChange={handleChange("sandbox_merchant_id")}
            error={errors.sandbox_merchant_id}
          />
          <TextInput
            label="Sandbox Salt Key"
            placeholder="Enter your Sandbox Salt Key"
            value={fields.sandbox_salt_key}
            onChange={handleChange("sandbox_salt_key")}
            error={errors.sandbox_salt_key}
          />
          <TextInput
            label="Sandbox Salt Index"
            placeholder="Enter your Sandbox Salt Index"
            value={fields.sandbox_salt_index}
            onChange={handleChange("sandbox_salt_index")}
            error={errors.sandbox_salt_index}
          />
        </>
      )}
    </Stack>
  );
};

export default PhonepeKeys;

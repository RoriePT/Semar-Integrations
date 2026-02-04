import { TextInput, Stack } from "@mantine/core";

const RazorPayKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
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
            label="Razorpay Key ID"
            placeholder="Enter your Razorpay Key ID"
            value={fields.key_id}
            onChange={handleChange("key_id")}
            error={errors.key_id}
          />
          <TextInput
            label="Razorpay Key Secret"
            placeholder="Enter your Razorpay Key Secret"
            value={fields.key_secret}
            onChange={handleChange("key_secret")}
            error={errors.key_secret}
          />
          <TextInput
            label="Account Number"
            placeholder="Enter your account number"
            value={fields.account_number}
            onChange={handleChange("account_number")}
            error={errors.account_number}
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
          <TextInput
            label="Sandbox Account Number"
            placeholder="Enter your sandbox account number"
            value={fields.sandbox_account_number}
            onChange={handleChange("sandbox_account_number")}
            error={errors.sandbox_account_number}
          />
        </>
      )}
    </Stack>
  );
};

export default RazorPayKeys;

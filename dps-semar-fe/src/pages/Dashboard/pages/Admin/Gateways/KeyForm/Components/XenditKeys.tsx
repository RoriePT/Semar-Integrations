import { Stack, TextInput } from "@mantine/core";

const XenditKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
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
        <TextInput
          label="Secret Key"
          placeholder="Enter Xendit Secret Key"
          value={fields.secret_key}
          onChange={handleChange("secret_key")}
          error={errors.secret_key}
        />
      ) : (
        <TextInput
          label="Sandbox Secret Key"
          placeholder="Enter Xendit Sandbox Secret Key"
          value={fields.sandbox_secret_key}
          onChange={handleChange("sandbox_secret_key")}
          error={errors.sandbox_secret_key}
        />
      )}
    </Stack>
  );
};

export default XenditKeys;

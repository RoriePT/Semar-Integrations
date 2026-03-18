import { Stack, TextInput } from "@mantine/core";

const MidtransKeys = ({ fields, errors, setFields, currentTab, setErrors }) => {
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
            label="Server Key"
            placeholder="Enter Midtrans Server Key"
            value={fields.server_key}
            onChange={handleChange("server_key")}
            error={errors.server_key}
          />
          <TextInput
            label="Client Key"
            placeholder="Enter Midtrans Client Key"
            value={fields.client_key}
            onChange={handleChange("client_key")}
            error={errors.client_key}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Sandbox Server Key"
            placeholder="Enter Midtrans Sandbox Server Key"
            value={fields.sandbox_server_key}
            onChange={handleChange("sandbox_server_key")}
            error={errors.sandbox_server_key}
          />
          <TextInput
            label="Sandbox Client Key"
            placeholder="Enter Midtrans Sandbox Client Key"
            value={fields.sandbox_client_key}
            onChange={handleChange("sandbox_client_key")}
            error={errors.sandbox_client_key}
          />
        </>
      )}
    </Stack>
  );
};

export default MidtransKeys;

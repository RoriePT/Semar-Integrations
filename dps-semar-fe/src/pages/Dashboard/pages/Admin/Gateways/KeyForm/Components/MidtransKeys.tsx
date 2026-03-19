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
          <TextInput
            label="Disbursement Merchant ID"
            placeholder="Enter Midtrans Disbursement Merchant ID"
            value={fields.disbursement_merchant_id}
            onChange={handleChange("disbursement_merchant_id")}
            error={errors.disbursement_merchant_id}
          />
          <TextInput
            label="Disbursement Creator API Key"
            placeholder="Enter Midtrans Creator API Key"
            value={fields.disbursement_creator_api_key}
            onChange={handleChange("disbursement_creator_api_key")}
            error={errors.disbursement_creator_api_key}
          />
          <TextInput
            label="Disbursement Creator Merchant Key"
            placeholder="Enter Midtrans Creator Merchant Key"
            value={fields.disbursement_creator_merchant_key}
            onChange={handleChange("disbursement_creator_merchant_key")}
            error={errors.disbursement_creator_merchant_key}
          />
          <TextInput
            label="Disbursement Approver API Key"
            placeholder="Enter Midtrans Approver API Key"
            value={fields.disbursement_approver_api_key}
            onChange={handleChange("disbursement_approver_api_key")}
            error={errors.disbursement_approver_api_key}
          />
          <TextInput
            label="Disbursement Approver Merchant Key"
            placeholder="Enter Midtrans Approver Merchant Key"
            value={fields.disbursement_approver_merchant_key}
            onChange={handleChange("disbursement_approver_merchant_key")}
            error={errors.disbursement_approver_merchant_key}
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
          <TextInput
            label="Sandbox Disbursement Merchant ID"
            placeholder="Enter Midtrans Sandbox Disbursement Merchant ID"
            value={fields.sandbox_disbursement_merchant_id}
            onChange={handleChange("sandbox_disbursement_merchant_id")}
            error={errors.sandbox_disbursement_merchant_id}
          />
          <TextInput
            label="Sandbox Disbursement Creator API Key"
            placeholder="Enter Midtrans Sandbox Creator API Key"
            value={fields.sandbox_disbursement_creator_api_key}
            onChange={handleChange("sandbox_disbursement_creator_api_key")}
            error={errors.sandbox_disbursement_creator_api_key}
          />
          <TextInput
            label="Sandbox Disbursement Creator Merchant Key"
            placeholder="Enter Midtrans Sandbox Creator Merchant Key"
            value={fields.sandbox_disbursement_creator_merchant_key}
            onChange={handleChange("sandbox_disbursement_creator_merchant_key")}
            error={errors.sandbox_disbursement_creator_merchant_key}
          />
          <TextInput
            label="Sandbox Disbursement Approver API Key"
            placeholder="Enter Midtrans Sandbox Approver API Key"
            value={fields.sandbox_disbursement_approver_api_key}
            onChange={handleChange("sandbox_disbursement_approver_api_key")}
            error={errors.sandbox_disbursement_approver_api_key}
          />
          <TextInput
            label="Sandbox Disbursement Approver Merchant Key"
            placeholder="Enter Midtrans Sandbox Approver Merchant Key"
            value={fields.sandbox_disbursement_approver_merchant_key}
            onChange={handleChange("sandbox_disbursement_approver_merchant_key")}
            error={errors.sandbox_disbursement_approver_merchant_key}
          />
        </>
      )}
    </Stack>
  );
};

export default MidtransKeys;

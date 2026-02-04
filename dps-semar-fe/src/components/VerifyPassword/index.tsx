import { useEffect, useState } from "react";
import { Modal, Button, PasswordInput, Text, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useDashboardUser } from "../../pages/Dashboard/DashboardProvider";
import AuthAPIs from "../../api/auth";

const VerifyPassword = ({
  opened,
  handleSuccess,
  handleCancel,
  resetFields,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { userData } = useDashboardUser();
  const handleSubmit = async () => {
    if (password.length < 8) {
      setError(
        "Field must not be empty and Password must be at least 8 characters long"
      );
      return;
    }

    try {
      const response = await AuthAPIs.verifyPassword(
        password,
        userData.userTable
      );
      if (response) {
        handleSuccess();
      } else {
        setError("Password is not correct.");
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Verification error.",
        color: "red",
        icon: <X size={16} />,
      });
    }
  };

  useEffect(() => {
    if (resetFields) {
      setPassword("");
      setError("");
    }
  }, [resetFields]);

  useEffect(() => {
    if (!opened) {
      resetFields();
    }
  }, [opened]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCancel}
        title="Verify Your  Withdrawal Password"
      >
        <Text size="sm" mb="xs">
          Get your password checked to proceed further
        </Text>
        <PasswordInput
          placeholder="Enter your password"
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
            setError("");
          }}
          error={error}
        />
        <Box pt="md">
          <Button onClick={handleSubmit}>Submit</Button>
        </Box>
      </Modal>
    </>
  );
};

export default VerifyPassword;

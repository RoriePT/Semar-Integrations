// import { Button, Paper, PasswordInput, Title } from "@mantine/core";
// import { useState } from "react";
// import { defaultErrors } from "./Utils/config";
// import CommonAPIs from "../../../api/common";
// import { useDashboardUser } from "../../../pages/Dashboard/DashboardProvider";
// import { validatePasswords } from "./Utils/validate";

// type ChangePasswordTypes = {
//   withdrawal?: boolean;
// };

// const ChangePassword = ({ withdrawal }: ChangePasswordTypes) => {
//   const { userData } = useDashboardUser();
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(defaultErrors);

//   const passwordHandler = (passwordType: string, password: string) => {
//     switch (passwordType) {
//       case "current":
//         setCurrentPassword(password);
//         break;
//       case "new":
//         setNewPassword(password);
//         break;
//       case "confirm":
//         setConfirmPassword(password);
//         break;
//     }
//   };

//   const submitPassword = async () => {
//      setError(defaultErrors);
//     const passwords = { currentPassword, newPassword, confirmPassword };
//     const isValid = validatePasswords(passwords, error, setError);

//     if (!isValid) {
//       return;
//     }
//      setError(defaultErrors);
//     const response = await CommonAPIs.changePassword(
//       userData.userTable,
//       userData.id,
//       { oldPassword: currentPassword, newPassword },
//       withdrawal
//     );
//   };

//   const changePasswordString = withdrawal ? "withdrawal password" : "password";

//   return (
//     <Paper p={"md"}>
//       <Title order={4}>{`Change ${changePasswordString}`}</Title>
//       <PasswordInput
//         withAsterisk
//         label={`Current ${changePasswordString}`}
//         placeholder={`Enter ${changePasswordString}`}
//         value={currentPassword}
//         onChange={(e) => passwordHandler("current", e.target.value)}
//         error={error.currentPassword}
//         mb={"md"}
//       />
//       <PasswordInput
//         withAsterisk
//         label={`New ${changePasswordString}`}
//         placeholder={`Enter new ${changePasswordString}`}
//         value={newPassword}
//         onChange={(e) => passwordHandler("new", e.target.value)}
//         error={error.newPassword}
//         mb={"md"}
//       />
//       <PasswordInput
//         withAsterisk
//         label={`Confirm new ${changePasswordString}`}
//         placeholder={`Confirm ${changePasswordString}`}
//         value={confirmPassword}
//         onChange={(e) => passwordHandler("confirm", e.target.value)}
//         error={error.confirmPassword}
//         mb={"md"}
//       />

//       <Button onClick={submitPassword}>Submit</Button>
//     </Paper>
//   );
// };

// export default ChangePassword;

import { Button, Center, Paper, PasswordInput, Title } from "@mantine/core";
import { useState } from "react";
import { defaultErrors } from "./Utils/config";
import CommonAPIs from "../../../api/common";
import { useDashboardUser } from "../../../pages/Dashboard/DashboardProvider";
import { validatePasswords } from "./Utils/validate";
import { notifications } from "@mantine/notifications";

type ChangePasswordTypes = {
  withdrawal?: boolean;
};

const ChangePassword = ({ withdrawal }: ChangePasswordTypes) => {
  const { userData } = useDashboardUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(defaultErrors);
  const [loading, setLoading] = useState(false);

  const passwordHandler = (passwordType: string, password: string) => {
    switch (passwordType) {
      case "current":
        setCurrentPassword(password);
        break;
      case "new":
        setNewPassword(password);
        break;
      case "confirm":
        setConfirmPassword(password);
        break;
    }
  };

  const submitPassword = async () => {
    const passwords = { currentPassword, newPassword, confirmPassword };
    const isValid = validatePasswords(passwords, error, setError);

    if (!isValid) {
      return;
    }

    setLoading(true);
    setError(defaultErrors);

    const response = await CommonAPIs.changePassword(
      userData.userTable,
      { oldPassword: currentPassword, newPassword },
      withdrawal
    );

    setLoading(false);

    if (response && response.status === 201) {
      notifications.show({
        title: "Success",
        message: "Password updated successfully.",
        color: "green",
      });
    }
  };

  const changePasswordString = withdrawal ? "withdrawal password" : "password";

  return (
    <Paper p={"md"}>
      <Center>
        <Title order={3} mb={"lg"}>{`Change ${changePasswordString}`}</Title>
      </Center>
      <PasswordInput
        size="md"
        withAsterisk
        label={`Current ${changePasswordString}`}
        placeholder={`Enter ${changePasswordString}`}
        value={currentPassword}
        onChange={(e) => passwordHandler("current", e.target.value)}
        error={error.currentPassword}
        mb={"md"}
      />
      <PasswordInput
        withAsterisk
        label={`New ${changePasswordString}`}
        placeholder={`Enter new ${changePasswordString}`}
        value={newPassword}
        onChange={(e) => passwordHandler("new", e.target.value)}
        error={error.newPassword}
        mb={"md"}
      />
      <PasswordInput
        withAsterisk
        label={`Confirm new ${changePasswordString}`}
        placeholder={`Confirm ${changePasswordString}`}
        value={confirmPassword}
        onChange={(e) => passwordHandler("confirm", e.target.value)}
        error={error.confirmPassword}
        mb={"md"}
      />

      <Button onClick={submitPassword} loading={loading}>
        Submit
      </Button>
    </Paper>
  );
};

export default ChangePassword;

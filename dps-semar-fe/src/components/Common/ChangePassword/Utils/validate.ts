
export const validatePasswords = (passwords, error, setError) => {
  let isValid = true;

  if (passwords.currentPassword.length < 8) {
    setError((prev) => ({
      ...prev,
      currentPassword: "Current password must be at least 8 characters long.",
    }));
    isValid = false;
  }


  if (passwords.newPassword.length < 8) {
    setError((prev) => ({
      ...prev,
      newPassword: "New password must be at least 8 characters long.",
    }));
    isValid = false;
  }


  if (passwords.confirmPassword.length < 8) {
    setError((prev) => ({
      ...prev,
      confirmPassword: "Confirm password must be at least 8 characters long.",
    }));
    isValid = false;
  }


  if (passwords.newPassword !== passwords.confirmPassword) {
    setError((prev) => ({
      ...prev,
      confirmPassword: "New password and confirm password do not match.",
    }));
    isValid = false;
  }

  return isValid;
};

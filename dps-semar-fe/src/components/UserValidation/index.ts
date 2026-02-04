// import { UserToEdit } from "../types";

// export const UserValidation = (formValues: UserToEdit) => {
//   const errors: Partial<Record<keyof UserToEdit, string>> = {};

//   if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(formValues.firstName)) {
//     errors.firstName = "First Name must contain only letters";
//   }

//   if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(formValues.lastName)) {
//     errors.lastName = "Last Name must contain only letters";
//   }

//   if (!/^[a-z0-9_]{4,16}$/.test(formValues.username)) {
//     errors.username =
//       "Username must contain only lowercase letters, numbers, and underscores and be between 4 to 16 characters long";
//   }

//   if (!formValues.id && !formValues.password) {
//     errors.password = "Password is required";
//   } else if (
//     formValues.password &&
//     !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
//       formValues.password
//     )
//   ) {
//     errors.password =
//       "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character from @$!%*?&";
//   }

//   if (!formValues.id && formValues.password !== formValues.confirmPassword) {
//     errors.confirmPassword = "Passwords do not match";
//   }

//   return errors;
// };

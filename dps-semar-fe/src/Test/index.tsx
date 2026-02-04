// import React, { useState } from "react";
// import { Tabs, Button } from "@mantine/core";
// import VerifyPassword from "../components/VerifyPassword";
// import { showNotification } from "@mantine/notifications";

// function Test() {
//   const [opened, setOpened] = useState(false);

//   const handleSuccess = async (password) => {
//     setOpened(false);

//     try {
//       const isValid = await verifyPasswordApi(password);
//       if (isValid) {
//         showNotification({
//           title: "Success",
//           message: "Password is correct!",
//           color: "green",
//         });
//       } 
//     } catch (error) {
//       showNotification({
//         title: "Error",
//         message: error.message || "Password verification failed.",
//         color: "red",
//       });
//     }
//   };

//   const handleCancel = () => {
//     setOpened(false);
//   };

//   const verifyPasswordApi = async (password) => {
//     try {
//       const response = await fetch("merchant/verify-withdrawal-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: 1, password }),
//       });
//       const result = await response.json();
//       return result.isValid; 
//     } catch (error) {
//       console.error("API error:", error);
//       throw error;
//     }
//   };

//   return (
//     <>
//       <Button onClick={() => setOpened(true)}>Open</Button>

//       <VerifyPassword
//         opened={opened}
//         handleSuccess={handleSuccess} 
//         handleCancel={handleCancel}
//       />
//     </>
//   );
// }

// export default Test;

import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const App: React.FC = () => {
  return (
    <MantineProvider
      theme={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",

        primaryColor: "brand",
        cursorType: "pointer",
        colors: {
          brand: [
            "#fef3e6",
            "#fde0c4",
            "#fbc99a",
            "#f9b070",
            "#f79746",
            "#e87d1c",
            "#A85706",
            "#8c4505",
            "#703604",
            "#5c2d03",
          ],
        },
      }}
    >
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;

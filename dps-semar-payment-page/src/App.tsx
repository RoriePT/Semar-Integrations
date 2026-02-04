import React from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import { router } from "./routes";

const theme = createTheme({
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  primaryColor: "brand",
  cursorType: "pointer",
  colors: {
    brand: [
      "#fef5eb",
      "#fde8d4",
      "#fad4a8",
      "#f5b96d",
      "#ed9a3a",
      "#e07c15",
      "#A85706",
      "#8c4605",
      "#703604",
      "#542703",
    ],
  },
});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};

export default App;

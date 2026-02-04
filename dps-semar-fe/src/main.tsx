// Main entry point for the DPS Frontend application
import "@mantine/dates/styles.css";
import "@xyflow/react/dist/style.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

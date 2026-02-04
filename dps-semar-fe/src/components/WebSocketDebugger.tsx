import { Badge, Box, Paper, Stack, Text, Title } from "@mantine/core";
import { useDashboardUser } from "../pages/Dashboard/DashboardProvider";

/**
 * WebSocket Debugger Component
 * Add this to your UPI Vendor dashboard to see real-time WebSocket status
 *
 * Usage:
 * import WebSocketDebugger from "../../components/WebSocketDebugger";
 * <WebSocketDebugger />
 */
const WebSocketDebugger = () => {
  const { userData, notifications, alerts } = useDashboardUser();

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Stack gap="sm">
        <Title order={4}>🔌 WebSocket Debug Info</Title>

        <Box>
          <Text size="sm" fw={500}>
            User ID:
          </Text>
          <Text size="sm" c="dimmed">
            {userData?.id || "N/A"}
          </Text>
        </Box>

        <Box>
          <Text size="sm" fw={500}>
            User Type:
          </Text>
          <Text size="sm" c="dimmed">
            {userData?.userType || "N/A"}
          </Text>
        </Box>

        <Box>
          <Text size="sm" fw={500}>
            User Role:
          </Text>
          <Text size="sm" c="dimmed">
            {userData?.userRole || "N/A"}
          </Text>
        </Box>

        <Box>
          <Text size="sm" fw={500}>
            Notifications Count:
          </Text>
          <Badge color="brand" size="lg">
            {notifications?.length || 0}
          </Badge>
        </Box>

        <Box>
          <Text size="sm" fw={500}>
            Alerts Count:
          </Text>
          <Badge color="red" size="lg">
            {alerts?.length || 0}
          </Badge>
        </Box>

        <Box>
          <Text size="xs" c="dimmed" mt="md">
            ℹ️ Open browser console (F12) to see detailed WebSocket logs
          </Text>
        </Box>

        <Box>
          <Text size="xs" c="dimmed">
            Expected console logs:
          </Text>
          <Text size="xs" c="dimmed">
            ✅ CONNECTED
          </Text>
          <Text size="xs" c="dimmed">
            ✅ ROOM JOINED
          </Text>
          <Text size="xs" c="dimmed">
            📬 NEW NOTIFICATION! (when payin submitted)
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
};

export default WebSocketDebugger;

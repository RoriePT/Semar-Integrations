import { Badge } from "@mantine/core";

const WithdrawalsBadge = ({ status, size, fullWidth = false }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "yellow";
      case "complete":
        return "green";
      case "rejected":
        return "gray";
      case "failed":
        return "red";
    }
  };
  return (
    <Badge size={size} color={getStatusColor()} fullWidth={fullWidth}>
      {status}
    </Badge>
  );
};

export default WithdrawalsBadge;

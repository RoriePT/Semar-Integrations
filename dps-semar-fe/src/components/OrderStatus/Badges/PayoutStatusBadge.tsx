import { Badge } from "@mantine/core";

const PayoutStatusBadge = ({ status, size, fullWidth = false }) => {
  const getStatusColor = () => {
    switch (status) {
      case "initiated":
        return "gray";
      case "assigned":
        return "grape";
      case "submitted":
        return "yellow";
      case "complete":
        return "green";
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

export default PayoutStatusBadge;

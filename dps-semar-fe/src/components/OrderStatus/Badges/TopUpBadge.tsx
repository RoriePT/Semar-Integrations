import { Badge } from "@mantine/core";

const TopUpBadge = ({ status, size, fullWidth = false }) => {
  const getStatusColor = () => {
    switch (status) {
      case "submitted":
        return "yellow";
      case "assigned":
        return "grape";
      case "complete":
        return "green";
      case "rejected":
        return "red";
      case "initiated":
        return "gray";
    }
  };
  return (
    <Badge size={size} color={getStatusColor()} fullWidth={fullWidth}>
      {status}
    </Badge>
  );
};

export default TopUpBadge;

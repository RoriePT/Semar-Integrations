import { Box, Divider, Flex, Paper, Badge, Title, Text } from "@mantine/core";
import InfoRow from "../../../InfoRow";
import { formatDateIST } from "../../../../utils";

const UpiVendor = ({ userDetails }) => {
  // Format role display (UPI_VENDOR -> UPI Vendor)
  const formatRole = (role) => {
    if (!role) return "UPI Vendor";
    return role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <Flex justify={"space-between"}>
        <Box>
          <InfoRow label="Name" value={userDetails?.name} />
          <InfoRow label="Email" value={userDetails?.email} />
          <InfoRow
            label="Registered on"
            value={formatDateIST(userDetails?.joinedOn)}
          />
        </Box>
        <Box>
          <InfoRow label="Role" value={formatRole(userDetails?.role)} />
          <InfoRow label="Phone" value={userDetails?.phone} />
          <InfoRow
            label="Status"
            value={userDetails?.status ? "ENABLED" : "DISABLED"}
          />
        </Box>
      </Flex>

      <Divider my={"md"} />

      <InfoRow 
        label="Commission Rate" 
        value={`${userDetails?.commissionRate || 0}%`} 
      />
      <InfoRow
        label="Total Settlement Amount"
        value={`₹${userDetails?.totalSettlementAmount || 0}`}
      />
      <InfoRow
        label="Total Payin Orders"
        value={userDetails?.totalPayinOrders || "0"}
      />
      <InfoRow
        label="Completed Payins"
        value={userDetails?.completedPayins || "0"}
      />
      <InfoRow
        label="Total Commission Earned"
        value={`₹${userDetails?.totalCommissionEarned || 0}`}
      />
      <InfoRow
        label="Number of UPI IDs"
        value={userDetails?.numberOfUpiIds || "0"}
      />

      {userDetails?.upiIds && userDetails.upiIds.length > 0 && (
        <>
          <Divider my={"md"} />
          <Title order={4} mb="sm" c="#101113">
            UPI IDs
          </Title>
          <Flex direction="column" gap="md">
            {userDetails.upiIds.map((upi, index) => (
              <Paper
                key={upi.upiIdValue || index}
                p="md"
                radius="md"
                withBorder
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <Flex justify="space-between" align="flex-start" mb="xs">
                  <Box style={{ flex: 1 }}>
                    <Flex align="center" gap="xs" mb="xs">
                      <Text fw={600} size="sm">
                        {upi.title || `UPI ID ${index + 1}`}
                      </Text>
                      <Badge
                        color={upi.enabled ? "green" : "red"}
                        variant="light"
                        size="sm"
                      >
                        {upi.enabled ? "ENABLED" : "DISABLED"}
                      </Badge>
                    </Flex>
                    <Text size="sm" c="dimmed">
                      {upi.upiId}
                    </Text>
                  </Box>
                </Flex>
                <Divider my="xs" />
                <Flex direction="row" justify="space-between" wrap="wrap">
                  <Flex gap="xs">
                    <Text size="sm" fw={500}>
                      Settlement Amount:
                    </Text>
                    <Text size="sm">{`₹${upi.settlementAmount || 0}`}</Text>
                  </Flex>
                  <Flex gap="xs">
                    <Text size="sm" fw={500}>
                      Commission Earned:
                    </Text>
                    <Text size="sm">{`₹${upi.commissionEarned || 0}`}</Text>
                  </Flex>
                </Flex>
              </Paper>
            ))}
          </Flex>
        </>
      )}
    </>
  );
};

export default UpiVendor;


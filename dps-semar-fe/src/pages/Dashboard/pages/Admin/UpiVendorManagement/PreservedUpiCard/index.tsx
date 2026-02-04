import { Badge, Flex, Paper, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import UpiVendorAPIs from "../../../../../../api/upiVendor";
import CopyButton from "../../../../../../components/CopyButton";

interface PreservedUpiCardProps {}

const PreservedUpiCard: React.FC<PreservedUpiCardProps> = () => {
  const [preservedData, setPreservedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchPreservedUpi = async () => {
      setLoading(true);
      try {
        const data = await UpiVendorAPIs.getPreservedUpi();
        setPreservedData(data);
      } catch (error) {
        console.error("Error fetching preserved UPI:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreservedUpi();
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  // Show card even when no preserved UPI
  if (!preservedData?.isPreserved || !preservedData?.preservedUpi) {
    return (
      <Paper
        p="md"
        mb="md"
        radius="md"
        withBorder
        style={{
          backgroundColor: "#f8f9fa",
          borderColor: "#e9ecef",
        }}
      >
        <Flex direction="column" gap="xs">
          <Flex justify="space-between" align="center">
            <Title order={5}>Next Available UPI ID</Title>
            <Badge color="gray" variant="light">
              Not Preserved
            </Badge>
          </Flex>
          <Text size="xs" c="dimmed">
            This UPI ID will be assigned to the next upcoming payin order for
            merchants where UPI vendor is enabled.
          </Text>
          <Text size="sm" c="dimmed" mt="xs">
            {preservedData?.message || "No UPI ID is currently preserved"}
          </Text>
        </Flex>
      </Paper>
    );
  }

  const { preservedUpi } = preservedData;
  const vendor = preservedUpi.vendor;

  return (
    <Paper
      p="md"
      mb="md"
      radius="md"
      withBorder
      style={{
        backgroundColor: "#f8f9fa",
        borderColor: "#e9ecef",
      }}
    >
      <Flex direction="column" gap="xs">
        <Flex justify="space-between" align="center">
          <Title order={5}>Next Available UPI ID</Title>
          <Badge color="brand" variant="light">
            Active
          </Badge>
        </Flex>
        <Text size="xs" c="dimmed">
          This UPI ID will be assigned to the next upcoming payin order for
          merchants where UPI vendor is enabled.
        </Text>

        <Flex
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? "xs" : "md"}
          align="center"
          wrap="wrap"
        >
          <Flex gap="xs" align="center">
            <Text size="sm" c="dimmed">
              Title:
            </Text>
            <Text size="sm" fw={500}>
              {preservedUpi.title || "-"}
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <Text size="sm" c="dimmed">
              UPI ID:
            </Text>
            <Flex align="center" gap="xs">
              <Text size="sm" fw={500}>
                {preservedUpi.upiId || "-"}
              </Text>
              <CopyButton value={preservedUpi.upiId} />
            </Flex>
          </Flex>
          {vendor && (
            <Flex gap="xs" align="center">
              <Text size="sm" c="dimmed">
                Vendor:
              </Text>
              <Text size="sm" fw={500}>
                {vendor.name || "-"}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Paper>
  );
};

export default PreservedUpiCard;

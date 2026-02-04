import { Box, Center, Flex, Grid, Paper, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getUser } from "../../../../../api/common";
import Icon from "../../../../../assets/member.png";
import InfoRow from "../../../../../components/InfoRow";

const MyAccount = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUser("upi-vendor");
      setData(res);
    };
    fetchData();
  }, []);

  const email = data?.email || "Not Provided";
  const phone = data?.phone || "Not Provided";
  const fullName = data
    ? `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Not Provided"
    : "Not Provided";
  const status =
    data?.enabled !== undefined ? (data.enabled ? "Enabled" : "Disabled") : "-";
  const createdAt = data?.createdAt
    ? new Date(data.createdAt).toLocaleString()
    : "-";
  const commissionRate =
    data?.commissionRate !== undefined && data?.commissionRate !== null
      ? `${data.commissionRate}%`
      : "-";

  const isTablet = useMediaQuery("(min-width: 768px)");

  return (
    <div>
      <Paper p={"lg"}>
        <Flex
          justify={"space-between"}
          align={"center"}
          style={{
            flexDirection: isTablet ? "row" : "column",
            gap: isTablet ? "20px" : "10px",
          }}
        >
          <Flex
            gap={"md"}
            align={"center"}
            style={{ flexDirection: isTablet ? "row" : "column" }}
          >
            <img
              src={Icon}
              alt=""
              style={{
                width: "80px",
                borderRadius: "50%",
                boxShadow: "rgba(0,0,0,0.05) 0px 0px 0px 1px",
                padding: "10px",
              }}
            />
            <Box>
              <Title order={3}>{fullName}</Title>
              <Text ta={isTablet ? "left" : "center"}>UPI Vendor Account</Text>
            </Box>
          </Flex>

          <Box>
            <InfoRow label={"Email"} value={email} />
            <InfoRow label={"Phone"} value={phone} />
          </Box>
        </Flex>
      </Paper>

      <Grid grow justify="flex-start" align="stretch" mt={"lg"}>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper p={"lg"} radius={"md"} h={"100%"}>
            <Center mb={"lg"}>
              <Title order={3}>Account Details</Title>
            </Center>
            <InfoRow label={"Status"} value={status} />
            <InfoRow label={"Commission Rate"} value={commissionRate} />
            <InfoRow label={"Registered On"} value={createdAt} />
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default MyAccount;

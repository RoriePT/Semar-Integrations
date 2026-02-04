import {
  Alert,
  Box,
  Button,
  Code,
  CopyButton,
  Divider,
  Flex,
  Group,
  List,
  Radio,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { BsCopy } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDashboardUser } from "../../../DashboardProvider";

const Step1 = () => {
  const { userData } = useDashboardUser();
  const [environment, setEnvironment] = useState("live");

  const code = `<script 
src="https://s3.ap-southeast-1.amazonaws.com/www.kingsgate-payments.com/integration.js"
id="kg-integration-kit"
kg-integration-id="${userData.integrationId}"
kg-environment="${environment.toLowerCase()}"></script>`;

  return (
    <Box>
      <Box mt={"lg"}>
        <Flex align={"center"} gap={"xs"}>
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              borderRadius: "6px",
            }}
          >
            <Text size="xl" fw={500} px={"md"}>
              Step 1
            </Text>
          </div>

          <Text size="xl" fw={500}>
            Set Up Semar Integration on Your Website
          </Text>
        </Flex>
      </Box>
      <Box
        p={"md"}
        mt={"md"}
        style={{
          borderRadius: "6px",
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        }}
      >
        <Text size="lg">a) Select Integration Environment</Text>

        <Radio.Group value={environment} onChange={setEnvironment} size="lg">
          <Group mt={"sm"}>
            <Radio value="live" label="Live Environment" size="md" />
            <Radio value="sandbox" label="Sandbox Environment" size="md" />
          </Group>
        </Radio.Group>

        <Divider my={"md"} />

        <Text size="lg" mb={"sm"}>
          b) Copy the code below and paste it into the{" "}
          <Code color="pink.0" c={"pink"} fz={"md"}>
            {"<head>"}
          </Code>{" "}
          section of your website's HTML.
        </Text>

        <Box bg="#282A36" px={"md"} py={"xs"} pos={"relative"}>
          <div
            style={{
              margin: 0,
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
          >
            <CopyButton value={code} timeout={10000}>
              {({ copied, copy }) => (
                <Button
                  variant="white"
                  color={copied ? "teal" : "brand"}
                  onClick={copy}
                  leftSection={<BsCopy />}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              )}
            </CopyButton>
          </div>

          <SyntaxHighlighter language="html" style={dracula}>
            {code}
          </SyntaxHighlighter>
        </Box>

        <Alert
          // display={"none"}
          title="Note: Integration Environments"
          color="brand"
          mt={"md"}
        >
          Semar offers two integration environments: Live and Sandbox.
          <List size="sm" mb={"sm"}>
            <List.Item>
              Live environment activates real transactions on your website,
              allowing users to make actual payments.
            </List.Item>
            <List.Item>
              Sandbox environment is a testing environment where you can safely
              verify your integration without processing real transactions.
            </List.Item>
          </List>
          Once you've selected your preferred mode, copy the updated code above
          again and paste it into your website to apply the changes.
        </Alert>
      </Box>
    </Box>
  );
};

export default Step1;

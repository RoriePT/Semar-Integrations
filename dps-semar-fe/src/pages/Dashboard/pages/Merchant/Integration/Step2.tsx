import { Box, Button, Code, CopyButton, Flex, List, Text } from "@mantine/core";

import { BsCopy } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDashboardUser } from "../../../DashboardProvider";

const Step2 = () => {
  const { userData } = useDashboardUser();

  const code = `<script>
  // Fetch the details of the currently logged-in user.
  function fetchUserDetails() {
    return {
        userId: "user123", // Replace with the actual unique user ID from your system
        userName: "John Doe", // Replace with the user's full name
        userEmail: "johndoe@gmail.com", // Optional but required for receipt generation.
        userMobileNumber: "9876543210" // Optional but required for receipt generation.
      };
  }

  const userConfig = fetchUserDetails(); 

  // Initialize the Integration
  KgPaymentIntegration.init({
    config: userConfig,
    handleSuccess: (orderDetails) => {
        // This function will be called if the payment is successful
        // Customize it to handle the success scenario 
        // (e.g., show confirmation, update order status)
    },
    handleFailure: (orderDetails) => {
        // This function will be called if the payment fails
        // Customize it to handle failure 
        // (e.g., show error message, prompt for retry)
    },
  });
</script>`;

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
              Step 2
            </Text>
          </div>

          <Text size="xl" fw={500}>
            Setup User Details and Payment Handlers
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
        <Text size="lg" mb={"sm"}>
          Copy the code below and paste it just before the closing{" "}
          <Code color="pink.0" c={"pink"} fz={"md"}>
            {"</body>"}
          </Code>{" "}
          tag of your website's HTML.
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

        <List mb={"sm"}>
          <List.Item my={"md"}>
            <strong style={{ fontWeight: 500 }}>User Details:</strong> In the{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              fetchUserDetails
            </Code>{" "}
            function, you can retrieve the logged-in user’s details from sources
            like cookies, your backend, or session storage. Make sure to replace
            the sample values of{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              userId
            </Code>
            ,{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              userMobileNumber
            </Code>
            ,{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              userEmail
            </Code>
            , and{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              userName
            </Code>{" "}
            fields with the actual details of the logged-in user from your
            system.
          </List.Item>
          <List.Item my={"md"}>
            <strong style={{ fontWeight: 500 }}>Receipt Generation:</strong> The{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              userMobileNumber
            </Code>{" "}
            and{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              userEmail
            </Code>{" "}
            fields are optional but required if you plan to generate receipts.
            If either of these details is missing, receipts will not be
            generated for the user. Be sure to check that these fields are
            provided if receipt generation is needed.
          </List.Item>
          <List.Item>
            <strong style={{ fontWeight: 500 }}>Payment Handlers:</strong> The
            code includes{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              handleSuccess
            </Code>{" "}
            and{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              handleFailure
            </Code>{" "}
            functions. Customize these functions to handle what should happen
            after a payment succeeds or fails (e.g., show a success message,
            update user records, etc.).
          </List.Item>
        </List>
      </Box>
    </Box>
  );
};

export default Step2;

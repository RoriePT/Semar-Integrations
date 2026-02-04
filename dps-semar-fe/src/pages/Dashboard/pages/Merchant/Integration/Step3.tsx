import { Box, Button, Code, CopyButton, Flex, List, Text } from "@mantine/core";
import { BsCopy } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useDashboardUser } from "../../../DashboardProvider";

const Step3 = () => {
  const { userData } = useDashboardUser();

  const code = `<button kg-payment-amount="1000" kg-order-id="product_5671">Pay ₹1000</button>
<button kg-payment-amount="1524" kg-order-id="product_5672">Pay ₹1524</button>
<button kg-payment-amount="2300" kg-order-id="product_5673">Pay ₹2300</button>
<button kg-payment-amount="1001" kg-order-id="product_5674">Pay ₹1001</button>`;

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
              Step 3
            </Text>
          </div>

          <Text size="xl" fw={500}>
            Setup Payment Buttons
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
          Use the code below as an example to set up payment buttons on your
          website. Ensure that the buttons are placed inside the{" "}
          <Code color="pink.0" c={"pink"} fz={"md"}>
            {"<body>"}
          </Code>{" "}
          tag.
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

        <List mt={"sm"}>
          <List.Item>
            <strong style={{ fontWeight: 500 }}>Payment Amount:</strong> Replace
            the{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              kg-payment-amount
            </Code>{" "}
            value with the actual amount to be paid.
          </List.Item>
          <List.Item>
            <strong style={{ fontWeight: 500 }}>Order ID:</strong> Update the{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              kg-order-id
            </Code>{" "}
            to reflect the unique order ID associated with the transaction.
          </List.Item>

          <List.Item>
            <strong style={{ fontWeight: 500 }}>Button Tag:</strong> While this
            example uses a <Code fz={"sm"}>{"<button>"}</Code>, you can replace
            it with any HTML element (such as <Code fz={"sm"}>{"<div>"}</Code>,{" "}
            <Code fz={"sm"}>{"<span>"}</Code>, or <Code fz={"sm"}>{"<a>"}</Code>
            ) to suit your design needs. Just make sure the{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              {"<kg-payment-amount>"}
            </Code>{" "}
            and{" "}
            <Code color="pink.0" c={"pink"} fz={"sm"}>
              {"<kg-order-id>"}
            </Code>{" "}
            attributes remain intact.
          </List.Item>

          <List.Item>
            <strong style={{ fontWeight: 500 }}>Button Text:</strong> You can
            customize the text within the button or element to reflect the
            payment details or action (e.g., "Pay Now", "Complete Purchase").
          </List.Item>
        </List>
      </Box>
    </Box>
  );
};

export default Step3;

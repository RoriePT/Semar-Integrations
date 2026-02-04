import React from "react";

import {
  Box,
  Button,
  CopyButton,
  Divider,
  Flex,
  Grid,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IoCopyOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useState, useEffect } from "react";

import GPay from "../../../assets/intent/gpay.png";
import Phonepe from "../../../assets/intent/phonepe.png";
import Paytm from "../../../assets/intent/paytm.png";
import { generateUpiPayLinks } from "../../../utils/intent";

const UPI = ({
  name,
  amount,
  upiId,
  isBusinessUpi,
  qrCode,
  isVendorGateway = false,
  trackingId = undefined,
  tr = null,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    const ua =
      navigator.userAgent || navigator.vendor || (window as any).opera || "";
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(ua);
    setIsMobile(isMobileDevice);
  }, []);

  const downloadCode = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `QR_${upiId}`; // specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPaymentApp = (payApp: "PAYTM" | "GPAY" | "PHONEPE" | "OTHER") => {
    setSelectedApp(payApp);
    let url = "";

    const data = generateUpiPayLinks({
      pa: upiId,
      pn: name,
      am: amount,
      tr: tr,
      tn: trackingId,
    });

    if (payApp === "OTHER") {
      url = data.links.generic;
    } else {
      switch (payApp) {
        case "PAYTM":
          url = data.links.paytm;
          break;
        case "GPAY":
          url = data.links.gpay;
          break;
        case "PHONEPE":
          url = data.links.phonepe;
          break;
      }
    }

    window.open(url, "_blank");
  };
  // const isMobile = true;
  const shouldHideQRCode = isVendorGateway && isMobile;

  return (
    <>
      {!shouldHideQRCode && (
        <>
          <Paper p="sm">
            <Box ta={"center"}>
              <Title order={4}>Pay via QR code</Title>
              {isMobile ? (
                <Text size="xs" c={"gray"} mb={"sm"}>
                  Download this QR code and then use it with any UPI app
                </Text>
              ) : (
                <Text size="xs" c={"gray"} mb={"sm"}>
                  Scan this QR code with any UPI app
                </Text>
              )}

              <Stack justify="center" align="center">
                <img
                  src={qrCode}
                  width={isMobile ? "100px" : "120px"}
                  id={"upi-qr-code"}
                />
                {isMobile && (
                  <Button
                    variant="light"
                    size="xs"
                    onClick={downloadCode}
                    w={"fit-content"}
                    radius={"xl"}
                  >
                    Download QR Code
                  </Button>
                )}
              </Stack>
            </Box>
          </Paper>
          <Divider label="OR" my={"sm"} />
        </>
      )}
      {(!isMobile || !isBusinessUpi) && (
        <>
          {" "}
          <Paper p="sm">
            <Box ta={"center"}>
              <Title order={4}>Pay to UPI ID</Title>
              <Text size="xs" c={"gray"} mb={"sm"}>
                Make payment to the below UPI Id on a UPI app
              </Text>

              <div
                style={{
                  wordBreak: "break-word",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#646464",
                }}
              >
                {upiId}
              </div>
              <CopyButton value={upiId} timeout={10000}>
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    leftSection={<IoCopyOutline />}
                    mt={"xs"}
                    variant="light"
                    size="xs"
                    radius={"xl"}
                  >
                    {copied ? "UPI Id Copied" : "Copy UPI Id"}
                  </Button>
                )}
              </CopyButton>
            </Box>
          </Paper>
          <Paper p="sm" mt={"sm"}>
            <Box ta={"center"}>
              <Title order={4}>Payment Amount</Title>
              <Text size="xs" c={"gray"} mb={"sm"}>
                Transfer this amount only
              </Text>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#646464",
                }}
              >
                ₹{amount}
              </div>
              <CopyButton value={amount} timeout={10000}>
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    leftSection={<IoCopyOutline />}
                    mt={"xs"}
                    size="xs"
                    variant="light"
                    radius={"xl"}
                  >
                    {copied ? "Amount Copied" : "Copy Amount"}
                  </Button>
                )}
              </CopyButton>
            </Box>
          </Paper>
        </>
      )}
      {(isMobile && isBusinessUpi) || (isVendorGateway && isMobile) ? (
        <>
          {/* Payment Amount for Mobile Vendor Gateway */}
          {isVendorGateway && isMobile && (
            <Paper p="sm" mb="sm">
              <Box ta={"center"}>
                <Title order={4}>Payment Amount</Title>
                <Text size="xs" c={"gray"} mb={"sm"}>
                  Transfer this amount only
                </Text>

                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#646464",
                  }}
                >
                  ₹{amount}
                </div>
                <CopyButton value={amount} timeout={10000}>
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? "teal" : "blue"}
                      onClick={copy}
                      leftSection={<IoCopyOutline />}
                      mt={"xs"}
                      size="xs"
                      variant="light"
                      radius={"xl"}
                    >
                      {copied ? "Amount Copied" : "Copy Amount"}
                    </Button>
                  )}
                </CopyButton>
              </Box>
            </Paper>
          )}
          <Paper p="sm">
            <Box>
              <Title order={4} ta="center" mb="xs">
                Pay via an installed UPI app
              </Title>
              <Text size="xs" c={"gray"} ta="center" mb="md">
                Click on any of the following UPI apps
              </Text>

              <Stack gap="sm">
                <Box
                  style={{
                    background: "white",
                    border:
                      selectedApp === "GPAY"
                        ? "2px solid #A85706"
                        : "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => openPaymentApp("GPAY")}
                  onMouseEnter={(e) => {
                    if (selectedApp !== "GPAY") {
                      e.currentTarget.style.borderColor = "#adb5bd";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedApp !== "GPAY") {
                      e.currentTarget.style.borderColor = "#dee2e6";
                    }
                  }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap="md">
                      <img
                        src={GPay}
                        style={{ width: "48px", height: "48px" }}
                        alt="Google Pay"
                      />
                      <Text size="md" fw={500}>
                        Google Pay
                      </Text>
                    </Flex>
                    <Radio
                      checked={selectedApp === "GPAY"}
                      onChange={() => openPaymentApp("GPAY")}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Flex>
                </Box>

                <Box
                  style={{
                    background: "white",
                    border:
                      selectedApp === "PHONEPE"
                        ? "2px solid #A85706"
                        : "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => openPaymentApp("PHONEPE")}
                  onMouseEnter={(e) => {
                    if (selectedApp !== "PHONEPE") {
                      e.currentTarget.style.borderColor = "#adb5bd";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedApp !== "PHONEPE") {
                      e.currentTarget.style.borderColor = "#dee2e6";
                    }
                  }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap="md">
                      <img
                        src={Phonepe}
                        style={{ width: "48px", height: "48px" }}
                        alt="PhonePe"
                      />
                      <Text size="md" fw={500}>
                        PhonePe
                      </Text>
                    </Flex>
                    <Radio
                      checked={selectedApp === "PHONEPE"}
                      onChange={() => openPaymentApp("PHONEPE")}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Flex>
                </Box>

                <Box
                  style={{
                    background: "white",
                    border:
                      selectedApp === "PAYTM"
                        ? "2px solid #A85706"
                        : "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => openPaymentApp("PAYTM")}
                  onMouseEnter={(e) => {
                    if (selectedApp !== "PAYTM") {
                      e.currentTarget.style.borderColor = "#adb5bd";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedApp !== "PAYTM") {
                      e.currentTarget.style.borderColor = "#dee2e6";
                    }
                  }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap="md">
                      <img
                        src={Paytm}
                        style={{ width: "48px", height: "48px" }}
                        alt="Paytm"
                      />
                      <Text size="md" fw={500}>
                        Paytm
                      </Text>
                    </Flex>
                    <Radio
                      checked={selectedApp === "PAYTM"}
                      onChange={() => openPaymentApp("PAYTM")}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Flex>
                </Box>

                <Box
                  style={{
                    background: "white",
                    border:
                      selectedApp === "OTHER"
                        ? "2px solid #A85706"
                        : "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => openPaymentApp("OTHER")}
                  onMouseEnter={(e) => {
                    if (selectedApp !== "OTHER") {
                      e.currentTarget.style.borderColor = "#adb5bd";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedApp !== "OTHER") {
                      e.currentTarget.style.borderColor = "#dee2e6";
                    }
                  }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap="md">
                      <Box
                        style={{
                          width: "48px",
                          height: "48px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BsThreeDots size="32px" color="#495057" />
                      </Box>
                      <Text size="md" fw={500}>
                        Other UPI Apps
                      </Text>
                    </Flex>
                    <Radio
                      checked={selectedApp === "OTHER"}
                      onChange={() => openPaymentApp("OTHER")}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Flex>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </>
      ) : null}
    </>
  );
};

export default UPI;

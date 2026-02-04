import { Button, Center, Container, Drawer, Flex, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const TransactionReceipt = ({ opened, close, txnId, receipt }) => {
  let url = `https://kingsgate-assets.s3.ap-southeast-1.amazonaws.com/${receipt}`;

  const [src, setSrc] = useState(null);

  async function urlToBase64(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to convert to Base64"));
      reader.readAsDataURL(blob);
    });
  }

  const getBase64 = async () => {
    const base64 = await urlToBase64(url);

    setSrc(base64);
  };
  useEffect(() => {
    getBase64();
  }, [receipt, opened]);

  const handleDownload = async () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `Receipt-${txnId}`; // Specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Drawer opened={opened} onClose={close} title={"Transaction Receipt"}>
      <Flex align={"center"} justify={"center"} p={"md"} direction={"column"}>
        <img src={src} alt="" style={{ width: "100%" }} />
        <Flex mt={"xl"} gap={"4px"}>
          <Text fw={600}>Transaction Id:</Text>
          <Text>{txnId}</Text>
        </Flex>
      </Flex>
      <Center>
        <Button onClick={handleDownload}>Download</Button>
      </Center>
    </Drawer>
  );
};

export default TransactionReceipt;

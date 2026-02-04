import { ActionIcon, Tooltip, CopyButton as MCopyButton } from "@mantine/core";
import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

const CopyButton = ({ value }) => {
  return (
    <MCopyButton value={value} timeout={5000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
          <ActionIcon
            color={copied ? "teal" : "gray"}
            variant="subtle"
            onClick={copy}
          >
            {copied ? <FaCheck /> : <IoCopyOutline />}
          </ActionIcon>
        </Tooltip>
      )}
    </MCopyButton>
  );
};

export default CopyButton;

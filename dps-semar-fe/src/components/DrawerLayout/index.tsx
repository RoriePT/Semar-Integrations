import { Container, Drawer, Flex } from "@mantine/core";
import React from "react";
import { RxCross2 } from "react-icons/rx";

const DrawerLayout = ({
  opened,
  close,
  header,
  body,
  footer,
  position,
  closeOnOutsideClick,
  withCloseButton,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={close}
      title={false}
      position={position}
      closeOnClickOutside={closeOnOutsideClick}
      closeOnEscape={closeOnOutsideClick}
      withCloseButton={false}
      keepMounted={false}
    >
      <Container
        w={"100%"}
        p={0}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Flex
          justify={"space-between"}
          align={"center"}
          style={{
            flexShrink: 0,
            borderBottom: "1px solid gainsboro",
            padding: "16px",
          }}
        >
          <div style={{ width: "100%" }}>{header}</div>

          <RxCross2
            style={{ cursor: "pointer" }}
            size={"24px"}
            onClick={close}
          />
        </Flex>

        <div style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
          {body}
        </div>
        <div
          style={{
            flexShrink: 0,
            borderTop: "1px solid gainsboro",
            padding: "16px",
          }}
        >
          {footer}
        </div>
      </Container>
    </Drawer>
  );
};

export default DrawerLayout;

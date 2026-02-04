import { Container, Flex, Modal } from "@mantine/core";
import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

const ModalLayout = ({
  opened,
  close,
  header,
  body,
  footer,
  resetCallback = () => {},
  closeOnOutsideClick = true,
  isCentered = true,
  size = "md",
  fullHeight = false,
}) => {
  useEffect(() => {
    if (!opened)
      setTimeout(() => {
        resetCallback();
      }, 500);
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={false}
      centered={isCentered}
      closeOnClickOutside={closeOnOutsideClick}
      closeOnEscape={closeOnOutsideClick}
      withCloseButton={false}
      keepMounted={false}
      padding={0}
      size={size}
    >
      <Container
        w={"100%"}
        p={0}
        style={{
          height: fullHeight ? "calc(100vh - 132px)" : "100%",
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

        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {body}
        </div>
        {footer && (
          <div
            style={{
              flexShrink: 0,
              // borderTop: "1px solid gainsboro",
              padding: "16px",
            }}
          >
            {footer}
          </div>
        )}
      </Container>
    </Modal>
  );
};

export default ModalLayout;

import { Button, Flex, Modal } from "@mantine/core";
import React from "react";

const Confirmation = ({ opened, close, onConfirm, onCancel }) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Are you sure?"
      centered
      size={"sm"}
    >
      <Flex justify={"space-between"} align={"center"} gap={"md"}>
        <Button variant="outline" onClick={onCancel} fullWidth>
          No
        </Button>
        <Button onClick={onConfirm} fullWidth>
          Yes
        </Button>
      </Flex>
    </Modal>
  );
};

export default Confirmation;

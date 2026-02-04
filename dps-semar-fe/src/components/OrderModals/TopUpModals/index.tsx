import React, { useEffect, useState } from "react";
import AdminTopUp from "./AdminTopUp";
import UserTopUp from "./MemberTopUp";

// mode - admin, merchant,member

const TopUpModal = ({
  opened,
  close,
  mode,
  orderId,
  handlers,
  triggerReload,
  handleReload = () => {},
}) => {
  const [id, setId] = useState("");

  useEffect(() => {
    if (!opened) {
      setId("");
    } else setId(orderId);
  }, [opened, orderId]);

  if (!id) return <></>;

  if (mode === "admin")
    return (
      <AdminTopUp
        opened={opened}
        close={close}
        orderId={id}
        handlers={handlers}
        triggerReload={triggerReload}
        handleReload={handleReload}
      />
    );
  if (mode === "user")
    return (
      <UserTopUp
        opened={opened}
        close={close}
        orderId={id}
        handlers={handlers}
        triggerReload={triggerReload}
      />
    );
};

export default TopUpModal;

import React, { useEffect, useState } from "react";
import AdminPayout from "./AdminPayout";
import MerchantPayout from "./MerchantPayout";
import MemberPayout from "./MemberPayout";
// mode - admin, merchant,member

const PayoutModal = ({
  opened,
  close,
  mode,
  orderId,
  triggerReload,
  handlers,
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
      <AdminPayout
        opened={opened}
        close={close}
        orderId={id}
        triggerReload={triggerReload}
        handlers={handlers}
      />
    );
  if (mode === "merchant")
    return (
      <MerchantPayout
        opened={opened}
        close={close}
        orderId={id}
        triggerReload={triggerReload}
        handlers={handlers}
      />
    );
  if (mode === "member")
    return (
      <MemberPayout
        opened={opened}
        close={close}
        orderId={id}
        triggerReload={triggerReload}
        handlers={handlers}
      />
    );
};

export default PayoutModal;

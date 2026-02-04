import React, { useEffect, useState } from "react";
import AdminWithdrawal from "./AdminWithdrawal";
import UserWithdrawal from "./UserWithdrawal";

// mode - admin, merchant,member

const WithdrawalModals = ({ opened, close, mode, orderId, user, reload }) => {
  const [id, setId] = useState("");

  useEffect(() => {
    if (!opened) {
      setId("");
    } else setId(orderId);
  }, [opened, orderId]);

  if (!id) return <></>;

  if (mode === "admin")
    return (
      <AdminWithdrawal
        opened={opened}
        close={close}
        orderId={id}
        reload={reload}
      />
    );
  if (mode === "user")
    return (
      <UserWithdrawal opened={opened} close={close} orderId={id} user={user} />
    );
};

export default WithdrawalModals;

import { useEffect, useState } from "react";
import AdminPayin from "./AdminPayin";
import MemberPayin from "./MemberPayin";
import MerchantPayin from "./MerchantPayin";
import UpiVendorPayin from "./UpiVendorPayin";
// mode - admin, merchant, member, upi-vendor

const PayinModal = ({ opened, close, mode, orderId, reload = () => {} }) => {
  const [id, setId] = useState("");

  useEffect(() => {
    if (!opened) {
      setId("");
    } else setId(orderId);
  }, [opened, orderId]);

  if (!id) return <></>;

  if (mode === "admin")
    return <AdminPayin opened={opened} close={close} orderId={id} />;
  if (mode === "merchant")
    return <MerchantPayin opened={opened} close={close} orderId={id} />;
  if (mode === "member")
    return (
      <MemberPayin opened={opened} close={close} orderId={id} reload={reload} />
    );
  if (mode === "upi-vendor")
    return <UpiVendorPayin opened={opened} close={close} orderId={id} reload={reload} />;
};

export default PayinModal;

import { Stack } from "@mantine/core";

import { PaymentMethodCard } from "./PaymentMethodCard";

import UpiIcon from "../../assets/upi.png";
import NetbankingIcon from "../../assets/netbanking.png";
import EwalletIcon from "../../assets/e-wallet.png";

interface PaymentMethodsListProps {
  channels: string[];
  onChannelSelect: (channel: string) => void;
}

export const PaymentMethodsList = ({ channels, onChannelSelect }: PaymentMethodsListProps) => {
  const paymentMethods = [
    {
      type: "upi" as const,
      name: "UPI",
      description: "Pay instantly with any UPI App",
      icon: UpiIcon,
      channel: "upi",
    },
    {
      type: "netbanking" as const,
      name: "Netbanking",
      description: "Securely pay using your preferred bank account.",
      icon: NetbankingIcon,
      channel: "netbanking",
    },
    {
      type: "e-wallet" as const,
      name: "E-Wallet",
      description: "Use your digital wallet balance for a fast checkout.",
      icon: EwalletIcon,
      channel: "e-wallet",
    },
  ];

  return (
    <Stack gap={"md"}>
      {paymentMethods.map((method) => (
        (channels.includes(method.channel) || channels.length === 0) && (
          <PaymentMethodCard
            key={method.type}
            type={method.type}
            name={method.name}
            description={method.description}
            icon={method.icon}
            onClick={() => onChannelSelect(method.channel)}
          />
        )
      ))}
    </Stack>
  );
};

import { Button, Divider, Flex, Paper, Stack, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import {
  GatewayName,
  getCashfreeGateway,
  getPayuGateway,
  getPhonepeGateway,
  getRazorpayGateway,
  getUniqPayGateway,
  PaymentType,
  updateCashfree,
  updatePayu,
  updatePhonepe,
  updateRazorpay,
  updateUniqPay,
} from "../../../../../api/gateway";
import BenakpayIcon from "../../../../../assets/benakpay.png";
import CashfreeIcon from "../../../../../assets/cashfree.png";
import PayuIcon from "../../../../../assets/payu.png";
import PhonepeIcon from "../../../../../assets/phonepe.png";
import RazorpayIcon from "../../../../../assets/razorpay.png";
import ChannelConfigForm from "./ChannelConfigForm";
import KeysForm from "./KeyForm";

const Gateway = ({ gateway = GatewayName.PHONEPE }) => {
  const [keys, keysHandlers] = useDisclosure();
  const [channelConfig, channelConfigHandlers] = useDisclosure();
  const [enabledForIncoming, setEnabledForIncoming] = useState(false);
  const [enabledForOutgoing, setEnabledForOutgoing] = useState(false);

  useEffect(() => {
    const fetchGatewayData = async () => {
      let response;

      if (gateway === GatewayName.RAZORPAY) {
        response = await getRazorpayGateway();
      } else if (gateway === GatewayName.PHONEPE) {
        response = await getPhonepeGateway();
      } else if (gateway === GatewayName.UNIQPAY) {
        response = await getUniqPayGateway();
      } else if (gateway === GatewayName.PAYU) {
        response = await getPayuGateway();
      } else if (gateway === GatewayName.CASHFREE) {
        response = await getCashfreeGateway();
      }

      if (response) {
        if (gateway === GatewayName.RAZORPAY) {
          setEnabledForIncoming(response.incoming);
          setEnabledForOutgoing(response.outgoing);
        } else if (gateway === GatewayName.PHONEPE) {
          setEnabledForIncoming(response.incoming);
          setEnabledForOutgoing(response.outgoing);
        } else if (gateway === GatewayName.UNIQPAY) {
          setEnabledForIncoming(response.incoming);
          setEnabledForOutgoing(response.outgoing);
        } else if (gateway === GatewayName.PAYU) {
          setEnabledForIncoming(response.incoming);
          setEnabledForOutgoing(response.outgoing);
        } else if (gateway === GatewayName.CASHFREE) {
          setEnabledForIncoming(response.incoming);
          setEnabledForOutgoing(response.outgoing);
        }
      }
    };

    fetchGatewayData();
  }, [gateway]);

  const updateGateway = async (
    type: PaymentType,
    value: boolean,
    gateway: GatewayName
  ) => {
    if (gateway === GatewayName.RAZORPAY) {
      await updateRazorpay(type, value);
      type === PaymentType.INCOMING
        ? setEnabledForIncoming(value)
        : setEnabledForOutgoing(value);
    }
    if (gateway === GatewayName.PHONEPE) {
      await updatePhonepe(type, value);
      type === PaymentType.INCOMING
        ? setEnabledForIncoming(value)
        : setEnabledForOutgoing(value);
    }
    if (gateway === GatewayName.UNIQPAY) {
      await updateUniqPay(type, value);
      type === PaymentType.INCOMING
        ? setEnabledForIncoming(value)
        : setEnabledForOutgoing(value);
    }
    if (gateway === GatewayName.PAYU) {
      await updatePayu(type, value);
      type === PaymentType.INCOMING
        ? setEnabledForIncoming(value)
        : setEnabledForOutgoing(value);
    }
    if (gateway === GatewayName.CASHFREE) {
      await updateCashfree(type, value);
      type === PaymentType.INCOMING
        ? setEnabledForIncoming(value)
        : setEnabledForOutgoing(value);
    }
  };

  const getGatewayLogo = () => {
    if (gateway === GatewayName.PHONEPE) return PhonepeIcon;
    if (gateway === GatewayName.RAZORPAY) return RazorpayIcon;
    if (gateway === GatewayName.UNIQPAY) return BenakpayIcon;
    if (gateway === GatewayName.PAYU) return PayuIcon;
    if (gateway === GatewayName.CASHFREE) return CashfreeIcon;
  };

  return (
    <Paper px={"xl"} py={"md"}>
      <img style={{ width: "160px" }} src={getGatewayLogo()} alt="" />
      <Divider my={"md"} />
      <Stack gap={"xl"}>
        <Switch
          label={"Enabled for Incoming Transactions"}
          labelPosition="left"
          description="Determines whether this gateway is enabled for 3rd party PG payins throughout the system"
          checked={enabledForIncoming}
          onChange={(e) =>
            updateGateway(
              PaymentType.INCOMING,
              e.currentTarget.checked,
              gateway
            )
          }
        />

        <Switch
          label={"Enabled for Outgoing Transactions"}
          labelPosition="left"
          description="Determines whether this channel is enabled for  payouts and withdrawals via 3rd party API throughout the system"
          checked={enabledForOutgoing}
          onChange={(e) =>
            updateGateway(
              PaymentType.OUTGOING,
              e.currentTarget.checked,
              gateway
            )
          }
        />

        <Flex gap={"sm"}>
          <Button
            w={"100%"}
            leftSection={<FaLock />}
            variant="light"
            onClick={keysHandlers.open}
          >
            Merchant Keys
          </Button>
          <Button
            w={"100%"}
            leftSection={<FaGear />}
            onClick={channelConfigHandlers.open}
          >
            Channel Config
          </Button>
        </Flex>
      </Stack>

      <KeysForm opened={keys} handlers={keysHandlers} gateway={gateway} />

      <ChannelConfigForm
        opened={channelConfig}
        handlers={channelConfigHandlers}
        gateway={gateway}
      />
    </Paper>
  );
};

export default Gateway;

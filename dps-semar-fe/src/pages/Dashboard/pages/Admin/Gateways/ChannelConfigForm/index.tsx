import { Button, Flex, Tabs, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import {
  ChannelConfigData,
  ChannelName,
  GatewayName,
  getChannelSetting,
  PaymentType,
  updateChannelSetting,
} from "../../../../../../api/gateway";
import BenakpayIcon from "../../../../../../assets/benakpay.png";
import CashfreeIcon from "../../../../../../assets/cashfree.png";
import PayuIcon from "../../../../../../assets/payu.png";
import PhonepeIcon from "../../../../../../assets/phonepe.png";
import RazorpayIcon from "../../../../../../assets/razorpay.png";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import TabsLayout from "../../../../../../components/TabsLayout";
import IncomingConfig from "./Components/IncomingConfig";
import OutgoingConfig from "./Components/OutgoingConfig";
interface IncomingData {
  enabled: boolean;
  minAmount: number;
  maxAmount: number;
  upstreamFee: number;
}

interface OutgoingData {
  enabled: boolean;
  minAmount: number;
  maxAmount: number;
  upstreamFee: number;
}

interface PaymentGateway {
  id: number;
  gatewayName: GatewayName;
  type: PaymentType;
  channelName: ChannelName;
  enabled: boolean;
  minAmount: number;
  maxAmount: number;
  upstreamFee: number;
}

interface ChannelConfigFormProps {
  opened: boolean;
  handlers: any;
  gateway: GatewayName;
}

const ChannelConfigForm: React.FC<ChannelConfigFormProps> = ({
  opened,
  handlers,
  gateway,
}) => {
  const [allChannelSettings, setAllChannelSettings] = useState<
    PaymentGateway[] | []
  >([]);

  const [currentTab, setCurrentTab] = useState<PaymentType>(
    PaymentType.INCOMING
  );
  const [currentSubTab, setCurrentSubTab] = useState(ChannelName.UPI);

  const [incomingData, setIncomingData] = useState<IncomingData>({
    enabled: false,
    minAmount: null,
    maxAmount: null,
    upstreamFee: null,
  });

  const [outgoingData, setOutgoingData] = useState<OutgoingData>({
    enabled: false,
    minAmount: null,
    maxAmount: null,
    upstreamFee: null,
  });

  const [incomingErrors, setIncomingErrors] = useState<{
    [key: string]: string;
  }>({});
  const [outgoingErrors, setOutgoingErrors] = useState<{
    [key: string]: string;
  }>({});

  const filterData = (
    gatewayName: GatewayName,
    paymentType: PaymentType,
    channelName: ChannelName
  ) => {
    return allChannelSettings.filter(
      (item: PaymentGateway) =>
        item.channelName === channelName &&
        item.gatewayName === gatewayName.toUpperCase() &&
        item.type === paymentType
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getChannelSetting();
      setAllChannelSettings(data);
    };

    fetchData();
  }, [opened]);

  const validateIncoming = () => {
    const errors: { [key: string]: string } = {};
    const { minAmount, maxAmount, upstreamFee } = filterData(
      gateway,
      PaymentType.INCOMING,
      currentSubTab
    )[0];
    let hasErrors = false;

    if (minAmount <= 0) {
      errors.minAmount = "Minimum amount must be greater than 0";
      hasErrors = true;
    }
    if (maxAmount <= 0) {
      errors.maxAmount = "Maximum amount must be greater than 0";
      hasErrors = true;
    }
    if (upstreamFee < 0) {
      errors.upstreamFees = "Upstream fee must be a positive value";
      hasErrors = true;
    }

    setIncomingErrors(errors);
    return !hasErrors;
  };

  const validateOutgoing = () => {
    const errors: { [key: string]: string } = {};
    const { minAmount, maxAmount, upstreamFee } = filterData(
      gateway,
      PaymentType.OUTGOING,
      currentSubTab
    )[0];
    let hasErrors = false;

    if (minAmount <= 0) {
      errors.minAmount = "Minimum amount must be greather than 0";
      hasErrors = true;
    }
    if (maxAmount <= 0) {
      errors.maxAmount = "Maximum amount must be greater than 0";
      hasErrors = true;
    }
    if (upstreamFee < 0) {
      errors.upstreamFees = "Upstream fees must be a positive value";
      hasErrors = true;
    }

    setOutgoingErrors(errors);
    return !hasErrors;
  };

  const handleSaveAndContinue = async () => {
    let isValid = true;
    const validate =
      currentTab === PaymentType.INCOMING ? validateIncoming : validateOutgoing;
    isValid = validate();

    if (isValid) {
      const apiData: ChannelConfigData = filterData(
        gateway,
        currentTab,
        currentSubTab
      )[0];

      try {
        await updateChannelSetting(apiData);
        showNotification({
          title: "Success",
          message: "Data updated successfully!",
          color: "green",
        });
      } catch (error) {
        showNotification({
          title: "Error",
          message: "An error occurred while updating data.",
          color: "red",
        });
      }
    }
  };

  const getGatewayLogo = () => {
    if (gateway === GatewayName.PHONEPE) return PhonepeIcon;
    if (gateway === GatewayName.RAZORPAY) return RazorpayIcon;
    if (gateway === GatewayName.UNIQPAY) return BenakpayIcon;
    if (gateway === GatewayName.PAYU) return PayuIcon;
    if (gateway === GatewayName.CASHFREE) return CashfreeIcon;
  };

  const Header = (
    <Flex justify={"space-between"} align={"center"} mr={"md"}>
      <Title order={4}>Channel Config</Title>
      <img style={{ width: "100px" }} src={getGatewayLogo()} alt="" />
    </Flex>
  );

  const Body = (
    <Tabs
      defaultValue="incoming"
      variant="outline"
      value={currentTab}
      onChange={(value) => {
        if (value === PaymentType.INCOMING) {
          setCurrentTab(PaymentType.INCOMING);
        }
        if (value === PaymentType.OUTGOING) {
          setCurrentTab(PaymentType.OUTGOING);
        }
      }}
    >
      <Tabs.List>
        <Tabs.Tab value={PaymentType.INCOMING} w={"50%"}>
          Incoming transactions
        </Tabs.Tab>
        <Tabs.Tab value={PaymentType.OUTGOING} w={"50%"}>
          Outgoing transactions
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={PaymentType.INCOMING}>
        <Text my={"sm"} size="xs" c="gray">
          Configure settings for incoming transactions (Payins) on the gateway
          for each channel
        </Text>
        <TabsLayout
          currentValue={currentSubTab}
          isControlled={true}
          onChange={setCurrentSubTab}
          tabs={[
            { label: "UPI", value: ChannelName.UPI },
            { label: "Netbanking", value: ChannelName.BANKING },
            { label: "E-Wallet", value: ChannelName.E_WALLET },
          ]}
          tabPanels={[
            <IncomingConfig
              incomingData={
                filterData(gateway, PaymentType.INCOMING, ChannelName.UPI)[0]
              }
              setIncomingData={setAllChannelSettings}
              errors={incomingErrors}
            />,
            <IncomingConfig
              incomingData={
                filterData(
                  gateway,
                  PaymentType.INCOMING,
                  ChannelName.BANKING
                )[0]
              }
              setIncomingData={setAllChannelSettings}
              errors={incomingErrors}
            />,
            <IncomingConfig
              incomingData={
                filterData(
                  gateway,
                  PaymentType.INCOMING,
                  ChannelName.E_WALLET
                )[0]
              }
              setIncomingData={setAllChannelSettings}
              errors={incomingErrors}
            />,
          ]}
        />
      </Tabs.Panel>

      <Tabs.Panel value={PaymentType.OUTGOING}>
        <Text my={"sm"} size="xs" c="gray">
          Configure settings for outgoing transactions (Payouts and Withdrawals)
          on the gateway for each channel
        </Text>
        <TabsLayout
          currentValue={currentSubTab}
          isControlled={true}
          onChange={setCurrentSubTab}
          tabs={[
            { label: "UPI", value: ChannelName.UPI },
            { label: "Netbanking", value: ChannelName.BANKING },
            { label: "E-Wallet", value: ChannelName.E_WALLET },
          ]}
          tabPanels={[
            <OutgoingConfig
              outgoingData={
                filterData(gateway, PaymentType.OUTGOING, ChannelName.UPI)[0]
              }
              setOutgoingData={setAllChannelSettings}
              errors={outgoingErrors}
            />,
            <OutgoingConfig
              outgoingData={
                filterData(
                  gateway,
                  PaymentType.OUTGOING,
                  ChannelName.BANKING
                )[0]
              }
              setOutgoingData={setAllChannelSettings}
              errors={outgoingErrors}
            />,
            <OutgoingConfig
              outgoingData={
                filterData(
                  gateway,
                  PaymentType.OUTGOING,
                  ChannelName.E_WALLET
                )[0]
              }
              setOutgoingData={setAllChannelSettings}
              errors={outgoingErrors}
            />,
          ]}
        />
      </Tabs.Panel>
    </Tabs>
  );

  const Footer = (
    <Flex justify={"space-between"} align={"center"}>
      <>
        <Button variant="outline" onClick={handlers.close}>
          Cancel
        </Button>
        <Button onClick={handleSaveAndContinue}>Save</Button>
      </>
    </Flex>
  );

  return (
    <DrawerLayout
      opened={opened}
      close={handlers.close}
      header={Header}
      body={Body}
      footer={Footer}
      position={"right"}
      closeOnOutsideClick={false}
      withCloseButton={true}
    />
  );
};

export default ChannelConfigForm;

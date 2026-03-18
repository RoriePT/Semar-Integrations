import { createContext, useContext, useState, useEffect } from "react";
import { getAllChannels } from "../../api/channel";
import { systemConfig } from "../../api/systemConfig";
import { getAllGateways } from "../../api/gateway";
import { PaymentGatewayConfig } from "../../types/defaultConfig";

interface ContextTypes {
  channels: any;
  systemDefaults: PaymentGatewayConfig;
  gateways: any;
  setReload: any;
}

const DefaultContext = createContext<ContextTypes>(null);

export const useDefaultValues = () => {
  return useContext(DefaultContext);
};

export const DefaultProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [systemDefaults, setSystemDefaults] =
    useState<PaymentGatewayConfig>(null);
  const [gateways, setGateways] = useState([]);
  const [reload, setReload] = useState(false);

  const fetchChannels = async () => {
    const channelData = await getAllChannels();
    if (channelData) setChannels(channelData);
  };

  const fetchGateways = async () => {
    setGateways([
      "RAZORPAY",
      "PHONEPE",
      "UNIQPAY",
      "CASHFREE",
      "PAYU",
      "DOKU",
      "MIDTRANS",
      "XENDIT",
      "UPI_VENDOR",
    ]);
  };

  const fetchSystemDefaults = async () => {
    try {
      const defaults = await systemConfig();
      if (defaults) {
        setSystemDefaults(defaults);
      }
    } catch (error) {
      console.error("Error fetching system defaults:", error);
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchGateways();
    fetchSystemDefaults();
  }, [reload]);

  return (
    <DefaultContext.Provider
      value={{ channels, systemDefaults, gateways, setReload }}
    >
      {children}
    </DefaultContext.Provider>
  );
};

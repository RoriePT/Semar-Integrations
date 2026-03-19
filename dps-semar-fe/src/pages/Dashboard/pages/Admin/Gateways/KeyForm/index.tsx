import { Button, Flex, Text, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React, { useState } from "react";
import {
  GatewayName,
  updateCashfree,
  updateDoku,
  updateMidtrans,
  updatePayu,
  updatePhonepe,
  updateRazorpay,
  updateUniqPay,
  updateXendit,
} from "../../../../../../api/gateway";
import BenakpayIcon from "../../../../../../assets/benakpay.png";
import CashfreeIcon from "../../../../../../assets/cashfree.png";
import PayuIcon from "../../../../../../assets/payu.png";
import PhonepeIcon from "../../../../../../assets/phonepe.png";
import RazorpayIcon from "../../../../../../assets/razorpay.png";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import TabsLayout from "../../../../../../components/TabsLayout";
import CashfreeKeys from "./Components/CashfreeKeys";
import DokuKeys from "./Components/DokuKeys";
import MidtransKeys from "./Components/MidtransKeys";
import PayuKeys from "./Components/PayuKeys";
import PhonepeKeys from "./Components/PhonepeKeys";
import RazorPayKeys from "./Components/RazorPayKeys";
import UniqPayKeys from "./Components/UniqPayKeys";
import XenditKeys from "./Components/XenditKeys";

interface KetformProps {
  opened: boolean;
  handlers: any;
  gateway: GatewayName;
}

const KeysForm: React.FC<KetformProps> = ({ opened, handlers, gateway }) => {
  const [liveFields, setLiveFields] = useState({
    key_id: "",
    key_secret: "",
    secret_key: "",
    merchant_id: "",
    salt_key: "",
    salt_index: "",
    account_number: "",
    uniqpay_id: "",
    client_id: "",
    client_secret: "",
    payouts_client_id: "",
    payouts_client_secret: "",
    server_key: "",
    client_key: "",
    disbursement_merchant_id: "",
    disbursement_creator_api_key: "",
    disbursement_creator_merchant_key: "",
    disbursement_approver_api_key: "",
    disbursement_approver_merchant_key: "",
  });

  const [sandboxFields, setSandboxFields] = useState({
    sandbox_key_id: "",
    sandbox_key_secret: "",
    sandbox_secret_key: "",
    sandbox_merchant_id: "",
    sandbox_salt_key: "",
    sandbox_salt_index: "",
    sandbox_account_number: "",
    sandbox_client_id: "",
    sandbox_client_secret: "",
    sandbox_server_key: "",
    sandbox_client_key: "",
    sandbox_disbursement_merchant_id: "",
    sandbox_disbursement_creator_api_key: "",
    sandbox_disbursement_creator_merchant_key: "",
    sandbox_disbursement_approver_api_key: "",
    sandbox_disbursement_approver_merchant_key: "",
  });

  const [errors, setErrors] = useState({
    key_id: "",
    key_secret: "",
    secret_key: "",
    sandbox_key_id: "",
    sandbox_key_secret: "",
    sandbox_secret_key: "",
    merchant_id: "",
    salt_key: "",
    salt_index: "",
    sandbox_merchant_id: "",
    sandbox_salt_key: "",
    sandbox_salt_index: "",
    account_number: "",
    sandbox_account_number: "",
    uniqpay_id: "",
    client_id: "",
    client_secret: "",
    sandbox_client_id: "",
    sandbox_client_secret: "",
    payouts_client_id: "",
    payouts_client_secret: "",
    server_key: "",
    client_key: "",
    sandbox_server_key: "",
    sandbox_client_key: "",
    disbursement_merchant_id: "",
    disbursement_creator_api_key: "",
    disbursement_creator_merchant_key: "",
    disbursement_approver_api_key: "",
    disbursement_approver_merchant_key: "",
    sandbox_disbursement_merchant_id: "",
    sandbox_disbursement_creator_api_key: "",
    sandbox_disbursement_creator_merchant_key: "",
    sandbox_disbursement_approver_api_key: "",
    sandbox_disbursement_approver_merchant_key: "",
  });

  const [currentTab, setCurrentTab] = useState("live");

  const validateFields = () => {
    const newErrors = {
      key_id: "",
      key_secret: "",
      secret_key: "",
      sandbox_key_id: "",
      sandbox_key_secret: "",
      sandbox_secret_key: "",
      merchant_id: "",
      salt_key: "",
      salt_index: "",
      sandbox_merchant_id: "",
      sandbox_salt_key: "",
      sandbox_salt_index: "",
      account_number: "",
      sandbox_account_number: "",
      uniqpay_id: "",
      client_id: "",
      client_secret: "",
      sandbox_client_id: "",
      sandbox_client_secret: "",
      payouts_client_id: "",
      payouts_client_secret: "",
      server_key: "",
      client_key: "",
      sandbox_server_key: "",
      sandbox_client_key: "",
      disbursement_merchant_id: "",
      disbursement_creator_api_key: "",
      disbursement_creator_merchant_key: "",
      disbursement_approver_api_key: "",
      disbursement_approver_merchant_key: "",
      sandbox_disbursement_merchant_id: "",
      sandbox_disbursement_creator_api_key: "",
      sandbox_disbursement_creator_merchant_key: "",
      sandbox_disbursement_approver_api_key: "",
      sandbox_disbursement_approver_merchant_key: "",
    };

    let isValid = true;

    if (currentTab === "live") {
      if (gateway === GatewayName.RAZORPAY) {
        if (!liveFields.key_id) {
          newErrors.key_id = "Key ID is required.";
          isValid = false;
        }
        if (!liveFields.key_secret) {
          newErrors.key_secret = "Key Secret is required.";
          isValid = false;
        }
        if (!liveFields.account_number) {
          newErrors.account_number = "Account number is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.PHONEPE) {
        if (!liveFields.merchant_id) {
          newErrors.merchant_id = "Merchant ID is required.";
          isValid = false;
        }
        if (!liveFields.salt_key) {
          newErrors.salt_key = "Salt Key is required.";
          isValid = false;
        }
        if (!liveFields.salt_index) {
          newErrors.salt_index = "Salt Index is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.UNIQPAY) {
        if (!liveFields.uniqpay_id) {
          newErrors.uniqpay_id = "BenakPay ID is required.";
          isValid = false;
        }
        if (!liveFields.client_id) {
          newErrors.client_id = "BenakPay client ID is required.";
          isValid = false;
        }
        if (!liveFields.client_secret) {
          newErrors.client_secret = "BenakPay client secret is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.PAYU) {
        if (!liveFields.merchant_id) {
          newErrors.merchant_id = "Merchant ID is required.";
          isValid = false;
        }
        if (!liveFields.client_id) {
          newErrors.client_id = "PayU client ID is required.";
          isValid = false;
        }
        if (!liveFields.client_secret) {
          newErrors.client_secret = "PayU client secret is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.CASHFREE) {
        if (!liveFields.client_id) {
          newErrors.client_id = "Cashfree payins client ID is required.";
          isValid = false;
        }
        if (!liveFields.client_secret) {
          newErrors.client_secret =
            "Cashfree payins client secret is required.";
          isValid = false;
        }
        if (!liveFields.payouts_client_id) {
          newErrors.client_id = "Cashfree payouts client ID is required.";
          isValid = false;
        }
        if (!liveFields.payouts_client_secret) {
          newErrors.client_secret =
            "Cashfree payouts client secret is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.DOKU) {
        if (!liveFields.merchant_id) {
          newErrors.merchant_id = "DOKU merchant ID is required.";
          isValid = false;
        }
        if (!liveFields.client_id) {
          newErrors.client_id = "DOKU client ID is required.";
          isValid = false;
        }
        if (!liveFields.secret_key) {
          newErrors.secret_key = "DOKU secret key is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.MIDTRANS) {
        if (!liveFields.server_key) {
          newErrors.server_key = "Midtrans server key is required.";
          isValid = false;
        }
        if (!liveFields.client_key) {
          newErrors.client_key = "Midtrans client key is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.XENDIT) {
        if (!liveFields.secret_key) {
          newErrors.secret_key = "Xendit secret key is required.";
          isValid = false;
        }
      }
    } else if (currentTab === "sandbox") {
      if (gateway === GatewayName.RAZORPAY) {
        if (!sandboxFields.sandbox_key_id) {
          newErrors.sandbox_key_id = "Sandbox Key ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_key_secret) {
          newErrors.sandbox_key_secret = "Sandbox Key Secret is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_account_number) {
          newErrors.sandbox_account_number =
            "Sandbox account number is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.PHONEPE) {
        if (!sandboxFields.sandbox_merchant_id) {
          newErrors.sandbox_merchant_id = "Sandbox Merchant ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_salt_key) {
          newErrors.sandbox_salt_key = "Sandbox Salt Key is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_salt_index) {
          newErrors.sandbox_salt_index = "Sandbox Salt Index is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.PAYU) {
        if (!sandboxFields.sandbox_merchant_id) {
          newErrors.sandbox_merchant_id = "Sandbox Merchant ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_key_id) {
          newErrors.sandbox_key_id = "Sandbox client ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_key_secret) {
          newErrors.sandbox_key_secret = "Sandbox key secret is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.CASHFREE) {
        if (!sandboxFields.sandbox_client_id) {
          newErrors.sandbox_client_id = "Sandbox client ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_client_secret) {
          newErrors.sandbox_client_secret = "Sandbox key secret is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.DOKU) {
        if (!sandboxFields.sandbox_merchant_id) {
          newErrors.sandbox_merchant_id = "Sandbox merchant ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_client_id) {
          newErrors.sandbox_client_id = "Sandbox client ID is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_secret_key) {
          newErrors.sandbox_secret_key = "Sandbox secret key is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.MIDTRANS) {
        if (!sandboxFields.sandbox_server_key) {
          newErrors.sandbox_server_key = "Sandbox server key is required.";
          isValid = false;
        }
        if (!sandboxFields.sandbox_client_key) {
          newErrors.sandbox_client_key = "Sandbox client key is required.";
          isValid = false;
        }
      } else if (gateway === GatewayName.XENDIT) {
        if (!sandboxFields.sandbox_secret_key) {
          newErrors.sandbox_secret_key = "Sandbox secret key is required.";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateFields()) {
      let response;

      try {
        if (currentTab === "live") {
          if (gateway === GatewayName.PHONEPE) {
            response = await updatePhonepe(null, null, {
              merchant_id: liveFields.merchant_id,
              salt_key: liveFields.salt_key,
              salt_index: liveFields.salt_index,
            });
          } else if (gateway === GatewayName.RAZORPAY) {
            response = await updateRazorpay(null, null, {
              key_id: liveFields.key_id,
              key_secret: liveFields.key_secret,
              account_number: liveFields.account_number,
            });
          } else if (gateway === GatewayName.UNIQPAY) {
            response = await updateUniqPay(null, null, {
              uniqpay_id: liveFields.uniqpay_id,
              client_id: liveFields.client_id,
              client_secret: liveFields.client_secret,
            });
          } else if (gateway === GatewayName.PAYU) {
            response = await updatePayu(null, null, {
              merchant_id: liveFields.merchant_id,
              client_id: liveFields.client_id,
              client_secret: liveFields.client_secret,
            });
          } else if (gateway === GatewayName.CASHFREE) {
            response = await updateCashfree(null, null, {
              client_id: liveFields.client_id,
              client_secret: liveFields.client_secret,
              payouts_client_id: liveFields.payouts_client_id,
              payouts_client_secret: liveFields.payouts_client_secret,
            });
          } else if (gateway === GatewayName.DOKU) {
            response = await updateDoku(null, null, {
              merchant_id: liveFields.merchant_id,
              client_id: liveFields.client_id,
              secret_key: liveFields.secret_key,
            });
          } else if (gateway === GatewayName.MIDTRANS) {
            response = await updateMidtrans(null, null, {
              server_key: liveFields.server_key,
              client_key: liveFields.client_key,
              disbursement_merchant_id: liveFields.disbursement_merchant_id,
              disbursement_creator_api_key:
                liveFields.disbursement_creator_api_key,
              disbursement_creator_merchant_key:
                liveFields.disbursement_creator_merchant_key,
              disbursement_approver_api_key:
                liveFields.disbursement_approver_api_key,
              disbursement_approver_merchant_key:
                liveFields.disbursement_approver_merchant_key,
            });
          } else if (gateway === GatewayName.XENDIT) {
            response = await updateXendit(null, null, {
              secret_key: liveFields.secret_key,
            });
          }
        } else {
          if (gateway === GatewayName.RAZORPAY) {
            response = await updateRazorpay(null, null, {
              sandbox_key_id: sandboxFields.sandbox_key_id,
              sandbox_key_secret: sandboxFields.sandbox_key_secret,
              sandbox_account_number: sandboxFields.sandbox_account_number,
            });
          } else if (gateway === GatewayName.PHONEPE) {
            response = await updatePhonepe(null, null, {
              sandbox_merchant_id: sandboxFields.sandbox_merchant_id,
              sandbox_salt_key: sandboxFields.sandbox_salt_key,
              sandbox_salt_index: sandboxFields.sandbox_salt_index,
            });
          } else if (gateway === GatewayName.PAYU) {
            response = await updatePayu(null, null, {
              sandbox_merchant_id: sandboxFields.sandbox_merchant_id,
              sandbox_client_id: sandboxFields.sandbox_key_id,
              sandbox_client_secret: sandboxFields.sandbox_key_secret,
            });
          } else if (gateway === GatewayName.CASHFREE) {
            response = await updateCashfree(null, null, {
              sandbox_client_id: sandboxFields.sandbox_client_id,
              sandbox_client_secret: sandboxFields.sandbox_client_secret,
            });
          } else if (gateway === GatewayName.DOKU) {
            response = await updateDoku(null, null, {
              sandbox_merchant_id: sandboxFields.sandbox_merchant_id,
              sandbox_client_id: sandboxFields.sandbox_client_id,
              sandbox_secret_key: sandboxFields.sandbox_secret_key,
            });
          } else if (gateway === GatewayName.MIDTRANS) {
            response = await updateMidtrans(null, null, {
              sandbox_server_key: sandboxFields.sandbox_server_key,
              sandbox_client_key: sandboxFields.sandbox_client_key,
              sandbox_disbursement_merchant_id:
                sandboxFields.sandbox_disbursement_merchant_id,
              sandbox_disbursement_creator_api_key:
                sandboxFields.sandbox_disbursement_creator_api_key,
              sandbox_disbursement_creator_merchant_key:
                sandboxFields.sandbox_disbursement_creator_merchant_key,
              sandbox_disbursement_approver_api_key:
                sandboxFields.sandbox_disbursement_approver_api_key,
              sandbox_disbursement_approver_merchant_key:
                sandboxFields.sandbox_disbursement_approver_merchant_key,
            });
          } else if (gateway === GatewayName.XENDIT) {
            response = await updateXendit(null, null, {
              sandbox_secret_key: sandboxFields.sandbox_secret_key,
            });
          }
        }

        if (response) {
          showNotification({
            title: "Success",
            message: "Keys updated successfully!",
            color: "green",
          });

          handlers.close();

          if (currentTab === "live") {
            setLiveFields({
              key_id: "",
              key_secret: "",
              secret_key: "",
              merchant_id: "",
              salt_key: "",
              salt_index: "",
              account_number: "",
              uniqpay_id: "",
              client_id: "",
              client_secret: "",
              payouts_client_id: "",
              payouts_client_secret: "",
              server_key: "",
              client_key: "",
              disbursement_merchant_id: "",
              disbursement_creator_api_key: "",
              disbursement_creator_merchant_key: "",
              disbursement_approver_api_key: "",
              disbursement_approver_merchant_key: "",
            });
          } else {
            setSandboxFields({
              sandbox_key_id: "",
              sandbox_key_secret: "",
              sandbox_secret_key: "",
              sandbox_merchant_id: "",
              sandbox_salt_key: "",
              sandbox_salt_index: "",
              sandbox_account_number: "",
              sandbox_client_id: "",
              sandbox_client_secret: "",
              sandbox_server_key: "",
              sandbox_client_key: "",
              sandbox_disbursement_merchant_id: "",
              sandbox_disbursement_creator_api_key: "",
              sandbox_disbursement_creator_merchant_key: "",
              sandbox_disbursement_approver_api_key: "",
              sandbox_disbursement_approver_merchant_key: "",
            });
          }
        }
      } catch (error) {
        showNotification({
          title: "Error",
          message: "Failed to update keys. Please try again.",
          color: "red",
        });
        console.error("Error updating keys:", error);
      }
    }
  };

  const getTabPanelComponent = () => {
    if (gateway === GatewayName.PHONEPE) {
      return (
        <PhonepeKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    } else if (gateway === GatewayName.RAZORPAY) {
      return (
        <RazorPayKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    } else if (gateway === GatewayName.UNIQPAY) {
      return (
        <UniqPayKeys
          fields={liveFields}
          errors={errors}
          setErrors={setErrors}
          setFields={setLiveFields}
          currentTab={"live"}
        />
      );
    } else if (gateway === GatewayName.PAYU) {
      return (
        <PayuKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    } else if (gateway === GatewayName.CASHFREE) {
      return (
        <CashfreeKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    } else if (gateway === GatewayName.DOKU) {
      return (
        <DokuKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    } else if (gateway === GatewayName.MIDTRANS) {
      return (
        <MidtransKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    } else if (gateway === GatewayName.XENDIT) {
      return (
        <XenditKeys
          fields={currentTab === "live" ? liveFields : sandboxFields}
          errors={errors}
          setErrors={setErrors}
          setFields={currentTab === "live" ? setLiveFields : setSandboxFields}
          currentTab={currentTab}
        />
      );
    }
  };

  const getGatewayLogo = () => {
    if (gateway === GatewayName.PHONEPE) return PhonepeIcon;
    if (gateway === GatewayName.RAZORPAY) return RazorpayIcon;
    if (gateway === GatewayName.UNIQPAY) return BenakpayIcon;
    if (gateway === GatewayName.PAYU) return PayuIcon;
    if (gateway === GatewayName.CASHFREE) return CashfreeIcon;
    return undefined;
  };

  const Header = (
    <Flex justify={"space-between"} align={"center"} mr={"md"}>
      <Title order={4}>Merchant keys</Title>
      {getGatewayLogo() ? (
        <img style={{ width: "100px" }} src={getGatewayLogo()} alt="" />
      ) : (
        <strong>{gateway}</strong>
      )}
    </Flex>
  );

  const Body = (
    <>
      <Text size="sm" c={"gray"}>
        Update merchant keys for Live (Production) and Sandbox (UAT)
        Environments on the gateway.
      </Text>

      <TabsLayout
        isControlled={true}
        currentValue={gateway === GatewayName.UNIQPAY ? "live" : currentTab}
        onChange={setCurrentTab}
        tabs={[
          {
            label: "Live Keys",
            value: "live",
          },
          {
            label: "Sandbox Keys",
            value: "sandbox",
          },
        ]}
        tabPanels={[getTabPanelComponent(), getTabPanelComponent()]}
      />
    </>
  );

  const Footer = (
    <Flex justify={"space-between"} align={"center"}>
      <Button variant="outline" onClick={handlers.close}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Update keys</Button>
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

export default KeysForm;

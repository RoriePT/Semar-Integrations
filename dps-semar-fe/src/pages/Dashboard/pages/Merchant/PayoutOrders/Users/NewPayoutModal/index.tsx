import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Autocomplete,
  Flex,
  Select,
  Text,
} from "@mantine/core";
import { useDashboardUser } from "../../../../../DashboardProvider";
import {
  getEwalletData,
  getNetBankingData,
  getUpiData,
} from "../../../../../../../utils/helpers";
import { validatePattern } from "bhimupijs";
import CommonAPIs from "../../../../../../../api/common";
import UserDetailAPIs from "../../../../../../../api/userDetails";
import PayoutOrders from "../../../../../../../api/payoutOrders";
import { notifications } from "@mantine/notifications";

const NewPayoutModal = ({
  opened,
  onClose,
  setNewPayoutOpened,
  payoutData = null,
  triggerReload,
}) => {
  const { userData } = useDashboardUser();
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userId, setUserId] = useState("");
  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
    mobileNumber: "",
  });
  const [netBankingDetails, setNetBankingDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    beneficiaryName: "",
  });
  const [eWalletDetails, setEWalletDetails] = useState({
    appName: "",
    mobileNumber: "",
  });
  const [currentBalance, setCurrentBalance] = useState(0);
  const [errors, setErrors] = useState({
    orderId: "",
    amount: "",
    name: "",
    email: "",
    mobile: "",
    paymentMethod: "",
    upiId: "",
    upiMobileNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    beneficiaryName: "",
    eWalletAppName: "",
    eWalletMobileNumber: "",
    userId: "",
  });
  const [confirmUserId, setConfirmUserId] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userChannelDetails, setUserChannelDetails] = useState<any>();
  const [channels, setChannels] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [submitPayout, setSubmitPayout] = useState(false);

  const fetchChannelProfiles = async () => {
    const res = await CommonAPIs.getCurrentBalance();
    if (res) setCurrentBalance(res);

    const channels = await CommonAPIs.getChannelList("Payout", userData?.id);
    setChannels(channels);

    const response = await CommonAPIs.merchantUserId({
      id: userData?.id,
    });
    setUserIds(response);
  };

  const resetFields = () => {
    setOrderId("");
    setAmount("");
    setName("");
    setEmail("");
    setMobile("");
    setPaymentMethod("");
    setUpiDetails({ upiId: "", mobileNumber: "" });
    setNetBankingDetails({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      beneficiaryName: "",
    });
    setEWalletDetails({ appName: "", mobileNumber: "" });
    setUserId("");
  };

  const validateMobileNumber = (mobile) => {
    if (!mobile) {
      return "Mobile number cannot be empty";
    }
    if (!/^\d+$/.test(mobile)) {
      return "Mobile number can only contain digits";
    }
    if (mobile.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    }
    if (mobile[0] === "0") {
      return "Mobile number cannot start with 0";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email cannot be empty";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateUPI = (vpa) => {
    const validationResult = validatePattern(vpa);
    if (!validationResult.isQueryPatternValid) {
      return "Invalid UPI ID format.";
    }
    return null;
  };

  const isValidBankAccountNumber = (bankAccountNumber) => {
    const regex = /^[0-9]{9,18}$/;
    return regex.test(bankAccountNumber);
  };

  const isValidIfscCode = (ifscCode) => {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(ifscCode);
  };

  const validateFields = () => {
    const newErrors = {
      orderId: !orderId ? "Order ID cannot be empty!" : "",
      amount: !amount
        ? "Amount cannot be empty"
        : parseFloat(amount) <= 0
        ? "Amount must be greater than 0"
        : parseFloat(amount) > currentBalance
        ? "Amount cannot be greater than current balance"
        : parseFloat(amount) < userData.minPayout ||
          parseFloat(amount) > userData.maxPayout
        ? `Amount must be between ₹${userData.minPayout} and ₹${userData.maxPayout}`
        : "",
      name: !name ? "Name cannot be empty" : "",
      email: validateEmail(email),
      mobile: validateMobileNumber(mobile),
      paymentMethod: !paymentMethod ? "Please select a payment method" : "",
      upiId:
        (paymentMethod === "UPI" && !upiDetails.upiId
          ? "UPI ID cannot be empty"
          : paymentMethod === "UPI" && validateUPI(upiDetails.upiId)) || "",
      upiMobileNumber:
        paymentMethod === "UPI"
          ? validateMobileNumber(upiDetails.mobileNumber) ||
            (!upiDetails.mobileNumber ? "Mobile number cannot be empty" : "")
          : "",
      bankName:
        paymentMethod === "NET_BANKING" && !netBankingDetails.bankName
          ? "Bank name cannot be empty"
          : "",
      accountNumber:
        paymentMethod === "NET_BANKING"
          ? !netBankingDetails.accountNumber
            ? "Account number cannot be empty"
            : !isValidBankAccountNumber(netBankingDetails.accountNumber)
            ? "Please enter a valid Account Number (9-18 digits)"
            : null
          : "",
      ifscCode:
        paymentMethod === "NET_BANKING"
          ? !netBankingDetails.ifscCode
            ? "IFSC code cannot be empty"
            : !isValidIfscCode(netBankingDetails.ifscCode)
            ? "Invalid IFSC code format"
            : null
          : "",
      beneficiaryName:
        paymentMethod === "NET_BANKING" && !netBankingDetails.beneficiaryName
          ? "Beneficiary name cannot be empty"
          : "",
      eWalletAppName:
        paymentMethod === "E_WALLET"
          ? !eWalletDetails.appName
            ? "App name cannot be empty"
            : eWalletDetails.appName.length < 3
            ? "App name must contain at least 3 characters"
            : ""
          : "",
      eWalletMobileNumber:
        paymentMethod === "E_WALLET"
          ? validateMobileNumber(eWalletDetails.mobileNumber) ||
            (!eWalletDetails.mobileNumber
              ? "Mobile number cannot be empty"
              : "")
          : "",
      userId: !userId.length ? "User ID cannot be empty!" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(
      (error) => error === "" || error === null
    );
  };

  const getPayload = (payoutData) => {
    const {
      name,
      amount,
      paymentMethod,
      email,
      mobile,
      details,
      userId,
      orderId,
    } = payoutData;

    return {
      user: {
        name,
        email,
        mobile,
        id: userId,
      },
      orderId,
      paymentMethod: paymentMethod,
      amount: parseFloat(amount),
      upiDetails: upiDetails,
      netBankingDetails,
      eWalletDetails,
    };
  };

  const handleSavePayout = async (newPayout) => {
    setSubmitPayout(true);
    const res: any = await PayoutOrders.createPayoutOrder(newPayout);
    setSubmitPayout(false);

    if (res?.data.error) {
      fetchChannelProfiles();
      setErrors((prev) => ({ ...prev, amount: res?.data.message }));
      return;
    }

    if (res?.isError) {
      notifications.show({
        title: "Failed",
        message: res?.error,
        color: "red",
      });
      setNewPayoutOpened(false);
    } else {
      triggerReload();
      notifications.show({
        title: "Success",
        message: "Payout created.",
        color: "green",
      });
      onClose();
    }
  };

  const handleSave = () => {
    if (validateFields()) {
      const newPayout = {
        orderId,
        amount,
        name,
        email,
        mobile,
        paymentMethod,
        details:
          paymentMethod === "UPI"
            ? getUpiData(upiDetails)
            : paymentMethod === "NET_BANKING"
            ? getNetBankingData(netBankingDetails)
            : getEwalletData(eWalletDetails),
        userId,
      };
      const payload = getPayload(newPayout);
      handleSavePayout(payload);
    }
  };

  const channelLabels = {
    UPI: "UPI",
    NET_BANKING: "Net Banking",
    E_WALLET: "E-wallet",
  };

  const dropdownOptions = (userData?.payoutChannels || []).map((channel) => ({
    value: channel,
    label: channelLabels[channel],
  }));

  const onChangeHandler = (field, value) => {
    if (field === "name") {
      setName(value);
    } else if (field === "amount") {
      if (/^\d*$/.test(value)) {
        setAmount(value);
      }
    } else if (field === "paymentMethod") {
      setPaymentMethod(value);
    } else if (field === "email") {
      setEmail(value);
    } else if (field === "mobile") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setMobile(value);
      }
    } else if (field === "upiId") {
      setUpiDetails({ ...upiDetails, upiId: value });
    } else if (field === "upiMobileNumber") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setUpiDetails({ ...upiDetails, mobileNumber: value });
      }
    } else if (field === "bankName") {
      setNetBankingDetails({ ...netBankingDetails, bankName: value });
    } else if (field === "accountNumber") {
      setNetBankingDetails({ ...netBankingDetails, accountNumber: value });
    } else if (field === "ifscCode") {
      setNetBankingDetails({ ...netBankingDetails, ifscCode: value });
    } else if (field === "beneficiaryName") {
      setNetBankingDetails({ ...netBankingDetails, beneficiaryName: value });
    } else if (field === "eWalletAppName") {
      setEWalletDetails({ ...eWalletDetails, appName: value });
    } else if (field === "eWalletMobileNumber") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setEWalletDetails({ ...eWalletDetails, mobileNumber: value });
      }
    } else if (field === "userId") {
      setUserId(value);
    } else if (field === "orderId") {
      setOrderId(value);
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const prefillData = () => {
    if (payoutData) {
      setAmount(payoutData.amount || "");
      setName(payoutData.user?.name || "");
      setEmail(payoutData.user?.email || "");
      setMobile(payoutData.user?.mobile || "");
      setPaymentMethod(payoutData.channel || "");
      setUserId(payoutData?.userId || "");

      if (payoutData.channelDetails) {
        const channelDetails = JSON.parse(payoutData.channelDetails);

        setUpiDetails({
          upiId: channelDetails["Upi Id"] || "",
          mobileNumber: channelDetails["Mobile Number"] || "",
        });

        setEWalletDetails({
          appName: channelDetails["App Name"] || "",
          mobileNumber: channelDetails["Mobile Number"] || "",
        });

        setNetBankingDetails({
          bankName: channelDetails["Bank Name"] || "",
          accountNumber: channelDetails["Account Number"] || "",
          ifscCode: channelDetails["IFSC Code"] || "",
          beneficiaryName: channelDetails["Beneficiary Name"] || "",
        });
      } else {
        setUpiDetails({ upiId: "", mobileNumber: "" });
        setEWalletDetails({
          appName: "",
          mobileNumber: "",
        });
        setNetBankingDetails({
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          beneficiaryName: "",
        });
      }
    }
  };

  const confirmAndFetchUserDetails = async () => {
    setLoading(true);
    const res = await UserDetailAPIs.getMerchantEndUserDetails(userId);
    if (!res.isError) {
      setName(res.name);
      setMobile(res.mobile);
      setEmail(res.email);
      setUserChannelDetails(res.channelDetails);
    }
    setLoading(false);
    setConfirmUserId(false);
  };

  const autoFillChannelDetails = () => {
    if (userChannelDetails && userChannelDetails[paymentMethod]) {
      switch (paymentMethod) {
        case "UPI":
          setUpiDetails({
            upiId: userChannelDetails[paymentMethod]?.upiId,
            mobileNumber: userChannelDetails[paymentMethod]?.mobileNumber,
          });
          break;

        case "NET_BANKING":
          setNetBankingDetails({
            bankName: userChannelDetails[paymentMethod]?.bankName,
            accountNumber: userChannelDetails[paymentMethod]?.accountNumber,
            ifscCode: userChannelDetails[paymentMethod]?.ifscCode,
            beneficiaryName: userChannelDetails[paymentMethod]?.beneficiaryName,
          });
          break;

        case "E_WALLET":
          setEWalletDetails({
            appName: userChannelDetails[paymentMethod]?.appName,
            mobileNumber: userChannelDetails[paymentMethod]?.mobileNumber,
          });
          break;
      }
    }
  };

  useEffect(() => {
    autoFillChannelDetails();
  }, [paymentMethod]);

  useEffect(() => {
    fetchChannelProfiles();
    setConfirmUserId(true);
    setUserChannelDetails(null);
  }, [opened]);

  useEffect(() => {
    if (opened) {
      prefillData();
    } else {
      resetFields();
      setErrors({
        orderId: "",
        amount: "",
        name: "",
        email: "",
        mobile: "",
        paymentMethod: "",
        upiId: "",
        upiMobileNumber: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        beneficiaryName: "",
        eWalletAppName: "",
        eWalletMobileNumber: "",
        userId: "",
      });
    }
  }, [opened, payoutData]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Modal opened={opened} onClose={onClose} title="New Payout">
      <Box mb="md">
        <Text mb={10}>
          <b>Net Available Balance:</b> ₹{currentBalance}
        </Text>
        <Flex direction="column" gap={windowWidth >= 580 ? "lg" : "xs"}>
          {confirmUserId ? (
            <>
              <Autocomplete
                label="User ID"
                placeholder="Enter User ID"
                description={
                  "Enter the ID alloted to your user in your website."
                }
                required
                value={userId}
                data={userIds}
                onChange={(value) => onChangeHandler("userId", value)}
                error={errors.userId}
              />
            </>
          ) : (
            <>
              <Autocomplete
                label="User ID"
                placeholder="Enter User ID"
                required
                value={userId}
                onChange={(value) => onChangeHandler("userId", value)}
                error={errors.userId}
                readOnly={true}
              />

              <Autocomplete
                label="Order ID"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(value) => onChangeHandler("orderId", value)}
                error={errors.orderId}
                readOnly={false}
                required
              />

              <Autocomplete
                label="Name"
                placeholder="Enter Name"
                required
                value={name}
                onChange={(value) => onChangeHandler("name", value)}
                error={errors.name}
              />

              <Flex gap="lg" direction={windowWidth >= 580 ? "row" : "column"}>
                <Autocomplete
                  label="Amount"
                  placeholder="Enter Amount"
                  required
                  value={amount}
                  onChange={(value) => onChangeHandler("amount", value)}
                  error={errors.amount}
                />
                <Select
                  label="Channel"
                  withAsterisk
                  placeholder="Select Channel"
                  value={paymentMethod}
                  onChange={(value) => onChangeHandler("paymentMethod", value)}
                  data={channels.map((channel) => ({
                    value: channel.channel,
                    label: channel.channel,
                    disabled: !channel.enabled,
                  }))}
                  error={errors.paymentMethod}
                />
              </Flex>
              <Flex gap="lg" direction={windowWidth >= 580 ? "row" : "column"}>
                <Autocomplete
                  label="Email"
                  placeholder="Enter Email"
                  required
                  value={email}
                  onChange={(value) => onChangeHandler("email", value)}
                  error={errors.email}
                />
                <Autocomplete
                  label="Mobile Number"
                  placeholder="Enter Mobile Number"
                  required
                  value={mobile}
                  onChange={(value) => onChangeHandler("mobile", value)}
                  error={errors.mobile}
                />
              </Flex>
              {paymentMethod === "UPI" && (
                <>
                  <Autocomplete
                    label="UPI ID"
                    placeholder="Enter UPI ID"
                    required
                    value={upiDetails.upiId}
                    onChange={(value) => onChangeHandler("upiId", value)}
                    error={errors.upiId}
                  />
                  <Autocomplete
                    label=" UPI Mobile Number"
                    placeholder="Enter Mobile Number"
                    required
                    value={upiDetails.mobileNumber}
                    onChange={(value) =>
                      onChangeHandler("upiMobileNumber", value)
                    }
                    error={errors.upiMobileNumber}
                  />
                </>
              )}
              {paymentMethod === "NET_BANKING" && (
                <>
                  <Autocomplete
                    label="Bank Name"
                    placeholder="Enter Bank Name"
                    required
                    value={netBankingDetails.bankName}
                    onChange={(value) => onChangeHandler("bankName", value)}
                    error={errors.bankName}
                  />
                  <Autocomplete
                    label="Account Number"
                    placeholder="Enter Account Number"
                    required
                    value={netBankingDetails.accountNumber}
                    onChange={(value) =>
                      onChangeHandler("accountNumber", value)
                    }
                    error={errors.accountNumber}
                  />
                  <Autocomplete
                    label="IFSC Code"
                    placeholder="Enter IFSC Code"
                    required
                    value={netBankingDetails.ifscCode}
                    onChange={(value) => onChangeHandler("ifscCode", value)}
                    error={errors.ifscCode}
                  />
                  <Autocomplete
                    label="Beneficiary Name"
                    placeholder="Enter Beneficiary Name"
                    required
                    value={netBankingDetails.beneficiaryName}
                    onChange={(value) =>
                      onChangeHandler("beneficiaryName", value)
                    }
                    error={errors.beneficiaryName}
                  />
                </>
              )}
              {paymentMethod === "E_WALLET" && (
                <>
                  <Autocomplete
                    label="App Name"
                    placeholder="Enter App Name"
                    required
                    value={eWalletDetails.appName}
                    onChange={(value) =>
                      onChangeHandler("eWalletAppName", value)
                    }
                    error={errors.eWalletAppName}
                  />
                  <Autocomplete
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    required
                    value={eWalletDetails.mobileNumber}
                    onChange={(value) =>
                      onChangeHandler("eWalletMobileNumber", value)
                    }
                    error={errors.eWalletMobileNumber}
                  />
                </>
              )}
            </>
          )}

          <Flex
            w={"100%"}
            gap={"16px"}
            direction={windowWidth >= 580 ? "row" : "column"}
          >
            {!confirmUserId && (
              <Button
                onClick={() => {
                  setConfirmUserId(true);
                  setUserChannelDetails(null);
                  setName(null);
                  setEmail(null);
                  setMobile(null);
                }}
                w={windowWidth >= 580 ? "50%" : "100%"}
              >
                Back
              </Button>
            )}

            <Button
              disabled={!userId}
              loading={submitPayout}
              onClick={confirmUserId ? confirmAndFetchUserDetails : handleSave}
            >
              {confirmUserId ? "Next" : "Submit Payout Request"}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Modal>
  );
};

export default NewPayoutModal;

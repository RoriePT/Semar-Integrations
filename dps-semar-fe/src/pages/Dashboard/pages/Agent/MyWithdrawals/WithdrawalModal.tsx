import {
  Box,
  Button,
  Flex,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications, showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { X } from "tabler-icons-react";
import AuthAPIs from "../../../../../api/auth";
import CommonAPIs from "../../../../../api/common";
import WithdrawalOrderAPIs from "../../../../../api/withdrawalOrders";
import { useDashboardUser } from "../../../DashboardProvider";

const WithdrawalModal = ({ opened, onClose, reload }) => {
  const initialErrorStates = { channel: "", amount: "", password: "" };
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [channelProfiles, setChannelProfiles] = useState([
    { value: "upi", label: "UPI" },
    { value: "eWallet", label: "E-Wallet" },
    { value: "netBanking", label: "Net Banking" },
  ]);
  const [minMaxAmount, setMinMaxAmount] = useState({
    minWithdrawal: 100,
    maxWithdrawal: 10000,
  });
  const [currentBalance, setCurrentBalance] = useState(0);
  const [error, setError] = useState(initialErrorStates);
  const { userData } = useDashboardUser();
  const [password, setPassword] = useState("");

  const fetchChannelProfiles = async () => {
    const res = await WithdrawalOrderAPIs.getChannelProfiles(
      "agent-channel-details"
    );

    const bal = await CommonAPIs.getCurrentBalance();
    if (res) {
      const updatedProfiles = res.channelProfiles?.map((channel) => ({
        value: channel?.channelName,
        label:
          channel.channelName === "upi"
            ? "UPI"
            : channel.channelName === "eWallet"
            ? "E-Wallet"
            : "Net Banking",

        channelDetails: channel?.channelDetails,
      }));
      setChannelProfiles(updatedProfiles);
      setMinMaxAmount({
        minWithdrawal: res?.minWithdrawal,
        maxWithdrawal: res?.maxWithdrawal,
      });
      setCurrentBalance(bal);
    }
  };

  const handlePaymentChange = (value, options) => {
    setSelectedPayment(options);
    setError((prev) => ({ ...prev, channel: "" }));
  };

  const handleAmountChange = (value) => {
    setWithdrawalAmount(value);
    if (
      value < minMaxAmount.minWithdrawal ||
      value > minMaxAmount.maxWithdrawal
    ) {
      setError((prev) => ({
        ...prev,
        amount: `Amount must be between ₹${minMaxAmount.minWithdrawal} and ₹${minMaxAmount.maxWithdrawal}`,
      }));
    } else {
      setError(initialErrorStates);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPayment) {
      setError((prev) => ({
        ...prev,
        channel: "Please select a payment method.",
      }));
    }

    if (
      withdrawalAmount < minMaxAmount.minWithdrawal ||
      withdrawalAmount > minMaxAmount.maxWithdrawal
    ) {
      setError((prev) => ({
        ...prev,
        amount: `Amount must be between ₹${minMaxAmount.minWithdrawal} and ₹${minMaxAmount.maxWithdrawal}`,
      }));
      return;
    }

    if (withdrawalAmount > currentBalance) {
      setError((prev) => ({
        ...prev,
        amount: `Amount must be less than or equal to current balance: ₹${currentBalance}`,
      }));
      return;
    }

    verifyPassword();
  };

  const resetFields = () => {
    setSelectedPayment(null);
    setWithdrawalAmount(null);
    setPassword("");
    setError(initialErrorStates);
  };

  const handleSuccess = async () => {
    const createOrder = await WithdrawalOrderAPIs.createOrder({
      channel: selectedPayment?.value?.toUpperCase(),
      channelDetails: JSON.stringify(selectedPayment?.channelDetails[0]),
      withdrawalAmount: withdrawalAmount,
      email: userData.email,
      phone: phoneNumber || undefined,
    });

    if (createOrder?.data?.error) {
      fetchChannelProfiles();
      setError((prev) => ({ ...prev, amount: createOrder?.data?.message }));
      return;
    }

    onClose();
    if (createOrder)
      notifications.show({
        title: "Success",
        message: "Withdrawal order created successfully.",
        color: "green",
      });

    reload();
    resetFields();
  };

  const verifyPassword = async () => {
    if (password.length < 8) {
      setError((prev) => ({
        ...prev,
        password:
          "Field must not be empty and Password must be at least 8 characters long",
      }));
      return;
    }

    try {
      const response = await AuthAPIs.verifyPassword(
        password,
        userData.userTable
      );
      if (response) {
        handleSuccess();
      } else {
        setError((prev) => ({ ...prev, password: "Password is not correct." }));
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Verification error.",
        color: "red",
        icon: <X size={16} />,
      });
    }
  };

  useEffect(() => {
    fetchChannelProfiles();
    if (opened) {
      resetFields();
    }
  }, [opened]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          onClose();
          resetFields();
        }}
        title="New Withdrawal Request"
      >
        <Text mb={10}>
          <b>Net Available Balance:</b> ₹{currentBalance}
        </Text>

        <Select
          label="Select Payment Method"
          placeholder="Select a payment method"
          data={channelProfiles}
          onChange={handlePaymentChange}
          error={error.channel}
        />

        {selectedPayment?.value === "upi" && (
          <Flex direction="column" mt="md">
            <Box
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                boxShadow:
                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              }}
            >
              <Text size="sm">
                {" "}
                UPI Id: {selectedPayment?.channelDetails[0]?.upiId}{" "}
              </Text>
              <Text size="sm">
                {" "}
                Mobile Number: {selectedPayment?.channelDetails[0]?.mobile}{" "}
              </Text>
              {selectedPayment?.channelDetails[0]?.email && (
                <Text size="sm">
                  Email: {selectedPayment?.channelDetails[0]?.email}{" "}
                </Text>
              )}
            </Box>
          </Flex>
        )}

        {selectedPayment?.value === "netBanking" && (
          <Flex direction="column" mt="md">
            <Box
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                boxShadow:
                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              }}
            >
              <Text size="sm">
                Bank Name: {selectedPayment?.channelDetails[0]?.bankName}{" "}
              </Text>
              <Text size="sm">
                Account Number:{" "}
                {selectedPayment?.channelDetails[0]?.accountNumber}
              </Text>
              <Text size="sm">
                Beneficiary Name:{" "}
                {selectedPayment?.channelDetails[0]?.beneficiaryName}{" "}
              </Text>
              <Text size="sm">
                IFSC Code: {selectedPayment?.channelDetails[0]?.ifsc}
              </Text>
              {selectedPayment?.channelDetails[0]?.mobile && (
                <Text size="sm">
                  Mobile Number: {selectedPayment?.channelDetails[0]?.mobile}{" "}
                </Text>
              )}
              {selectedPayment?.channelDetails[0]?.email && (
                <Text size="sm">
                  Email: {selectedPayment?.channelDetails[0]?.email}{" "}
                </Text>
              )}
            </Box>
          </Flex>
        )}

        {selectedPayment?.value === "eWallet" && (
          <Flex direction="column" mt="md">
            <Box
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                boxShadow:
                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              }}
            >
              <Text size="sm">
                App Name: {selectedPayment?.channelDetails[0]?.app}
              </Text>
              <Text size="sm">
                Mobile Number: {selectedPayment?.channelDetails[0]?.mobile}{" "}
              </Text>
              {selectedPayment?.channelDetails[0]?.email && (
                <Text size="sm">
                  Email: {selectedPayment?.channelDetails[0]?.email}{" "}
                </Text>
              )}
            </Box>
          </Flex>
        )}

        <NumberInput
          label="Withdrawal Amount"
          placeholder="Enter amount (₹1000 - ₹100000)"
          value={withdrawalAmount}
          onChange={handleAmountChange}
          error={error.amount}
          inputWrapperOrder={["label", "input", "error"]}
          mt="md"
        />

        {!userData?.phone && (
          <TextInput
            label="Phone Number"
            placeholder="Please enter your phone number"
            value={phoneNumber}
            maxLength={10}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            mt="md"
          />
        )}

        <PasswordInput
          placeholder="Enter your password"
          value={password}
          label={"Withdrawal password"}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
            setError((prev) => ({ ...prev, password: "" }));
          }}
          error={error.password}
          mt={"xs"}
        />
        <Button onClick={handleSubmit} mt="md">
          Submit for withdrawal
        </Button>
      </Modal>
    </>
  );
};

export default WithdrawalModal;

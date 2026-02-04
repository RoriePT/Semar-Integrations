import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Select,
  Autocomplete,
  TextInput,
  Loader,
  FileInput,
  Flex,
  Text,
} from "@mantine/core";
import { GrAttachment } from "react-icons/gr";
import CommonAPIs from "../../api/common";
import OrderAPIs from "../../api/order";
import { ChannelName } from "../../api/gateway";
import { uploadReceipt } from "../../api/uploadTos3";
import { notifications } from "@mantine/notifications";
import CustomDropdown from "../CustomDropdown";

const PayinCreation = ({ opened, onClose, reload }) => {
  const [screen, setScreen] = useState(1);
  const [merchants, setMerchants] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [endUserId, setEndUserId] = useState(null);
  const [amount, setAmount] = useState("");
  const [userDetails, setUserDetails] = useState({
    userEmail: "",
    userMobile: "",
    userName: "",
    merchantOrderId: "",
  });
  const [channel, setChannel] = useState("");
  const [isFindingMember, setIsFindingMember] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [file, setFile] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorScreen1, setErrorScreen1] = useState({
    merchant: "",
    endUserId: "",
    channel: "",
    amount: "",
  });
  const [errorScreen2, setErrorScreen2] = useState({
    merchant: "",
    endUserId: "",
    member: "",
    userName: "",
    userMobile: "",
    userEmail: "",
    orderId: "",
  });
  const [errorScreen3, setErrorScreen3] = useState({
    file: "",
    transactionId: "",
  });
  const [channels, setChannels] = useState([]);

  const resetModal = () => {
    setScreen(1);
    setSelectedMerchant(null);
    setEndUserId("");
    setUserDetails(null);
    setTransactionId("");
    setIsReadOnly(false);
    setFile(null);
    setErrorScreen1({
      merchant: "",
      endUserId: "",
      channel: "",
      amount: "",
    });
    setErrorScreen2({
      merchant: "",
      endUserId: "",
      member: "",
      userName: "",
      userMobile: "",
      userEmail: "",
      orderId: "",
    });
    setErrorScreen3({
      file: "",
      transactionId: "",
    });
    onClose();
  };

  const getChannelList = async (merchantId) => {
    const channels = await CommonAPIs.getChannelList("Payin", +merchantId);
    if (channels) setChannels(channels);
  };

  const handleMerchantSelect = async (merchantId) => {
    setSelectedMerchant(merchantId);
    const response = await CommonAPIs.merchantUserId({
      id: +merchantId,
    });
    setUserIds(response);
    setErrorScreen1((prev) => ({ ...prev, merchant: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[1-9][0-9]{9}$/;
    return mobile && mobileRegex.test(mobile);
  };

  const handleContinueScreen1 = async () => {
    let valid = true;
    if (!selectedMerchant) {
      setErrorScreen1((prev) => ({
        ...prev,
        merchant: "Merchant is required",
      }));
      valid = false;
    }
    if (!endUserId) {
      setErrorScreen1((prev) => ({
        ...prev,
        endUserId: "End User ID is required",
      }));
      valid = false;
    }
    if (!channel) {
      setErrorScreen1((prev) => ({
        ...prev,
        channel: "Channel is required!",
      }));
      valid = false;
    }
    if (!amount || !/^\d+(\.\d+)?$/.test(amount) || parseFloat(amount) <= 0) {
      setErrorScreen1((prev) => ({
        ...prev,
        amount: "Amount must be a valid number greater than 0",
      }));
      valid = false;
    }
    if (!valid) return;

    const userData = await CommonAPIs.EndUserDetails({ id: endUserId });

    if (userData) {
      setUserDetails(userData);
      setIsReadOnly(true);
    } else {
      setIsReadOnly(false);
    }

    setScreen(2);
  };

  const handleCreatePayin = async () => {
    let valid = true;
    if (!selectedMerchant) {
      setErrorScreen2((prev) => ({
        ...prev,
        merchant: "Merchant is required",
      }));
      valid = false;
    }
    if (!selectedMember) {
      setErrorScreen2((prev) => ({
        ...prev,
        merchant: "Member is required",
      }));
      valid = false;
    }
    if (!userDetails.merchantOrderId) {
      setErrorScreen2((prev) => ({
        ...prev,
        orderId: "Merchant Order ID is required!",
      }));
      valid = false;
    }
    if (!endUserId) {
      setErrorScreen2((prev) => ({
        ...prev,
        endUserId: "End User ID is required",
      }));
      valid = false;
    }
    if (!userDetails?.userName) {
      setErrorScreen2((prev) => ({
        ...prev,
        userName: "End User Name is required",
      }));
      valid = false;
    }
    if (!userDetails?.userEmail || !validateEmail(userDetails?.userEmail)) {
      setErrorScreen2((prev) => ({
        ...prev,
        userEmail: "Valid End User Email is required",
      }));
      valid = false;
    }
    if (!userDetails?.userMobile || !validateMobile(userDetails?.userMobile)) {
      setErrorScreen2((prev) => ({
        ...prev,
        userMobile:
          "Valid End User mobile number is required (10 digits, not starting with 0)",
      }));
      valid = false;
    }

    if (!valid) return;

    setIsFindingMember(true);
    const payload = {
      amount: parseFloat(amount),
      orderId: userDetails.merchantOrderId,
      userId: endUserId,
      userEmail: userDetails?.userEmail,
      userName: userDetails?.userName,
      userMobileNumber: userDetails?.userMobile,
      merchantId: parseInt(selectedMerchant),
      memberId: parseInt(selectedMember),
      channel,
    };

    const res = await OrderAPIs.createPayinOrderAdmin(payload);
    setScreen(3);
    if (res) setOrderId(res?.systemOrderId);

    setIsFindingMember(false);
  };

  const handleSubmitPayload = async () => {
    let valid = true;
    if (!file) {
      setErrorScreen3((prev) => ({ ...prev, file: "File is required" }));
      valid = false;
    }
    if (!transactionId) {
      setErrorScreen3((prev) => ({
        ...prev,
        transactionId: "Transaction ID is required",
      }));
      valid = false;
    }
    if (!valid) return;

    setSubmitting(true);
    const receiptKey = await uploadReceipt(file, orderId);
    if (!receiptKey) return;

    const payload = {
      id: orderId,
      transactionId,
      transactionReceipt: receiptKey,
    };

    const res = await OrderAPIs.submitPayinOrderAdmin(payload);
    setSubmitting(false);
    if (res)
      notifications.show({
        title: "Success",
        message: "Payin order submitted successfully!",
        color: "green",
      });

    resetModal();
    reload();
  };

  useEffect(() => {
    getChannelList(selectedMerchant);
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={resetModal}
      title={<Text fw={600}>Create Payin</Text>}
      size="lg"
      closeButtonProps={{ style: { display: "none" } }}
      closeOnClickOutside={false}
    >
      {screen === 1 && (
        <Flex direction={"column"} gap={"12px"}>
          <CustomDropdown
            listType="MERCHANT"
            value={selectedMerchant}
            onChange={(value) => {
              setSelectedMerchant(value);
              handleMerchantSelect(value);
              setErrorScreen1((prev) => ({ ...prev, merchant: "" }));
            }}
            error={errorScreen1.merchant}
            required
            label="Merchant"
          />

          <Autocomplete
            label="End User ID"
            placeholder="Enter End User ID"
            data={userIds}
            value={endUserId}
            onChange={(value) => {
              setEndUserId(value);
              setErrorScreen1((prev) => ({ ...prev, endUserId: "" }));
            }}
            error={errorScreen1.endUserId}
            required
          />

          <Select
            label={"Channel"}
            placeholder="Select Channel"
            data={channels.map((channel) => ({
              label: channel.channel,
              value: channel.channel,
              disabled: !channel.enabled,
            }))}
            onChange={(e) => {
              setChannel(e);
              setErrorScreen1((prev) => ({ ...prev, channel: "" }));
            }}
            error={errorScreen1.channel}
          />

          <TextInput
            label="Amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrorScreen1((prev) => ({ ...prev, amount: "" }));
            }}
            required
            error={errorScreen1.amount}
          />

          <Flex justify="space-between" mt="md">
            <Button variant="outline" onClick={resetModal}>
              Cancel
            </Button>
            <Button onClick={handleContinueScreen1}>Continue</Button>
          </Flex>
        </Flex>
      )}

      {screen === 2 && (
        <Flex direction={"column"} gap={"12px"}>
          <CustomDropdown
            listType="MERCHANT"
            value={selectedMerchant}
            onChange={() => {}}
            error={errorScreen2.merchant}
            required
            readOnly
            label="Merchant"
          />

          <Autocomplete
            label="End User ID"
            value={endUserId}
            required
            readOnly
          />

          <Select
            label={"Channel"}
            placeholder="Select Channel"
            value={channel}
            data={channels.map((channel) => ({
              label: channel.channel,
              value: channel.channel,
              disabled: !channel.enabled,
            }))}
            onChange={(e) => {
              setChannel(e);
              setErrorScreen1((prev) => ({ ...prev, channel: "" }));
            }}
            error={errorScreen1.channel}
            readOnly
          />

          <TextInput
            label="Amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrorScreen1((prev) => ({ ...prev, amount: "" }));
            }}
            required
            error={errorScreen1.amount}
            readOnly
          />

          <CustomDropdown
            listType="MEMBER"
            value={selectedMember}
            onChange={(value) => {
              setSelectedMember(value);
              setErrorScreen2((prev) => ({ ...prev, member: "" }));
            }}
            error={errorScreen2.member}
            required
            label="Member"
            payload={{
              amount,
              channel,
            }}
          />

          <TextInput
            label="Merchant Order ID"
            value={userDetails?.merchantOrderId || ""}
            placeholder={"Merchant Order ID"}
            onChange={(e) => {
              setUserDetails((prev) => ({
                ...prev,
                merchantOrderId: e.target.value,
              }));
              setErrorScreen2((prev) => ({ ...prev, orderId: "" }));
            }}
            error={errorScreen2.orderId}
          />

          <TextInput
            label="User Name"
            value={userDetails?.userName || ""}
            placeholder={"User Name"}
            readOnly={isReadOnly}
            onChange={(e) => {
              setUserDetails((prev) => ({ ...prev, userName: e.target.value }));
              setErrorScreen2((prev) => ({ ...prev, userName: "" }));
            }}
            error={errorScreen2.userName}
          />

          <TextInput
            label="User Email"
            value={userDetails?.userEmail || ""}
            readOnly={isReadOnly}
            placeholder={"User Email"}
            onChange={(e) => {
              setUserDetails((prev) => ({
                ...prev,
                userEmail: e.target.value,
              }));
              setErrorScreen2((prev) => ({ ...prev, userEmail: "" }));
            }}
            error={errorScreen2.userEmail}
          />

          <TextInput
            label="User Mobile Number"
            value={userDetails?.userMobile || ""}
            readOnly={isReadOnly}
            placeholder={"User Mobile Number"}
            onChange={(e) => {
              setUserDetails((prev) => ({
                ...prev,
                userMobile: e.target.value,
              }));
              setErrorScreen2((prev) => ({ ...prev, userMobile: "" }));
            }}
            error={errorScreen2.userMobile}
          />

          <Flex justify="space-between" mt="md">
            <Button onClick={() => setScreen(1)}>Back</Button>
            <Button onClick={handleCreatePayin}>Create Payin</Button>
          </Flex>
        </Flex>
      )}

      {screen === 3 && (
        <Flex direction={"column"} gap={"12px"}>
          {isFindingMember ? (
            <div style={{ textAlign: "center" }}>
              <Loader size="sm" />
              {/* <p style={{ marginBottom: "20px" }}>Finding a member...</p> */}
            </div>
          ) : (
            <Flex direction={"column"} gap={"12px"}>
              <FileInput
                label="Upload Receipt"
                placeholder="Upload file"
                leftSection={<GrAttachment />}
                value={file}
                onChange={(file) => {
                  setFile(file);
                  setErrorScreen3((prev) => ({ ...prev, file: "" }));
                }}
                error={errorScreen3.file}
              />

              <TextInput
                label="Transaction ID"
                placeholder="Enter Transaction ID"
                value={transactionId}
                onChange={(e) => {
                  setTransactionId(e.target.value);
                  setErrorScreen3((prev) => ({ ...prev, transactionId: "" }));
                }}
                error={errorScreen3.transactionId}
              />

              <Flex justify="flex-end" mt="md">
                <Button loading={submitting} onClick={handleSubmitPayload}>
                  Submit
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      )}
    </Modal>
  );
};

export default PayinCreation;

import { Box, Button, Flex, Modal, Select, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { ChannelProfile } from "../../types/channel";
import EWalletModal from "./EWalletModal";
import NetBankingModal from "./NetBankingModal";
import UPIModal from "./UPIModal";

interface ChannelModalsProps {
  handleChange: (value: ChannelProfile) => void;
  multiple: boolean;
  editData: any;
  businessUpi?: boolean;
  // If true, show extra UPI vendor-only fields (e.g., title, enabled)
  forUpiVendor?: boolean;
}

const channelOptions = [
  { value: "upi", label: "UPI" },
  { value: "netBanking", label: "Net Banking" },
  { value: "eWallet", label: "E-Wallet" },
];

const ChannelModals: React.FC<ChannelModalsProps> = ({
  handleChange,
  multiple,
  editData,
  businessUpi = false,
  forUpiVendor = false,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [channelProfiles, setChannelProfiles] = useState<ChannelProfile>({
    upi: [],
    netBanking: [],
    eWallet: [],
  });

  const [orderedChannel, setOrderedChannels] = useState([]);
  const [selectedForEdit, setSelectedForEdit] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [modalOpened, setModalOpened] = useState(false);
  const [channelIndex, setChannelIndex] = useState(0);

  const handleAddChannelProfile = (data: any) => {
    const newProfile = data;

    setOrderedChannels((prev) => [...prev, data]);

    setChannelProfiles((prevProfiles) => {
      const updatedProfiles = { ...prevProfiles };

      if (selectedChannel === "upi") {
        if (selectedForEdit == null) {
          const nextIndex =
            (getOrderedChannels().slice(-1)[0]?.channelIndex || 0) + 1;
          updatedProfiles.upi.push({ ...data, channelIndex: nextIndex });
        } else {
          const requiredIndex = updatedProfiles.upi.findIndex(
            (item) => item.channelIndex === selectedForEdit
          );
          updatedProfiles.upi[requiredIndex] = {
            ...newProfile,
            channelIndex: selectedForEdit,
          };
        }
      } else if (selectedChannel === "netBanking") {
        if (selectedForEdit == null) {
          const nextIndex =
            (getOrderedChannels().slice(-1)[0]?.channelIndex || 0) + 1;
          updatedProfiles.netBanking.push({ ...data, channelIndex: nextIndex });
        } else {
          const requiredIndex = updatedProfiles.netBanking.findIndex(
            (item) => item.channelIndex === selectedForEdit
          );
          updatedProfiles.netBanking[requiredIndex] = {
            ...newProfile,
            channelIndex: selectedForEdit,
          };
        }
      } else if (selectedChannel === "eWallet") {
        if (selectedForEdit == null) {
          const nextIndex =
            (getOrderedChannels().slice(-1)[0]?.channelIndex || 0) + 1;

          updatedProfiles.eWallet.push({ ...data, channelIndex: nextIndex });
        } else {
          const requiredIndex = updatedProfiles.eWallet.findIndex(
            (item) => item.channelIndex === selectedForEdit
          );

          updatedProfiles.eWallet[requiredIndex] = {
            ...newProfile,
            channelIndex: selectedForEdit,
          };
        }
      }
      handleChange(updatedProfiles);
      return updatedProfiles;
    });

    setSelectedChannel(null);
    setFormData({});
    setModalOpened(false);
  };

  const profileExists = (type: string) => {
    const channelKey = type;
    return (
      channelProfiles[channelKey] &&
      Array.isArray(channelProfiles[channelKey]) &&
      channelProfiles[channelKey].length > 0
    );
  };

  const allChannelsAdded = () => {
    return Object.values(channelProfiles).every(
      (profiles) => profiles.length > 0
    );
  };

  useEffect(() => {
    if (editData?.channelProfile) {
      setChannelProfiles(editData.channelProfile);
    }
  }, [editData]);

  const getOrderedChannels = () => {
    let upiChannels;
    let netBanking;
    let eWallet;
    if (channelProfiles?.upi) {
      upiChannels = [...channelProfiles.upi].map((item) => ({
        ...item,
        type: "upi",
      }));
    }

    if (channelProfiles?.netBanking) {
      netBanking = [...channelProfiles.netBanking].map((item) => ({
        ...item,
        type: "netBanking",
      }));
    }

    if (channelProfiles?.eWallet) {
      eWallet = [...channelProfiles.eWallet].map((item) => ({
        ...item,
        type: "eWallet",
      }));
    }

    const latestChannels = [...upiChannels, ...netBanking, ...eWallet];

    latestChannels.sort((a, b) => a.channelIndex - b.channelIndex);

    return latestChannels;
  };

  useEffect(() => {
    if (!modalOpened) {
      setSelectedChannel(null);
      setSelectedForEdit(null);
      setFormData({});
    }
  }, [modalOpened]);

  return (
    <>
      <Modal
        centered
        opened={modalOpened}
        onClose={() => {
          setSelectedForEdit(null);
          setModalOpened(false);
        }}
        title={selectedForEdit !== null ? "Edit Channel" : "Add Channel"}
      >
        <Box mb="md">
          <Select
            label="Select Channel Type"
            placeholder="Pick one"
            data={channelOptions.filter(
              (option) => multiple || !profileExists(option.value)
            )}
            value={selectedChannel}
            onChange={(value) => {
              setSelectedChannel(value);
              setFormData({});
            }}
            disabled={selectedForEdit !== null}
          />
        </Box>

        {selectedChannel === "upi" && (
          <UPIModal
            opened={modalOpened}
            handlers={{ close: () => setModalOpened(false), open: () => {} }}
            handleSubmit={handleAddChannelProfile}
            initialData={selectedForEdit !== null ? formData : {}}
            businessUpi={businessUpi}
            setChannelIndex={setChannelIndex}
            channelIndex={channelIndex}
          />
        )}

        {selectedChannel === "netBanking" && (
          <NetBankingModal
            opened={modalOpened}
            handlers={{ close: () => setModalOpened(false), open: () => {} }}
            handleSubmit={handleAddChannelProfile}
            initialData={selectedForEdit !== null ? formData : {}}
            setChannelIndex={setChannelIndex}
            channelIndex={channelIndex}
          />
        )}

        {selectedChannel === "eWallet" && (
          <EWalletModal
            opened={modalOpened}
            handlers={{ close: () => setModalOpened(false), open: () => {} }}
            handleSubmit={handleAddChannelProfile}
            initialData={selectedForEdit !== null ? formData : {}}
            setChannelIndex={setChannelIndex}
            channelIndex={channelIndex}
          />
        )}
      </Modal>

      {getOrderedChannels().map((item, index) => {
        let type = item.type;
        let heading = "";
        if (type === "upi") heading = "UPI";
        else if (type === "eWallet") heading = "E-Wallet";
        else if (type === "netBanking") heading = "Net Banking";
        return (
          <Box
            key={index}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Flex justify={"space-between"} align={"flex-start"}>
              <Title order={5}>{heading}</Title>
              <Flex align={"center"} gap={"sm"}>
                <MdEdit
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setModalOpened(true);
                    setSelectedForEdit(item.channelIndex);
                    setSelectedChannel(type);
                    setFormData(item);
                  }}
                />
                <FaTrash
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const updatedProfiles = {
                      ...channelProfiles,
                      [type]: channelProfiles[type].filter((elem) => {
                        return elem.channelIndex !== item.channelIndex;
                      }),
                    };
                    setChannelProfiles(updatedProfiles);
                    handleChange(updatedProfiles);
                  }}
                />
              </Flex>
            </Flex>

            {Object.keys(item)
              .filter((key) => {
                if (
                  key !== "channelIndex" &&
                  key !== "id" &&
                  key !== "isBusinessUpi" &&
                  key !== "type" &&
                  key !== "isUpiVendor" &&
                  key !== "settlementAmount"
                ) {
                  // Hide UPI vendor-specific fields for non-UPI-vendor contexts
                  if (
                    !forUpiVendor &&
                    type === "upi" &&
                    (key === "enabled" || key === "title")
                  ) {
                    return false;
                  }
                  return key;
                }
              })
              .map((key, idx) => {
                // Custom label logic based on the key and type
                let label = key;
                if (type === "upi") {
                  if (key === "upiId") label = "UPI Id";
                  else if (key === "mobile") label = "Mobile Number";
                  else if (key === "email") label = "Email";
                  else if (key === "beneficiaryName")
                    label = "Beneficiary Name";
                } else if (type === "eWallet") {
                  if (key === "app") label = "App";
                  else if (key === "mobile") label = "Mobile Number";
                  else if (key === "email") label = "Email";
                  else if (key === "beneficiaryName")
                    label = "Beneficiary Name";
                } else if (type === "netBanking") {
                  if (key === "accountNumber") label = "Account Number";
                  else if (key === "ifsc") label = "IFSC Code";
                  else if (key === "mobile") label = "Mobile Number";
                  else if (key === "email") label = "Email";
                  else if (key === "beneficiaryName")
                    label = "Beneficiary Name";
                  else if (key === "bankName") label = "Bank Name";
                }

                return (
                  <Flex key={idx} gap={"4px"}>
                    <Text size="xs" c={"#778899"} fw={600}>
                      {label}:
                    </Text>
                    <Text c={"#778899"} size="xs">
                      {item[key]}
                    </Text>
                  </Flex>
                );
              })}
          </Box>
        );
      })}

      {(multiple || !allChannelsAdded()) && (
        <Button variant="light" onClick={() => setModalOpened(true)}>
          Add Channel Profile
        </Button>
      )}
    </>
  );
};

export default ChannelModals;

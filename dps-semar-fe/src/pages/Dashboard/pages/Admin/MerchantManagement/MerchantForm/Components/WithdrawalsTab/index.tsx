import {
  Button,
  Fieldset,
  Flex,
  NumberInput,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import ChannelProfile from "../../../../../../../../components/ChannelProfile";
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import {
  ErrorsTab5,
  MerchantResponseDto,
  Tab5KeyNames,
  Tab5State,
} from "../../Utils/types";
import { Channel } from "../../../../../../../../types/channel";
import ChannelModals from "../../../../../../../../components/ChannelModals";

const WithdrawalsTab: React.FC<{
  formState: Tab5State;
  handleChange: (key: Tab5KeyNames, value: any) => void;
  errors: ErrorsTab5;
  channels: Channel[];
  editData: MerchantResponseDto;
}> = ({ formState, handleChange, errors, channels, editData }) => {
  const [opened, handlers] = useDisclosure();
  const [selectedForEdit, setSelectedForEdit] = useState(-1);

  useEffect(() => {
    if (editData && editData.channelProfile) {
      handleChange("channelProfile", {
        ...formState.channelProfile,
        upi: editData.channelProfile.upi,
        netBanking: editData.channelProfile.netBanking,
        eWallet: editData.channelProfile.eWallet,
      });
    }
  }, [editData]);

  return (
    <>
      <Fieldset legend="Channel Profiles for Withdrawal">
        <ChannelModals
          handleChange={(updatedProfiles) =>
            handleChange("channelProfile", updatedProfiles)
          }
          multiple={false}
          editData={editData}
        />
      </Fieldset>

      <NumberInput
        label="Withdrawal Service Rate"
        defaultValue={0.5}
        withAsterisk
        rightSection={<div style={{ marginRight: "8px" }}>%</div>}
        value={formState.withdrawalServiceRate}
        onChange={(value) => handleChange("withdrawalServiceRate", value)}
        error={errors.withdrawalServiceRate}
        decimalScale={2}
      />

      <NumberInput
        label="Minimum withdrawal amount"
        withAsterisk
        defaultValue={0}
        value={formState.minWithdrawal}
        onChange={(value) => handleChange("minWithdrawal", value)}
        error={errors.minWithdrawal}
      />

      <NumberInput
        label="Maximum withdrawal amount"
        withAsterisk
        defaultValue={1000000}
        value={formState.maxWithdrawal}
        onChange={(value) => handleChange("maxWithdrawal", value)}
        error={errors.maxWithdrawal}
      />
    </>
  );
};

export default WithdrawalsTab;

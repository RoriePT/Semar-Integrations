import React, { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import { MemberResponseDto, Tab3State } from "../../Utils/types";
import ChannelModals from "../../../../../../../../components/ChannelModals";

const ChannelProfilesTab: React.FC<{
  formState: Tab3State;
  handleChange: (value: any) => void;
  editData: MemberResponseDto;
}> = ({ formState, handleChange, editData }) => {
  useEffect(() => {
    if (editData && editData.channelProfile) {
      handleChange({
        upi: editData.channelProfile.upi,
        netBanking: editData.channelProfile.netBanking,
        eWallet: editData.channelProfile.eWallet,
      });
    }
  }, [editData]);

  return (
    <>
      <Text c={"gray"} size="xs">
        Provide the member's channels that will be available for processing
        payin, payout, and top-up orders.
      </Text>

      <ChannelModals
        handleChange={handleChange}
        multiple={false}
        editData={editData}
        businessUpi={true}
        //  formState={formState}
      />
    </>
  );
};

export default ChannelProfilesTab;

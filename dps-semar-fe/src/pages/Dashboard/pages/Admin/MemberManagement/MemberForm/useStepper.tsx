import React, { useEffect, useState } from "react";
import {
  ErrorsTab1,
  ErrorsTab2,
  MemberRequestDto,
  MemberResponseDto,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
  Tab3State,
} from "./Utils/types";
import {
  defaultErrorsTab1,
  defaultErrorsTab2,
  getIntialStateTab1,
  getIntialStateTab2,
  getIntialStateTab3,
} from "./Utils/config";
import { validateTab1, validateTab2 } from "./Utils/validate";
import { getPayload } from "./Utils/helpers";
import RegisterAPIs from "../../../../../../api/register";
import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import CommonAPIs from "../../../../../../api/common";
import { useDefaultValues } from "../../../../DefaultValue";

const useStepper = (
  editData: MemberResponseDto,
  triggerReload,
  opened,
  close
) => {
  const { systemDefaults } = useDefaultValues();
  const [currentTab, setCurrentTab] = useState("1");
  const [loading, setLoading] = useState(false);

  const [tab1State, setTab1State] = useState<Tab1State>(
    getIntialStateTab1(editData)
  );
  const [errorsTab1, setErrorsTab1] = useState<ErrorsTab1>(defaultErrorsTab1);

  const handleTab1Change = (key: Tab1KeyNames, value) => {
    setErrorsTab1((prev) => ({ ...prev, [key]: "" }));
    setTab1State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab1ErrorChange = (key: Tab1KeyNames, value) => {
    setErrorsTab1((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTab1 = async () => {
    if (!validateTab1(tab1State, handleTab1ErrorChange, !!editData)) return;

    const response = await CommonAPIs.getReferralCodeData(
      "member-referral",
      tab1State.referralCode
    );

    if (!response?.data || !!editData) {
      // setTab2State((prev) => ({
      //   ...prev,
      //   minPayout: systemDefaults?.minimumPayoutAmountForMember,
      //   maxPayout: systemDefaults?.maximumPayoutAmountForMember,
      //   dailyPayoutLimit: systemDefaults?.maximumDailyPayoutAmountForMember,
      // }));
      setCurrentTab("2");
    } else {
      setTab2State((prev) => ({
        ...prev,
        payinCommission: response.data?.referredMemberPayinCommission,
        payoutCommission: response.data?.referredMemberPayoutCommission,
        topupCommission: response.data?.referredMemberTopupCommission,
        minPayout: systemDefaults?.minimumPayoutAmountForMember,
        maxPayout: systemDefaults?.maximumPayoutAmountForMember,
        dailyPayoutLimit: systemDefaults?.maximumDailyPayoutAmountForMember,
      }));
      setCurrentTab("2");
    }
  };

  // =========Tab 2=============//

  const [tab2State, setTab2State] = useState<Tab2State>(
    getIntialStateTab2(editData)
  );

  const [errorsTab2, setErrorsTab2] = useState<ErrorsTab2>(defaultErrorsTab2);

  const handleTab2ErrorChange = (key: Tab2KeyNames, value) => {
    setErrorsTab2((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab2Change = (key: Tab2KeyNames, value) => {
    setTab2State((prev) => ({ ...prev, [key]: value }));
  };

  //const handleSubmitTab2 = () => setCurrentTab("3");
  const handleSubmitTab2 = () => {
    if (!validateTab2(tab2State, handleTab2ErrorChange)) return;
    setCurrentTab("3");
  };

  // const handleSubmitTab2 = () => {
  //   if (!validateTab2(tab2State, handleTab2ErrorChange)) return;

  //   handleFormValidated();
  // };

  const [tab3State, setTab3State] = useState<Tab3State>(
    getIntialStateTab3(editData)
  );

  const handleTab3Change = (value) => {
    setTab3State({ channelProfile: value });
  };

  const handleBack = () =>
    setCurrentTab((prev) => (parseInt(prev) - 1).toString());

  const setTab2Data = () => {
    if (!!editData) {
      return getIntialStateTab2(editData);
    } else {
      return {
        ...getIntialStateTab2(editData),
        payinCommission: systemDefaults?.payinCommissionRateForMember,
        payoutCommission: systemDefaults?.payoutCommissionRateForMember,
        topupCommission: systemDefaults?.topupCommissionRateForMember,
      };
    }
  };

  const resetAllAfterClose = () => {
    setTab1State(getIntialStateTab1(editData));
    setTab2State(setTab2Data());
    setErrorsTab1(defaultErrorsTab1);
    setTab3State(getIntialStateTab3(editData));

    setCurrentTab("1");
  };

  useEffect(() => {
    resetAllAfterClose();
  }, [opened]);

  // =========Extra State Logic============

  //=====================================

  const handleSubmitTab3 = () => {
    handleFormValidated();
  };

  const handleFormValidated = async () => {
    setLoading(true);

    const payload: MemberRequestDto = getPayload(
      tab1State,
      tab2State,
      tab3State,
      !!editData
    );

    if (!!editData && !tab1State.updateLogin) {
      delete payload.email;
      delete payload.password;
    }

    let response = null;
    if (!editData) response = await RegisterAPIs.registerMember(payload);
    else response = await RegisterAPIs.updateMember(payload, editData.id);

    if (response.isError) {
      notifications.show({
        color: "red",
        title: response.error,
        message: "Error! Please rectify and submit the form again.",
        icon: <FaCheck size={18} color="white" />,
        autoClose: 5000,
        withCloseButton: true,
      });
    } else {
      close();
      triggerReload();
      notifications.show({
        color: "teal",
        title: !!editData ? "Member Updated" : "Member account is created",
        message: !!editData
          ? "Member account is updated successfully!"
          : "Account creation is successful!",
        icon: <FaCheck size={18} color="white" />,
        autoClose: 4000,
        withCloseButton: true,
      });
    }
    setLoading(false);
  };

  return {
    currentTab,
    tab1State,
    errorsTab1,
    errorsTab2,
    handleTab1Change,
    handleSubmitTab1,
    tab2State,
    handleTab2Change,
    handleSubmitTab2,
    // handleBack,
    // disableAll,
    handleBack,
    loading,

    tab3State,
    handleTab3Change,
    handleSubmitTab3,
  };
};

export default useStepper;

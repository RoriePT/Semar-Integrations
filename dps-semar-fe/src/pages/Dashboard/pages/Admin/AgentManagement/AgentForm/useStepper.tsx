import React, { useEffect, useState } from "react";
import {
  defaultErrorsTab1,
  defaultErrorsTab2,
  getIntialStateTab1,
  getIntialStateTab2,
} from "./Utils/config";
import { validateTab1, validateTab2 } from "./Utils/validate";
import RegisterAPIs from "../../../../../../api/register";

import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import { getPayload } from "./Utils/helpers";
import {
  AgentRequestDto,
  AgentResponseType,
  ErrorsTab1,
  ErrorsTab2,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
} from "./Utils/types";
import { useDefaultValues } from "../../../../DefaultValue";

const useStepper = (
  editData: AgentResponseType,
  triggerReload,
  opened,
  close
) => {
  const { systemDefaults } = useDefaultValues();
  const [currentTab, setCurrentTab] = useState("1");
  const [loading, setLoading] = useState(false);

  const [tab2State, setTab2State] = useState<Tab2State>(
    getIntialStateTab2(editData)
  );

  const [tab1State, setTab1State] = useState<Tab1State>(
    getIntialStateTab1(editData)
  );

  const [errorsTab1, setErrorsTab1] = useState<ErrorsTab1>(defaultErrorsTab1);
  const [errorsTab2, setErrorsTab2] = useState<ErrorsTab2>(defaultErrorsTab2);

  const handleTab1Change = (key: Tab1KeyNames, value) => {
    setErrorsTab1((prev) => ({ ...prev, [key]: "" }));
    setTab1State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab2Change = (key: Tab2KeyNames, value) => {
    setErrorsTab2((prev) => ({ ...prev, [key]: "" }));
    setTab2State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab1ErrorChange = (key: Tab1KeyNames, value) => {
    setErrorsTab1((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab2ErrorChange = (key: Tab2KeyNames, value) => {
    setErrorsTab2((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTab1 = () => {
    if (!validateTab1(tab1State, handleTab1ErrorChange, !!editData)) return;
    setCurrentTab("2");
  };

  const handleBack = () => {
    setCurrentTab((prev) => (parseInt(prev) - 1).toString());
  };

  const handleSubmitTab2 = () => {
    if (!validateTab2(tab2State, handleTab2ErrorChange, !!editData)) {
      return;
    }
    handleFormValidated();
  };

  // =========Tab 2=============//

  const setTab2Data = () => {
    if (!!editData) {
      return getIntialStateTab2(editData);
    } else {
      return {
        ...getIntialStateTab2(editData),
        withdrawalRate: systemDefaults.withdrawalRate,
        maxWithdrawalAmount: systemDefaults.maxWithdrawalAmount,
        minWithdrawalAmount: systemDefaults.minWithdrawalAmount,
      };
    }
  };

  const resetAllAfterClose = () => {
    setTab1State(getIntialStateTab1(editData));
    setTab2State(setTab2Data());

    setErrorsTab1(defaultErrorsTab1);
    setErrorsTab2(defaultErrorsTab2);

    setCurrentTab("1");
  };

  useEffect(() => {
    resetAllAfterClose();
  }, [opened]);

  // =========Extra State Logic============

  const [disableAll, setDisableAll] = useState(false);

  //=====================================

  const handleFormValidated = async () => {
    setLoading(true);

    const payload: AgentRequestDto = getPayload(
      tab1State,
      tab2State,
      !!editData
    );

    if (!!editData && !tab1State.updateLogin) {
      delete payload.email;
      delete payload.password;
    }

    if (!!editData && !tab2State.updateWithdrawal) {
      delete payload.withdrawalPassword;
    }

    let response = null;
    if (!editData) response = await RegisterAPIs.registerAgent(payload);
    else response = await RegisterAPIs.updateAgent(payload, editData.id);

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
        title: !!editData ? "Agent Updated" : "Agent account is created",
        message: !!editData
          ? "Agent account is updated successfully!"
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
    tab2State,
    errorsTab1,
    handleTab1Change,
    handleTab2Change,
    handleSubmitTab1,
    handleSubmitTab2,
    handleBack,
    errorsTab2,

    disableAll,

    loading,
  };
};

export default useStepper;

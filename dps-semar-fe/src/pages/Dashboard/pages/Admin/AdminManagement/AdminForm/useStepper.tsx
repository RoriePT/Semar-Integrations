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
import { useDisclosure } from "@mantine/hooks";
import { getPayload } from "./Utils/helpers";
import {
  AdminRequestDto,
  AdminResponseType,
  ErrorsTab1,
  ErrorsTab2,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
} from "./Utils/types";

const useStepper = (
  editData: AdminResponseType,
  triggerReload,
  opened,
  close
) => {
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

  const handleSubmitTab1 = () => {
    if (!validateTab1(tab1State, handleTab1ErrorChange, !!editData)) return;
    setCurrentTab("2");
  };

  // =========Tab 2=============//

  const [tab2State, setTab2State] = useState<Tab2State>(
    getIntialStateTab2(editData)
  );
  const [errorsTab2, setErrorsTab2] = useState<ErrorsTab2>(defaultErrorsTab2);

  const handleTab2Change = (key: Tab2KeyNames, value) => {
    setErrorsTab2((prev) => ({ ...prev, [key]: "" }));
    setTab2State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab2ErrorChange = (key: Tab2KeyNames, value) => {
    setErrorsTab2((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTab2 = () => {
    if (!validateTab2(tab2State, handleTab2ErrorChange)) return;

    handleFormValidated();
  };

  const handleBack = () =>
    setCurrentTab((prev) => (parseInt(prev) - 1).toString());

  const resetAllAfterClose = () => {
    setTab1State(getIntialStateTab1(editData));
    setTab2State(getIntialStateTab2(editData));
    setErrorsTab1(defaultErrorsTab1);
    setErrorsTab2(defaultErrorsTab2);
    setCurrentTab("1");
  };

  useEffect(() => {
    resetAllAfterClose();
  }, [opened]);

  // =========Extra State Logic============

  const [disableAll, setDisableAll] = useState(false);

  useEffect(() => {
    if (tab2State.role === "Super admin") {
      setDisableAll(true);
      setTab2State({
        admins: true,
        balances: true,
        verify: true,
        withdrawals: true,
        users: true,
        role: "Super admin",
        system: true,
        channelsAndGateways: true,
      });
    } else if (tab2State.role === "Sub admin") {
       setDisableAll(false);

      // setTab2State({
      //   admins: false,
      //   balances: false,
      //   verify: false,
      //   withdrawals: false,
      //   users: false,
      //   role: "Sub admin",
      //   system: false,
      //   channelsAndGateways: false,
      // });
    }
  }, [tab2State.role]);

  //=====================================

  const handleFormValidated = async () => {
    setLoading(true);

    const payload: AdminRequestDto = getPayload(
      tab1State,
      tab2State,
      !!editData
    );

    if (!!editData && !tab1State.updateLogin) {
      delete payload.email;
      delete payload.password;
    }

    let response = null;
    if (!editData) response = await RegisterAPIs.registerAdmin(payload);
    else response = await RegisterAPIs.updateAdmin(payload, editData.id);

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
        title: !!editData ? "Admin Updated" : "Admin account is created",
        message: !!editData
          ? "Admin account is updated successfully!"
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
    handleTab1Change,
    handleSubmitTab1,

    tab2State,
    errorsTab2,
    handleTab2Change,
    handleSubmitTab2,
    handleBack,
    disableAll,

    loading,
  };
};

export default useStepper;

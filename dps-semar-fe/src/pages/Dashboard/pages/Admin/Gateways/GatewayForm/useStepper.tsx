import React, { useEffect, useState } from "react";
import {
  defaultErrorsTab1,
  defaultErrorsTab3,
  getIntialStateTab1,
  getIntialStateTab2,
  getIntialStateTab3,
  initializeErrorsForFields,
} from "./Utils/config";
import { validateTab1, validateTab2, validateTab3 } from "./Utils/validate";
import RegisterAPIs from "../../../../../../api/register";

import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";

import {
  GatewayRequestDtoType,
  GatewayResponseType,
  ErrorsTab1,
  ErrorsTab2,
  ErrorsTab3,
  FieldTypeKeyNames,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
  Tab3State,
  Tab3KeyNames,
  Key,
} from "./Utils/types";
import { getPayload } from "./Utils/helpers";

const useStepper = (
  editData: GatewayResponseType,
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
  const [errorsTab2, setErrorsTab2] = useState<ErrorsTab2>(
    initializeErrorsForFields(tab2State.fields)
  );

  const handleTab2Change = (
    index: number,
    key: FieldTypeKeyNames,
    value: string
  ) => {
    setErrorsTab2((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: "",
      },
    }));

    setTab2State((prevState) => ({
      ...prevState,
      fields: prevState.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      ),
    }));
  };

  const handleTab2ErrorChange = (
    index: number,
    key: FieldTypeKeyNames,
    value: string
  ) => {
    setErrorsTab2((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: value,
      },
    }));
  };

  const handleSubmitTab2 = () => {
    if (!validateTab2(tab2State, handleTab2ErrorChange)) return;

    handleFormValidated();
  };

  const [tab3State, setTab3State] = useState<Tab3State>(
    getIntialStateTab3(editData)
  );
  const [errorsTab3, setErrorsTab3] = useState<ErrorsTab3>(defaultErrorsTab3);

  const handleTab3Change = (key: Tab3KeyNames, value) => {
    setErrorsTab3((prev) => ({ ...prev, [key]: "" }));
    setTab3State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab3ErrorChange = (key: Tab3KeyNames, value) => {
    setErrorsTab3((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTab3 = () => {
    if (!validateTab3(tab3State, handleTab3ErrorChange)) return;
    setCurrentTab("3");
  };

  const handleBack = () =>
    setCurrentTab((prev) => (parseInt(prev) - 1).toString());

  const resetAllAfterClose = () => {
    setTab1State(getIntialStateTab1(editData));
    setTab2State(getIntialStateTab2(editData));
    setErrorsTab1(defaultErrorsTab1);
    setErrorsTab2(initializeErrorsForFields(tab2State.fields));
    setCurrentTab("1");
  };

  useEffect(() => {
    resetAllAfterClose();
  }, [opened]);

  const handleFormValidated = async () => {
    setLoading(true);

    const payload: GatewayRequestDtoType = getPayload(
      tab1State,
      tab2State,
      tab3State,
      !!editData
    );

    let response = null;
    if (!editData) response = await RegisterAPIs.registerGateway(payload);
    else response = await RegisterAPIs.updateGateway(payload, editData.id);

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
        title: !!editData ? "Channel Updated" : "Channel is created",
        message: !!editData
          ? "Channel is updated successfully!"
          : "Channel creation is successful!",
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
    setTab2State,

    tab2State,
    errorsTab2,
    handleTab2Change,
    handleSubmitTab2,
    handleBack,

    tab3State,
    errorsTab3,
    handleTab3Change,
    handleSubmitTab3,

    loading,
  };
};

export default useStepper;

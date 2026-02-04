import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { validatePattern } from "bhimupijs";
import UpiVendorAPIs from "../../../../../../api/upiVendor";
import { getPayload } from "./Utils/helpers";
import {
  ErrorsTab1,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
  UpiVendorResponseDto,
} from "./Utils/types";
import { validateTab1, validateTab2 } from "./Utils/validate";

const getInitialTab1 = (editData: UpiVendorResponseDto): Tab1State => {
  if (editData) {
    // Use firstName/lastName from API, or fallback to splitting name
    const firstName = editData.firstName || "";
    const lastName = editData.lastName || "";
    const phone = editData.phone || editData.mobile || "";

    // Use enabled field if available, otherwise check status
    const enabled =
      editData.enabled !== undefined
        ? editData.enabled
        : editData.status === "ACTIVE";

    return {
      firstName: firstName || "",
      lastName: lastName || "",
      email: editData.email || "",
      contact: phone,
      password: "",
      confirmPassword: "",
      enabled: enabled,
      updateLogin: false,
    };
  }

  return {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    enabled: true,
    updateLogin: false,
  };
};

const getInitialTab2 = (editData: UpiVendorResponseDto): Tab2State => {
  if (editData && editData.upiIds && editData.upiIds.length > 0) {
    return {
      commissionRate:
        editData.commissionRate !== undefined &&
        editData.commissionRate !== null
          ? `${editData.commissionRate}`
          : "",
      settlementUpiId: editData.settlementUpiId || "",
      upiIds: editData.upiIds.map((upi, index) => ({
        upiId: upi.upiId || "",
        mobile: upi.mobile || "",
        email: upi.email || "",
        beneficiaryName: upi.beneficiaryName || "",
        isBusinessUpi:
          upi.isBusinessUpi !== undefined ? upi.isBusinessUpi : true,
        channelIndex: upi.channelIndex !== undefined ? upi.channelIndex : index,
        title: upi.title || "",
        enabled: upi.enabled !== undefined ? upi.enabled : true,
        settlementAmount: upi.settlementAmount || 0,
        hasReceivedPayin: upi.hasReceivedPayin || false,
        isPreserved: upi.isPreserved || false,
      })),
    };
  }
  return { commissionRate: "", settlementUpiId: "", upiIds: [] };
};

const defaultErrorsTab1: ErrorsTab1 = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  password: "",
  confirmPassword: "",
};

const useStepper = (
  editData: UpiVendorResponseDto,
  triggerReload: () => void,
  opened: boolean,
  close: () => void
) => {
  const [currentTab, setCurrentTab] = useState("1");
  const [loading, setLoading] = useState(false);

  const [tab1State, setTab1State] = useState<Tab1State>(
    getInitialTab1(editData)
  );
  const [errorsTab1, setErrorsTab1] = useState<ErrorsTab1>(defaultErrorsTab1);

  const [tab2State, setTab2State] = useState<Tab2State>(
    getInitialTab2(editData)
  );

  useEffect(() => {
    if (editData) {
      setTab1State(getInitialTab1(editData));
      setTab2State(getInitialTab2(editData));
    }
  }, [editData]);

  useEffect(() => {
    if (!opened) {
      setCurrentTab("1");
      setTab1State(getInitialTab1(editData));
      setErrorsTab1(defaultErrorsTab1);
      setTab2State(getInitialTab2(editData));
    }
  }, [opened]);

  const handleTab1ErrorChange = (key: Tab1KeyNames, value: string) => {
    setErrorsTab1((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab1Change = (key: Tab1KeyNames, value: any) => {
    setErrorsTab1((prev) => ({ ...prev, [key]: "" }));
    setTab1State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab2Change = (key: Tab2KeyNames, value: any) => {
    console.log("handleTab2Change called with:", { key, value });
    setTab2State((prev) => {
      const newState = { ...prev, [key]: value };
      console.log("Updating tab2State from:", prev, "to:", newState);
      return newState;
    });
  };

  const handleSubmitTab1 = () => {
    if (!validateTab1(tab1State, handleTab1ErrorChange, !!editData)) {
      return;
    }
    setCurrentTab("2");
  };

  const handleSubmitTab2 = async () => {
    // Two-stage submit: if currently on Rates tab ("2"), move to UPI Info after validation
    if (currentTab === "2") {
      const rate = tab2State.commissionRate;
      const isValid = rate !== "" && /^\d+(\.\d{1,2})?$/.test(`${rate}`);
      if (!isValid) {
        notifications.show({
          color: "red",
          title: "Validation Error",
          message: "Enter a valid commission rate (up to 2 decimals)",
          autoClose: 4000,
        });
        return;
      }
      
      // Validate Settlement UPI ID
      if (!tab2State.settlementUpiId || !tab2State.settlementUpiId.trim()) {
        notifications.show({
          color: "red",
          title: "Validation Error",
          message: "Settlement UPI ID is required",
          autoClose: 4000,
        });
        return;
      }
      
      // Validate UPI format
      const validationResult = validatePattern(tab2State.settlementUpiId.trim());
      if (!validationResult.isQueryPatternValid) {
        notifications.show({
          color: "red",
          title: "Validation Error",
          message: "Invalid UPI ID format for Settlement UPI ID",
          autoClose: 4000,
        });
        return;
      }
      
      setCurrentTab("3");
      return;
    }

    // currentTab === "3" → final submit; ensure at least one UPI ID
    if (!validateTab2(tab2State)) {
      notifications.show({
        color: "red",
        title: "Validation Error",
        message: "Please add at least one UPI ID",
        autoClose: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = getPayload(tab1State, tab2State, !!editData);
      let response;

      if (editData) {
        response = await UpiVendorAPIs.updateUpiVendor(payload, editData.id);
      } else {
        response = await UpiVendorAPIs.createUpiVendor(payload);
      }

      if (response && !response.isError) {
        notifications.show({
          color: "teal",
          title: editData ? "UPI Vendor Updated" : "UPI Vendor Created",
          message: editData
            ? "UPI vendor account updated successfully!"
            : "UPI vendor account created successfully!",
          icon: <FaCheck size={18} color="white" />,
          autoClose: 4000,
          withCloseButton: true,
        });
        triggerReload();
        close();
      } else {
        notifications.show({
          color: "red",
          title: "Error",
          message: response?.error || "Something went wrong",
          autoClose: 4000,
          withCloseButton: true,
        });
      }
    } catch (error: any) {
      notifications.show({
        color: "red",
        title: "Error",
        message: error?.message || "Something went wrong",
        autoClose: 4000,
        withCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setCurrentTab(currentTab === "3" ? "2" : "1");

  return {
    currentTab,
    errorsTab1,
    handleSubmitTab1,
    handleSubmitTab2,
    handleTab1Change,
    handleTab2Change,
    tab1State,
    tab2State,
    handleBack,
    loading,
  };
};

export default useStepper;

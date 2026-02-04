import { useEffect, useState } from "react";
import {
  ErrorsTab1,
  ErrorsTab2,
  ErrorsTab3,
  ErrorsTab4,
  ErrorsTab5,
  MerchantResponseDto,
  RangeDto,
  RatioDto,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
  Tab3KeyNames,
  Tab3State,
  Tab4KeyNames,
  Tab4State,
  Tab5KeyNames,
  Tab5State,
} from "./Utils/types";
import {
  validateTab1,
  validateTab2,
  validateTab3,
  validateTab4,
  validateTab5,
} from "./Utils/validate";
import {
  defaultErrorsTab1,
  defaultErrorsTab2,
  defaultErrorsTab3,
  getIntialStateTab1,
  getIntialStateTab2,
  getIntialStateTab3,
  getInitialStateTab4,
  getInitialStateTab5,
  defaultErrorsTab5,
  defaultErrorsTab4,
} from "./Utils/config";
import { notifications, showNotification } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import RegisterAPIs from "../../../../../../api/register";
import { formatChannelsForPayload, getPayload } from "./Utils/helpers";
import { useDefaultValues } from "../../../../DefaultValue";
import CommonAPIs from "../../../../../../api/common";

const useStepper = (
  editData: MerchantResponseDto,
  triggerReload,
  opened,
  close
) => {
  const { systemDefaults } = useDefaultValues();
  const [mainTab, setMainTab] = useState("general");
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
    setCurrentTab("2");
  };

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
    if (!validateTab2(tab2State, handleTab2ErrorChange, !!editData)) return;
    setMainTab("advanced");
    setCurrentTab("3");
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
    if (!validateTab3(tab3State, handleTab3ErrorChange, !!editData)) return;
    setCurrentTab("4");
  };

  const [tab4State, setTab4State] = useState<Tab4State>(
    getInitialStateTab4(editData)
  );
  const [errorsTab4, setErrorsTab4] = useState<ErrorsTab4>(defaultErrorsTab4);

  const handleTab4Change = (key: Tab4KeyNames, value) => {
    setErrorsTab4((prev) => ({ ...prev, [key]: "" }));
    setTab4State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab4ErrorChange = (key: Tab4KeyNames, value) => {
    setErrorsTab4((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTab4 = () => {
    if (!validateTab4(tab4State, handleTab4ErrorChange)) return;

    setCurrentTab("5");
  };

  const [tab5State, setTab5State] = useState<Tab5State>(
    getInitialStateTab5(editData)
  );
  const [errorsTab5, setErrorsTab5] = useState<ErrorsTab5>(defaultErrorsTab5);

  const handleTab5Change = (key: Tab5KeyNames, value) => {
    setErrorsTab5((prev) => ({ ...prev, [key]: "" }));
    setTab5State((prev) => ({ ...prev, [key]: value }));
  };

  const handleTab5ErrorChange = (key: Tab5KeyNames, value) => {
    setErrorsTab5((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTab5 = async () => {
    // setLoading(true);
    // tab5State.channelProfile = formatChannelsForPayload(
    //   tab5State.channelProfile
    // );

    const payload = getPayload(
      tab1State,
      tab2State,
      tab3State,
      tab4State,
      tab5State,
      !!editData
    );

    if (!validateTab5(tab5State, handleTab5ErrorChange)) {
      // setLoading(false);
      return;
    }

    try {
      let response = null;
      setLoading(true);
      if (payload.payinMode === "PROPORTIONAL") delete payload?.amountRanges;
      if (payload.payinMode === "AMOUNT RANGE") delete payload?.ratios;
      if (payload.payinMode === "DEFAULT") {
        delete payload?.amountRanges;
        delete payload?.ratios;
      }
      if (editData) {
        response = await RegisterAPIs.updateMerchant(payload, editData?.id);
        setLoading(false);
      } else {
        response = await RegisterAPIs.registerMerchant(payload);
        setLoading(false);
      }

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
        resetAllAfterClose();
        notifications.show({
          color: "teal",
          title: !!editData
            ? "Merchant Updated"
            : "Merchant account is created",
          message: !!editData
            ? "Merchant account is updated successfully!"
            : "Merchant creation is successful!",
          icon: <FaCheck size={18} color="white" />,
          autoClose: 4000,
          withCloseButton: true,
        });
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Submission Error",
        message: "An unexpected error occurred. Please try again.",
        icon: <FaCheck size={18} color="white" />,
        autoClose: 5000,
        withCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const setInitialDataForTab3 = () => {
    if (!!editData) {
      return getIntialStateTab3(editData);
    } else {
      return {
        ...getIntialStateTab3(editData),
        // payinServiceRate: systemDefaults?.payinServiceRateForMerchant,
      };
    }
  };
  const setInitialDataForTab4 = () => {
    if (!!editData) {
      return getInitialStateTab4(editData);
    } else {
      return {
        ...getInitialStateTab4(editData),
        minPayout: systemDefaults?.minimumPayoutAmountForMerchant,
        maxPayout: systemDefaults?.maximumPayoutAmountForMerchant,
      };
    }
  };

  const setInitialDataForTab5 = () => {
    if (!!editData) {
      return getInitialStateTab5(editData);
    } else {
      return {
        ...getInitialStateTab5(editData),
        minWithdrawal: systemDefaults?.minWithdrawalAmount,
        maxWithdrawal: systemDefaults?.maxWithdrawalAmount,
        withdrawalServiceRate: systemDefaults?.withdrawalRate,
      };
    }
  };

  const resetAllAfterClose = () => {
    setTab1State(getIntialStateTab1(editData));
    setTab2State(getIntialStateTab2(editData));
    setTab3State(setInitialDataForTab3());
    setTab4State(setInitialDataForTab4());
    setTab5State(setInitialDataForTab5());
    setErrorsTab1(defaultErrorsTab1);
    setErrorsTab2(defaultErrorsTab2);
    setErrorsTab3(defaultErrorsTab3);
    setErrorsTab4(defaultErrorsTab4);
    setErrorsTab5(defaultErrorsTab5);
    setCurrentTab("1");
    setMainTab("general");
  };

  useEffect(() => {
    resetAllAfterClose();
  }, [opened]);

  const handleBack = () => {
    if (currentTab === "3") setMainTab("general");
    setCurrentTab((prev) => (parseInt(prev) - 1).toString());
  };

  // const [channels, setChannels] = useState([]);

  const { channels } = useDefaultValues();

  // useEffect(() => {
  //   const fetchChannels = async () => {
  //     const data = await getAllChannels();
  //     setChannels(data);
  //   };

  //   fetchChannels();
  // }, []);

  const getRecentAmountRange = () => {
    let arr = [];
    const srcArray =
      tab3State?.amountRanges?.length > 0
        ? tab3State.amountRanges
        : editData?.amountRangeRange;

    if (tab3State?.payinMode === "AMOUNT RANGE") {
      for (let index = 0; index < srcArray?.length; index++) {
        const temp: RangeDto = {
          gateway: srcArray?.length ? srcArray[index]?.gateway : "",
          lower: srcArray?.length ? srcArray[index]?.lower : 0,
          upper: srcArray?.length ? srcArray[index]?.upper : 0,
        };
        arr.push(temp);
      }
    }

    if (
      tab3State.numberOfRangesOrRatio === editData?.amountRangeRange?.length
    ) {
      return arr;
    } else {
      return Array(tab3State.numberOfRangesOrRatio || 0).fill({
        gateway: "",
        lower: 0,
        upper: 0,
      });
    }
  };

  const getRecentRatios = () => {
    let arr = [];
    const srcArray =
      tab3State?.ratios?.length > 0
        ? tab3State.ratios
        : editData?.propotionRatio;

    if (tab3State?.payinMode === "PROPORTIONAL") {
      for (let index = 0; index < srcArray?.length; index++) {
        const temp: RatioDto = {
          gateway: srcArray?.length ? srcArray[index]?.gateway : "",
          ratio: srcArray?.length ? srcArray[index]?.ratio : "",
        };

        arr.push(temp);
      }
    }

    if (tab3State.numberOfRangesOrRatio === editData?.propotionRatio?.length) {
      return arr;
    } else {
      return Array(tab3State.numberOfRangesOrRatio || 0).fill({
        gateway: "",
        ratio: "",
      });
    }
  };

  useEffect(() => {
    const setRangesAndRatios = () => {
      setTab3State((prev) => ({
        ...prev,
        amountRanges: getRecentAmountRange(),
        ratios: getRecentRatios(),
      }));
    };

    setRangesAndRatios();
  }, [tab3State.numberOfRangesOrRatio, tab3State.payinMode]);

  return {
    mainTab,
    currentTab,
    tab1State,
    handleTab1Change,
    handleSubmitTab1,
    errorsTab1,

    tab2State,
    handleTab2Change,
    handleSubmitTab2,
    tab3State,
    handleTab3Change,
    handleSubmitTab3,
    handleSubmitTab4,
    errorsTab3,
    errorsTab2,
    tab4State,
    handleTab4Change,
    errorsTab4,
    errorsTab5,
    tab5State,
    handleSubmitTab5,
    handleTab5Change,
    handleBack,
    loading,
    channels,
  };
};

export default useStepper;

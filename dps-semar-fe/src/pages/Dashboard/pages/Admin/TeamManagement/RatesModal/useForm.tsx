import { useEffect, useState } from "react";
import { useDefaultValues } from "../../../../DefaultValue";
import CommonAPIs from "../../../../../../api/common";
import { notifications } from "@mantine/notifications";

type FormValues = {
  teamPayinCommissionRate: number;
  teamTopupCommissionRate: number;
  teamPayoutCommissionRate: number;
};

type FormErrors = {
  [key: string]: string;
};

const useForm = (teamId: any, commissionRates: any, close, triggerReload) => {
  const initialValues: FormValues = {
    teamPayinCommissionRate: commissionRates?.teamPayinCommissionRate || 0,
    teamTopupCommissionRate: commissionRates?.teamTopupCommissionRate || 0,
    teamPayoutCommissionRate: commissionRates?.teamPayoutCommissionRate || 0,
  };

  const [formState, setFormState] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors | any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (field: keyof FormValues, value: number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleValidateForm = () => {
    let isValid = true;
    const payinRate = formState?.teamPayinCommissionRate;
    const payoutRate = formState?.teamPayoutCommissionRate;
    const topupRate = formState?.teamTopupCommissionRate;

    if (!payinRate || !payoutRate || !topupRate) {
      setErrors((prev) => ({
        ...prev,
        teamPayinCommissionRate: payinRate ? "" : "Payin rate is required.",
        teamPayoutCommissionRate: payoutRate ? "" : "Payout rate is required.",
        teamTopupCommissionRate: topupRate ? "" : "Topup rate is required.",
      }));
      isValid = false;
    }

    if (payinRate < 0 || payinRate > 100) {
      setErrors((prev) => ({
        ...prev,
        payinRate: "Payin rate must be 0 to 100.",
      }));
      isValid = false;
    }
    if (payoutRate < 0 || payoutRate > 100) {
      setErrors((prev) => ({
        ...prev,
        payoutRate: "Payout rate must be 0 to 100.",
      }));
      isValid = false;
    }
    if (topupRate < 0 || topupRate > 100) {
      setErrors((prev) => ({
        ...prev,
        topupRate: "Topup rate must be 0 to 100.",
      }));
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = handleValidateForm();

    const payload = {
      teamPayinCommissionRate: formState.teamPayinCommissionRate,
      teamTopupCommissionRate: formState.teamTopupCommissionRate,
      teamPayoutCommissionRate: formState.teamPayoutCommissionRate,
    };

    if (isValid) {
      setLoading(true);
      const res = await CommonAPIs.updateTeamCommissionRates(teamId, payload);
      if (res) {
        notifications.show({
          title: "Success",
          message: "Team commission rates updated successfully.",
          color: "green",
        });
        close();
        triggerReload();
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormState({
      teamPayinCommissionRate: commissionRates?.teamPayinCommissionRate || 0,
      teamTopupCommissionRate: commissionRates?.teamTopupCommissionRate || 0,
      teamPayoutCommissionRate: commissionRates?.teamPayoutCommissionRate || 0,
    });
  }, [commissionRates]);

  return {
    formState,
    handleChange,
    handleSubmit,
    handleValidateForm,
    errors,
    loading,
    openConfirm,
    setOpenConfirm,
  };
};

export default useForm;

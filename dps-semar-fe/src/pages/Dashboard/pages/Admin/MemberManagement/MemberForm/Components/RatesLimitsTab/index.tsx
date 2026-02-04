import { Fieldset, NumberInput, TextInput } from "@mantine/core";
import React from "react";
import { ErrorsTab2, Tab2KeyNames, Tab2State } from "../../Utils/types";

const RatesLimitsTab: React.FC<{
  formState: Tab2State;
  handleChange: (key: Tab2KeyNames, value: any) => void;
  errors: ErrorsTab2;
}> = ({ formState, handleChange, errors }) => {
  const handleValidatedChangePercent = (
    key: Tab2KeyNames,
    value: number | string
  ) => {
    const num = parseFloat(value.toString());

    if (num >= 0 && num <= 100) handleChange(key, num);
  };

  const handleValidatedChangeAmount = (
    key: Tab2KeyNames,
    value: number | string
  ) => {
    const num = parseInt(value.toString());

    if (num >= 0 && num <= 10000000) handleChange(key, num);
  };

  return (
    <>
      {/* <Fieldset
        legend="Order Commission Rates"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <NumberInput
          label="Payin commission rate"
          placeholder="Enter payin commission rate"
          rightSection={"%"}
          withAsterisk
          value={formState.payinCommission}
          onChange={(v) => handleValidatedChangePercent("payinCommission", v)}
          allowDecimal={true}
          error={errors.payinCommission}
        />
        <NumberInput
          label="Payout commission rate"
          placeholder="Enter payout commission rate"
          rightSection={"%"}
          withAsterisk
          value={formState.payoutCommission}
          onChange={(v) => handleValidatedChangePercent("payoutCommission", v)}
          allowDecimal={true}
          error={errors.payoutCommission}
        />
        <NumberInput
          label="Top-up commission rate"
          placeholder="Enter top-up commission rate"
          rightSection={"%"}
          withAsterisk
          value={formState.topupCommission}
          onChange={(v) => handleValidatedChangePercent("topupCommission", v)}
          allowDecimal={true}
          error={errors.topupCommission}
        />
      </Fieldset> */}

      <Fieldset
        legend="Payout limits"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <NumberInput
          label="Minimum single payout amount"
          withAsterisk
          min={0}
          value={formState.minPayout}
          onChange={(v) => handleValidatedChangeAmount("minPayout", v)}
          error={errors.minPayout}
        />
        <NumberInput
          label="Maximum single payout amount"
          withAsterisk
          max={10000000}
          value={formState.maxPayout}
          onChange={(v) => handleValidatedChangeAmount("maxPayout", v)}
          error={errors.maxPayout}
        />

        <NumberInput
          label="Maximum total daily payout amount"
          withAsterisk
          max={10000000}
          value={formState.dailyPayoutLimit}
          onChange={(v) => handleValidatedChangeAmount("dailyPayoutLimit", v)}
          error={errors.dailyPayoutLimit}
        />
      </Fieldset>

      {/* <Fieldset
        legend="Withdrawal"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <NumberInput
          label="Withdrawal service rate"
          placeholder="Enter withdrawal service rate"
          rightSection={"%"}
          withAsterisk
          value={formState.withdrawalRate}
          onChange={(v) => handleValidatedChangePercent("withdrawalRate", v)}
          allowDecimal={true}
          error={errors.withdrawalRate}
        />
        <NumberInput
          label="Minimum withdrawal amount"
          withAsterisk
          min={0}
          value={formState.minWithdrawalAmount}
          onChange={(v) =>
            handleValidatedChangeAmount("minWithdrawalAmount", v)
          }
          error={errors.minWithdrawalAmount}
        />
        <NumberInput
          label="Maximum withdrawal amount"
          withAsterisk
          max={10000000}
          value={formState.maxWithdrawalAmount}
          onChange={(v) =>
            handleValidatedChangeAmount("maxWithdrawalAmount", v)
          }
          error={errors.maxWithdrawalAmount}
        />
      </Fieldset> */}
    </>
  );
};

export default RatesLimitsTab;

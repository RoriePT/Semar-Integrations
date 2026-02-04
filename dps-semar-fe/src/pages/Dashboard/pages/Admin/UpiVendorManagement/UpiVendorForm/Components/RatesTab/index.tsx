import { NumberInput, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { validatePattern, ValidateVPA } from "bhimupijs";

const RatesTab: React.FC<{
  commissionRate: string;
  settlementUpiId: string;
  onCommissionRateChange: (val: string) => void;
  onSettlementUpiIdChange: (val: string) => void;
  settlementUpiIdError?: string;
}> = ({ 
  commissionRate, 
  settlementUpiId, 
  onCommissionRateChange, 
  onSettlementUpiIdChange,
  settlementUpiIdError 
}) => {
  const [localError, setLocalError] = useState<string>("");

  const validateUPI = (vpa: string): string | null => {
    const validationResult: ValidateVPA = validatePattern(vpa);
    if (!validationResult.isQueryPatternValid) {
      return "Invalid UPI ID format.";
    }
    return null;
  };

  const handleSettlementUpiIdChange = (value: string) => {
    setLocalError("");
    onSettlementUpiIdChange(value);
    
    if (value && value.trim()) {
      const error = validateUPI(value.trim());
      if (error) {
        setLocalError(error);
      }
    }
  };

  return (
    <>
      <NumberInput
        label="Commission Rate (%)"
        placeholder="e.g. 1.25"
        decimalScale={2}
        allowNegative={false}
        value={commissionRate === "" ? undefined : Number(commissionRate)}
        onChange={(val) => onCommissionRateChange(val?.toString?.() ?? "")}
        mb="md"
      />
      <TextInput
        label="Settlement UPI ID"
        placeholder="e.g. vendor@paytm"
        value={settlementUpiId}
        onChange={(e) => handleSettlementUpiIdChange(e.currentTarget.value)}
        error={settlementUpiIdError || localError}
        withAsterisk
        required
      />
    </>
  );
};

export default RatesTab;

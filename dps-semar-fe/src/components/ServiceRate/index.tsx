import React, { useState, useEffect } from "react";
import { Flex, NumberInput, Select, Text } from "@mantine/core";

interface ServiceRateProps {
  label: string;
  onValueChange: (value: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  }) => void;
  formState: {
    mode: string;
    absoluteAmount: number;
    percentageAmount: number;
  };
  errorMessage?:
    | {
        [key: string]: string;
      }
    | any;
}

const ServiceRate: React.FC<ServiceRateProps> = ({
  label,
  onValueChange,
  formState,
  errorMessage,
}) => {
  const [selectedType, setSelectedType] = useState<string>(formState?.mode);
  const [absoluteAmount, setAbsoluteAmount] = useState<number>(
    formState?.absoluteAmount
  );
  const [percentageAmount, setPercentageAmount] = useState<number>(
    formState?.percentageAmount
  );

  const handleTypeChange = (mode: string) => {
    onValueChange({
      mode,
      absoluteAmount: absoluteAmount ?? 0,
      percentageAmount: percentageAmount ?? 0,
    });
  };

  const handleAmountChange = (value: number) => {
    onValueChange({
      mode: selectedType,
      absoluteAmount: value,
      percentageAmount: percentageAmount ?? 0,
    });
  };

  const handlePercentageChange = (value: number) => {
    onValueChange({
      mode: selectedType,
      absoluteAmount: absoluteAmount ?? 0,
      percentageAmount: value,
    });
  };

  useEffect(() => {
    setSelectedType(formState?.mode);
    setAbsoluteAmount(formState?.absoluteAmount);
    setPercentageAmount(formState?.percentageAmount);
  }, [formState]);

  return (
    <>
      <Select
        label={label}
        placeholder="Choose type"
        data={["PERCENTAGE", "ABSOLUTE", "COMBINATION"]}
        value={formState?.mode}
        onChange={(mode) => handleTypeChange(mode)}
        error={errorMessage?.mode}
      />

      {selectedType === "PERCENTAGE" && (
        <NumberInput
          label="Service Rate"
          withAsterisk
          rightSection={<div style={{ marginRight: "8px" }}>%</div>}
          value={formState?.percentageAmount}
          onChange={handlePercentageChange}
          error={errorMessage?.percentageAmount}
          mt={"xs"}
          decimalScale={2}
        />
      )}

      {selectedType === "ABSOLUTE" && (
        <NumberInput
          label="Amount"
          withAsterisk
          leftSection={<div style={{ marginRight: "8px" }}>₹</div>}
          value={formState?.absoluteAmount}
          onChange={handleAmountChange}
          error={errorMessage?.absoluteAmount}
          mt={"xs"}
          decimalScale={2}
        />
      )}

      {selectedType === "COMBINATION" && (
        <Flex justify="space-between" align="center" gap="sm" mt={"xs"}>
          <NumberInput
            label="Amount"
            withAsterisk
            leftSection={<div style={{ marginRight: "8px" }}>₹</div>}
            value={formState?.absoluteAmount}
            onChange={handleAmountChange}
            error={errorMessage?.absoluteAmount}
            decimalScale={2}
          />
          <Text mt={"20px"}>+</Text>
          <NumberInput
            label="Percentage"
            withAsterisk
            rightSection={<div style={{ marginRight: "8px" }}>%</div>}
            value={formState?.percentageAmount}
            onChange={handlePercentageChange}
            error={errorMessage?.percentageAmount}
            decimalScale={2}
          />
        </Flex>
      )}
    </>
  );
};

export default ServiceRate;

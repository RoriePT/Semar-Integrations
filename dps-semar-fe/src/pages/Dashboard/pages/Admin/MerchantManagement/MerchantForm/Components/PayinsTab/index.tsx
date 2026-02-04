import {
  Box,
  Button,
  CloseButton,
  Fieldset,
  Flex,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  Text,
} from "@mantine/core";
import React, { useEffect } from "react";
import ServiceRate from "../../../../../../../../components/ServiceRate";
import { Channel } from "../../../../../../../../types/channel";
import {
  ErrorsTab3,
  PayinChannelKey,
  Tab3KeyNames,
  Tab3State,
} from "../../Utils/types";

const PayinsTab: React.FC<{
  formState: Tab3State;
  handleChange: (key: Tab3KeyNames, value: any) => void;
  errors: ErrorsTab3;
  channels: Channel[];
  editData;
}> = ({ formState, handleChange, errors, channels, editData }) => {
  const changeAmountValues = (
    index,
    value,
    key: "lower" | "upper" | "gateway"
  ) => {
    const tempRanges = [...formState.amountRanges];

    value = key !== "gateway" ? parseInt(value) : value;

    if (key === "upper") {
      tempRanges[index] = {
        ...tempRanges[index],
        [key]: value,
      };
      if (index + 1 < tempRanges.length) {
        if (value !== "") {
          tempRanges[index + 1].lower = value + 1;
        } else {
          tempRanges[index + 1].lower = 0;
        }
      }
      if (index + 1 === tempRanges.length) {
        tempRanges[index + 1].upper = value;
      } else {
        tempRanges[index + 1].upper = 0;
      }
    }

    if (key === "lower") {
      tempRanges[index].lower = value;
    }

    if (key === "gateway") {
      tempRanges[index] = {
        ...tempRanges[index],
        [key]: value,
      };
    }

    handleChange("amountRanges", tempRanges);
  };

  const changeRatioValues = (index, value, key: "ratio" | "gateway") => {
    const updatedRatios = [...formState.ratios];
    updatedRatios[index] = {
      ...updatedRatios[index],
      [key]: value,
    };

    handleChange("ratios", updatedRatios);
  };

  useEffect(() => {
    if (formState?.amountRanges?.length) {
      formState.amountRanges[0].lower = 1;

      if (!formState?.amountRanges[formState.amountRanges.length - 1].upper) {
        formState.amountRanges[formState.amountRanges.length - 1].upper =
          Number.MAX_SAFE_INTEGER;
      }
    }
  }, [formState]);

  useEffect(() => {
    if (formState.payinMode === "DEFAULT") {
      handleChange("ratios", []);
      handleChange("amountRanges", []);
    }
    if (formState.payinMode === "AMOUNT RANGE") {
      handleChange("ratios", []);
    }
    if (formState.payinMode === "PROPORTIONAL") {
      handleChange("amountRanges", []);
    }
  }, [formState.payinMode, formState.numberOfRangesOrRatio]);

  useEffect(() => {
    if (!formState.allowMemberChannelsPayin)
      handleChange("allowPgBackupForPayin", true);
    if (!formState.allowPgBackupForPayin)
      handleChange("allowMemberChannelsPayin", true);
  }, [formState.allowMemberChannelsPayin, formState.allowPgBackupForPayin]);

  useEffect(() => {
    if (
      !editData &&
      formState.payinMode === "DEFAULT" &&
      formState.payinChannels.length === 0
    ) {
      const initialChannels = ["UPI"];
      const initialData = initialChannels.map((c) => ({
        channel: c,
        gateway: "",
      }));
      handleChange("payinChannels", initialData);
    }
  }, [formState.payinMode]);

  // When UPI Vendor Gateway is enabled, turn other fallbacks off automatically
  useEffect(() => {
    if (formState.enableUpiVendorGateway) {
      if (formState.allowMemberChannelsPayin)
        handleChange("allowMemberChannelsPayin", false);
      if (formState.allowPgBackupForPayin)
        handleChange("allowPgBackupForPayin", false);
    }
  }, [formState.enableUpiVendorGateway]);

  return (
    <>
      {/* <MultiSelect
        label="Payin Channels"
        error={errors.payinChannels}
        withAsterisk
        placeholder="Pick one or more channels "
        data={channels?.map((ch) => ch.name)}
        value={formState.payinChannels}
        onChange={(strs) => {
          handleChange("payinChannels", strs);
        }}
      /> */}

      {!formState.enableUpiVendorGateway && (
        <Select
          label="Payin Mode"
          placeholder="Choose payin mode"
          data={["DEFAULT", "PROPORTIONAL", "AMOUNT RANGE"]}
          value={formState.payinMode}
          onChange={(val) => handleChange("payinMode", val)}
          error={errors.payinMode}
        />
      )}

      {formState.payinMode === "PROPORTIONAL" &&
        !formState.enableUpiVendorGateway && (
          <>
            <NumberInput
              label={"Number of Proportions"}
              // min={0}
              // max={10}
              withAsterisk
              value={formState.numberOfRangesOrRatio}
              onChange={(num) => handleChange("numberOfRangesOrRatio", num)}
              error={errors.numberOfRangesOrRatio}
            />

            {formState.ratios?.map((ratio, index) => (
              <Fieldset legend={"Ratio " + (index + 1)} key={index}>
                <NumberInput
                  label={"Ratio"}
                  withAsterisk
                  value={ratio.ratio}
                  onChange={(v) => changeRatioValues(index, v, "ratio")}
                  error={errors.ratios[index]?.ratio}
                />
                <Select
                  label="Gateway"
                  withAsterisk
                  data={["member", "phonepe", "razorpay", "payu", "cashfree"]}
                  mt={"sm"}
                  value={ratio.gateway}
                  onChange={(v) => changeRatioValues(index, v, "gateway")}
                  error={errors.ratios[index]?.gateway}
                />
              </Fieldset>
            ))}
          </>
        )}

      {formState.payinMode === "AMOUNT RANGE" &&
        !formState.enableUpiVendorGateway && (
          <>
            <NumberInput
              label={"Number of ranges"}
              min={2}
              withAsterisk
              value={formState.numberOfRangesOrRatio}
              onChange={(num) => handleChange("numberOfRangesOrRatio", num)}
              error={errors.numberOfRangesOrRatio}
            />

            {formState.amountRanges?.map((range, index) => (
              <Fieldset legend={`Range ${index + 1}`} variant="filled">
                <Text>Range</Text>
                <Flex justify={"space-between"} align={"flex-end"} gap={"sm"}>
                  <NumberInput
                    // label={"Range"}
                    withAsterisk
                    placeholder="From"
                    size="xs"
                    readOnly
                    value={index === 0 ? 1 : range.lower}
                    leftSection={"₹"}
                    error={errors.amountRanges[index]?.lower}
                    h="40"
                  />
                  <div style={{ margin: "auto" }}>to</div>
                  <NumberInput
                    withAsterisk
                    placeholder="To"
                    size="xs"
                    value={
                      !range.upper &&
                      index === formState?.amountRanges.length - 1
                        ? Number.MAX_SAFE_INTEGER
                        : range.upper
                    }
                    readOnly={index === formState?.amountRanges.length - 1}
                    onChange={(v) => changeAmountValues(index, v, "upper")}
                    leftSection={"₹"}
                    error={errors.amountRanges[index]?.upper}
                    h="40"
                  />
                </Flex>

                <Select
                  label="Gateway"
                  withAsterisk
                  data={["member", "phonepe", "razorpay", "payu", "cashfree"]}
                  mt={"sm"}
                  value={range.gateway}
                  onChange={(v) => changeAmountValues(index, v, "gateway")}
                  error={errors.amountRanges[index]?.gateway}
                />
              </Fieldset>
            ))}
          </>
        )}

      {formState.payinMode === "DEFAULT" &&
      !formState.enableUpiVendorGateway ? (
        <div>
          <Text size="sm" fw={500} mb={0}>
            Payin channels & preferred gateway
          </Text>
          <Box
            p="sm"
            mt={0}
            style={{
              border: "1px solid #dee2e6",
              borderRadius: 8,
            }}
          >
            <Flex direction="column" gap="xs">
              {formState.payinChannels.map(({ channel, gateway }) => {
                const label =
                  channel === "UPI"
                    ? "UPI"
                    : channel === "NET_BANKING"
                    ? "Net Banking"
                    : channel === "E_WALLET"
                    ? "E-Wallet"
                    : channel;

                return (
                  <Flex key={channel} align="center" gap="sm">
                    <Text w={100} size="sm">
                      {label}
                    </Text>

                    <Select
                      placeholder="Select gateway"
                      withAsterisk
                      data={["phonepe", "razorpay", "payu", "cashfree"]}
                      value={gateway || ""}
                      onChange={(v) => {
                        const updated = formState.payinChannels.map((ch) =>
                          ch.channel === channel ? { ...ch, gateway: v! } : ch
                        );
                        handleChange("payinChannels", updated);
                      }}
                      flex={1}
                    />

                    <CloseButton
                      onClick={() => {
                        const filtered = formState.payinChannels.filter(
                          (ch) => ch.channel !== channel
                        );
                        handleChange("payinChannels", filtered);
                      }}
                      disabled={formState.payinChannels.length === 1}
                      size="sm"
                    />
                  </Flex>
                );
              })}

              {formState.payinChannels.length < 3 && (
                <Button
                  style={{
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    const allChannels: PayinChannelKey[] = [
                      "UPI",
                      "NET_BANKING",
                      "E_WALLET",
                    ];
                    const existingChannels = formState.payinChannels.map(
                      (ch) => ch.channel
                    );

                    const channelToAdd = allChannels.find(
                      (ch) => !existingChannels.includes(ch)
                    );

                    if (!channelToAdd) return;

                    const updated = [
                      ...formState.payinChannels,
                      { channel: channelToAdd, gateway: "" },
                    ];

                    handleChange("payinChannels", updated);
                  }}
                >
                  Add
                </Button>
              )}
            </Flex>
          </Box>

          {formState.payinMode === "DEFAULT" &&
            typeof errors.payinChannels === "string" && (
              <Text c="red" fz={12} mt={0}>
                {errors.payinChannels}
              </Text>
            )}
        </div>
      ) : !formState.enableUpiVendorGateway ? (
        <MultiSelect
          label="Payin Channels"
          error={errors.payinChannels}
          withAsterisk
          placeholder="Pick one or more channels "
          data={channels?.map((ch) => ch.name)}
          value={
            Array.isArray(formState.payinChannels) &&
            typeof formState.payinChannels[0] === "object"
              ? formState.payinChannels.map((item) => item?.channel)
              : (formState.payinChannels as unknown as string[])
          }
          onChange={(selectedChannels) => {
            const updated = selectedChannels.map((channel) => {
              const existing = formState.payinChannels.find(
                (c) => c.channel === channel
              );
              return existing ?? { channel, gateway: "" };
            });

            handleChange("payinChannels", updated);
          }}
        />
      ) : null}

      <ServiceRate
        label="Select Payin Service Rate Mode"
        formState={formState.payinServiceRate}
        onValueChange={(value) => handleChange("payinServiceRate", value)}
        errorMessage={errors?.payinServiceRate}
      />

      <Switch
        label="Enable UPI Vendor Gateway"
        labelPosition="left"
        checked={formState.enableUpiVendorGateway || false}
        onChange={(e) =>
          handleChange("enableUpiVendorGateway", e.currentTarget.checked)
        }
      />

      {formState.enableUpiVendorGateway && (
        <NumberInput
          label="Threshold till which orders will be verified automatically"
          description="UTR vendor will not have to confirm"
          placeholder="Enter amount in Rs."
          value={formState.upiVendorAutoVerifyThreshold || undefined}
          onChange={(value) => handleChange("upiVendorAutoVerifyThreshold", value)}
          leftSection="₹"
          min={0}
          mb="md"
        />
      )}

      <Switch
        label="Enable Payins"
        labelPosition="left"
        checked={formState.enablePayins}
        onChange={(e) => handleChange("enablePayins", e.currentTarget.checked)}
      />

      {formState.payinMode === "DEFAULT" &&
        !formState.enableUpiVendorGateway && (
          <>
            <Switch
              label="Allow member channels for payins"
              labelPosition="left"
              checked={formState.allowMemberChannelsPayin}
              onChange={(e) =>
                formState.allowPgBackupForPayin &&
                handleChange(
                  "allowMemberChannelsPayin",
                  e.currentTarget.checked
                )
              }
            />
            <Switch
              label="Allow 3rd party gateway fallback for payins"
              labelPosition="left"
              checked={formState.allowPgBackupForPayin}
              onChange={(e) =>
                formState.allowMemberChannelsPayin &&
                handleChange("allowPgBackupForPayin", e.currentTarget.checked)
              }
            />
          </>
        )}
    </>
  );
};

export default PayinsTab;

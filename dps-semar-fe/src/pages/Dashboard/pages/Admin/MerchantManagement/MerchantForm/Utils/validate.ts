import {
  ErrorsTab3,
  RangeDto,
  RatioDto,
  Tab1KeyNames,
  Tab1State,
  Tab2KeyNames,
  Tab2State,
  Tab3KeyNames,
  Tab3State,
  ErrorsTab4,
  Tab4KeyNames,
  Tab4State,
  Tab5State,
  RangeError,
  ServiceRateError,
} from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRequiredFields = (
  data: any,
  requiredKeys: string[],
  setError: (key: string, value: string) => void
) => {
  let flag = false;
  for (const iterator of requiredKeys) {
    if (!data[iterator]) {
      setError(iterator, `Please fill this field.`);
      flag = true;
    }
  }
  return flag;
};

export const validateTab1 = (
  data: Tab1State,
  setError: (key: Tab1KeyNames, value: string) => void,
  isForEdit: boolean
) => {
  let isVerified = true;

  const requiredKeys: Tab1KeyNames[] = [
    "firstName",
    "lastName",
    "businessUrl",
    "gst",
    "businessName",
  ];

  const fieldsAreRequired = validateRequiredFields(
    data,
    requiredKeys,
    setError
  );

  if (
    data.contact &&
    (data.contact?.toString().length < 10 ||
      data.contact?.toString().length > 10)
  ) {
    setError("contact", "Invalid phone number.");
    isVerified = false;
  }

  if (data.agent.id) {
    if (data.agentPayinCommissionRate < 0) {
      setError(
        "agentPayinCommissionRate",
        "Agent payin commission rate is required!"
      );
      isVerified = false;
    }

    if (data.agentPayoutCommissionRate < 0) {
      setError(
        "agentPayoutCommissionRate",
        "Agent payout commission rate is required!"
      );
      isVerified = false;
    }
  }

  if (fieldsAreRequired) isVerified = false;

  return isVerified;
};

export const validateTab2 = (
  data: Tab2State,
  setError: (key: Tab2KeyNames, value: string | string[]) => void,
  isForEdit: boolean
) => {
  let isVerified = true;

  const requiredKeys: Tab2KeyNames[] = [];

  if ((isForEdit && data.updateLoginCredentials) || !isForEdit) {
    requiredKeys.push("email", "password", "confirmPassword");
  }

  if ((isForEdit && data.updateWithdrawalCredentials) || !isForEdit) {
    requiredKeys.push("withdrawalPassword", "confirmWithdrawalPassword");
  }

  const fieldsAreRequired = validateRequiredFields(
    data,
    requiredKeys,
    setError
  );
  if (fieldsAreRequired) isVerified = false;

  if (!isForEdit || data.updateLoginCredentials) {
    if (data.email && !emailRegex.test(data.email)) {
      setError("email", "Invalid email address");
      isVerified = false;
    }

    if (data.password && data.password.length < 8) {
      setError("password", "Password should be of atleast 8 characters");
      isVerified = false;
    }
  }

  if (data.confirmPassword !== data.password) {
    setError("confirmPassword", "Passwords dont match.");
    isVerified = false;
  }

  if (data.confirmWithdrawalPassword !== data.withdrawalPassword) {
    setError("confirmWithdrawalPassword", "Passwords dont match.");
    isVerified = false;
  }

  if (data.allowOnlyIp) {
    let ipErrors: string[] = [];
    for (const i in data.ips) {
      if (data.ips[i] === "") {
        ipErrors.push("Please fill this field");
        isVerified = false;
      } else ipErrors.push("");
    }

    setError("ips", ipErrors);
  }

  return isVerified;
};

export const validateTab3 = (
  data: Tab3State,
  setError: (
    key: keyof ErrorsTab3,
    value: string | string[] | RangeError[] | RatioDto[] | ServiceRateError
  ) => void,
  isForEdit: boolean
) => {
  
  let isVerified = true;

  // if (!data.payinChannels || data.payinChannels.length === 0) {
  //   setError("payinChannels", "At least one payin channel must be selected.");
  //   isVerified = false;
  // }
  if (!data.payinChannels || data.payinChannels.length === 0) {
    setError("payinChannels", "At least one payin channel must be selected.");
    isVerified = false;
  } else if (data.payinMode === "DEFAULT") {
    const hasMissingGateway = data.payinChannels.some(
      (channel) => !channel.gateway || channel.gateway.trim() === ""
    );

    if (hasMissingGateway) {
      setError(
        "payinChannels",
        "All selected channels must have a gateway."
      );
      isVerified = false;
    } else {
      setError("payinChannels", "");
    }
  } else {
    setError("payinChannels", "");
  }

  if (!data.payinServiceRate || !data.payinServiceRate.mode) {
    setError("payinServiceRate", {
      mode: "Kindly select one mode.",
      absoluteAmount: "",
      percentageAmount: "",
    });
    isVerified = false;
  } else if (
    data.payinServiceRate.mode === "PERCENTAGE" &&
    (!data.payinServiceRate.percentageAmount ||
      data.payinServiceRate.percentageAmount <= 0)
  ) {
    setError("payinServiceRate", {
      mode: "",
      absoluteAmount: "",
      percentageAmount: "Valid percentage is required.",
    });
    isVerified = false;
  } else if (
    data.payinServiceRate.mode === "ABSOLUTE" &&
    (!data.payinServiceRate.absoluteAmount ||
      data.payinServiceRate.absoluteAmount <= 0)
  ) {
    setError("payinServiceRate", {
      mode: "",
      percentageAmount: "",
      absoluteAmount: "Valid  amount is required.",
    });
    isVerified = false;
  } else if (data.payinServiceRate.mode === "COMBINATION") {
    if (
      !data.payinServiceRate.absoluteAmount ||
      data.payinServiceRate.absoluteAmount <= 0
    ) {
      setError("payinServiceRate", {
        mode: "",
        absoluteAmount: "Valid  amount is required.",
        percentageAmount: "",
      });
      isVerified = false;
    }
    if (
      !data.payinServiceRate.percentageAmount ||
      data.payinServiceRate.percentageAmount <= 0
    ) {
      setError("payinServiceRate", {
        mode: "",
        absoluteAmount: "",
        percentageAmount: "Valid percentage is required.",
      });
      isVerified = false;
    }

    if (
      (!data.payinServiceRate.absoluteAmount ||
        data.payinServiceRate.absoluteAmount <= 0) &&
      (!data.payinServiceRate.percentageAmount ||
        data.payinServiceRate.percentageAmount <= 0)
    ) {
      setError("payinServiceRate", {
        mode: "",
        absoluteAmount: "Valid  amount is required.",
        percentageAmount: "Valid percentage is required.",
      });
    }
  }

  if (!data.payinMode) {
    setError("payinMode", "Kindly select one option.");
    isVerified = false;
  }
  if (data.payinMode === "AMOUNT RANGE") {
    if (!data.numberOfRangesOrRatio || data.numberOfRangesOrRatio <= 0) {
      setError(
        "numberOfRangesOrRatio",
        "Number of ranges is required and must be greater than 0."
      );
      isVerified = false;
    } else {
      if (!data.amountRanges || data.amountRanges.length === 0) {
        setError("amountRanges", [
          {
            lower: "Please define a range.",
            upper: "Please define a range.",
            gateway: "Please select a gateway.",
          },
        ]);
        isVerified = false;
      } else {
        const amountRangeErrors = data.amountRanges.map((range, index) => {
          const lowerValue = range.lower;
          const upperValue = range.upper;

          let error: RangeError = { lower: "", upper: "", gateway: "" };

          if (!lowerValue) {
            error.lower = "Invalid Value";
          }

          if (!upperValue) {
            error.upper = "Invalid Value";
          }

          if (upperValue <= 0) {
            error.upper = "Invalid value";
          }

          if (lowerValue >= upperValue) {
            error.upper = "Upper value must be greater than lower value";
          }

          if (!range.gateway) {
            error.gateway = "Gateway must be selected";
          }

          return error;
        });
        if (
          amountRangeErrors.some(
            (error) => error.lower || error.upper || error.gateway
          )
        ) {
          setError("amountRanges", amountRangeErrors);
          isVerified = false;
        }
      }
    }
  }

  if (data.payinMode === "PROPORTIONAL") {
    if (
      data.numberOfRangesOrRatio === undefined ||
      data.numberOfRangesOrRatio <= 0 ||
      data.numberOfRangesOrRatio > 10
    ) {
      setError(
        "numberOfRangesOrRatio",
        "Number of proportions is required and must be between 1 to 10 ."
      );
      isVerified = false;
    } else {
      if (data.numberOfRangesOrRatio > 0) {
        if (!data.ratios || data.ratios.length === 0) {
          setError("ratios", [
            { ratio: "Ratio is required", gateway: "Gateway is required" },
          ]);
          isVerified = false;
        } else {
          const ratioErrors: RatioDto[] = data.ratios.map((ratio, index) => {
            const ratioValue =
              typeof ratio.ratio === "string"
                ? parseFloat(ratio.ratio)
                : ratio.ratio;

            let error: RatioDto = { ratio: "", gateway: "" };

            if (isNaN(ratioValue) || ratioValue <= 0) {
              error.ratio = "Ratio must be a positive value";
            }

            if (!ratio.gateway) {
              error.gateway = "Gateway must be selected";
            }

            return error;
          });

          if (ratioErrors.some((error) => error.ratio || error.gateway)) {
            setError("ratios", ratioErrors);
            isVerified = false;
          } else {
            const totalRatios = data.ratios.reduce((sum, r) => {
              const ratioValue =
                typeof r.ratio === "string" ? parseFloat(r.ratio) : r.ratio;
              return sum + (isNaN(ratioValue) ? 0 : ratioValue);
            }, 0);

            if (totalRatios !== data.numberOfRangesOrRatio) {
              setError(
                "numberOfRangesOrRatio",
                `Sum of ratios is ${totalRatios} but must be equal to the number of proportions i.e. ${data.numberOfRangesOrRatio}.`
              );
              isVerified = false;
            }
          }
        }
      }
    }
  }

  return isVerified;
};

export const validateTab4 = (
  data: Tab4State,
  setError: (key: Tab4KeyNames, value: string | ServiceRateError) => void
) => {
  let isVerified = true;

  if (!data.payoutServiceRate || !data.payoutServiceRate.mode) {
    setError("payoutServiceRate", {
      mode: "Kindly select one mode.",
      absoluteAmount: "",
      percentageAmount: "",
    });
    isVerified = false;
  } else if (
    data.payoutServiceRate.mode === "PERCENTAGE" &&
    (!data.payoutServiceRate.percentageAmount ||
      data.payoutServiceRate.percentageAmount <= 0)
  ) {
    setError("payoutServiceRate", {
      mode: "",
      absoluteAmount: "",
      percentageAmount: "Valid percentage is required.",
    });
    isVerified = false;
  } else if (
    data.payoutServiceRate.mode === "ABSOLUTE" &&
    (!data.payoutServiceRate.absoluteAmount ||
      data.payoutServiceRate.absoluteAmount <= 0)
  ) {
    setError("payoutServiceRate", {
      mode: " ",
      absoluteAmount: "Valid amount is required.",
      percentageAmount: "",
    });
    isVerified = false;
  } else if (data.payoutServiceRate.mode === "COMBINATION") {
    if (
      !data.payoutServiceRate.absoluteAmount ||
      data.payoutServiceRate.absoluteAmount <= 0
    ) {
      setError("payoutServiceRate", {
        mode: " ",
        absoluteAmount: "Valid amount is required.",
        percentageAmount: "",
      });
      isVerified = false;
    }
    if (
      !data.payoutServiceRate.percentageAmount ||
      data.payoutServiceRate.percentageAmount <= 0
    ) {
      setError("payoutServiceRate", {
        mode: " ",
        absoluteAmount: "",
        percentageAmount: "Valid percentage is required.",
      });
      isVerified = false;
    }

    if (
      (!data.payoutServiceRate.percentageAmount ||
        data.payoutServiceRate.percentageAmount <= 0) &&
      (!data.payoutServiceRate.absoluteAmount ||
        data.payoutServiceRate.absoluteAmount <= 0)
    ) {
      setError("payoutServiceRate", {
        mode: " ",
        absoluteAmount: "Valid absolute  is required.",
        percentageAmount: "Valid percentage  is required.",
      });
    }
  }

  if (!data.payoutChannels || data.payoutChannels.length === 0) {
    setError("payoutChannels", "At least one payout channel must be selected.");
    isVerified = false;
  }

  if (typeof data.minPayout !== "number" || isNaN(data.minPayout)) {
    setError(
      "minPayout",
      "Minimum payout amount must be a valid number and cannot be empty."
    );
    isVerified = false;
  } else if (data.minPayout < 0) {
    setError("minPayout", "Minimum payout amount cannot be negative.");
    isVerified = false;
  }

  if (!data.maxPayout) {
    setError("maxPayout", "Maximum payout amount is required.");
    isVerified = false;
  } else if (data.maxPayout <= data.minPayout) {
    setError(
      "maxPayout",
      "Maximum payout amount must be greater than minimum payout amount."
    );
    isVerified = false;
  }

  return isVerified;
};

export const validateTab5 = (
  data: Tab5State,
  setError: (key: keyof Tab5State, value: string) => void
): boolean => {
  let isVerified = true;

  if (typeof data.minWithdrawal !== "number" || isNaN(data.minWithdrawal)) {
    setError("withdrawalServiceRate", "Withdrawal Service Rate is required.");
    isVerified = false;
  } else if (data.withdrawalServiceRate < 0) {
    setError(
      "withdrawalServiceRate",
      "Withdrawal Service Rate must be greater than 0."
    );
    isVerified = false;
  }

  if (typeof data.minWithdrawal !== "number" || isNaN(data.minWithdrawal)) {
    setError("minWithdrawal", "Minimum withdrawal amount is required.");
    isVerified = false;
  } else if (data.minWithdrawal < 0) {
    setError("minWithdrawal", "Minimum withdrawal amount cannot be negative.");
    isVerified = false;
  }

  if (!data.maxWithdrawal) {
    setError("maxWithdrawal", "Maximum withdrawal amount is required.");
    isVerified = false;
  } else if (data.maxWithdrawal <= data.minWithdrawal) {
    setError(
      "maxWithdrawal",
      "Maximum withdrawal amount must be greater than minimum withdrawal amount."
    );
    isVerified = false;
  }

  return isVerified;
};

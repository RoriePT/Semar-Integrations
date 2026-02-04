export const getReferralStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "yellow";

    case "approved":
      return "green";

    case "rejected":
      return "red";

    case "applied":
      return "brand";
  }
};

export const getFullName = (data) => {
  if (data) return data?.firstName + " " + data?.lastName;

  return "None";
};

export const getPaymentDetails = (channelProfile) => {
  let memberPaymentDetails = {};

  // Check if UPI exists
  if (channelProfile.upi && channelProfile.upi[0]) {
    memberPaymentDetails = {
      "UPI ID": channelProfile.upi[0].upiId,
      "Mobile Number": channelProfile.upi[0].mobile,
    };
  }
  // Check if Net Banking exists
  else if (channelProfile.netBanking && channelProfile.netBanking[0]) {
    memberPaymentDetails = {
      "Bank Name": channelProfile.netBanking[0].bankName,
      "Account Number": channelProfile.netBanking[0].accountNumber,
      "IFSC Code": channelProfile.netBanking[0].ifsc,
      "Beneficiary Name": channelProfile.netBanking[0].beneficiaryName,
    };
  }
  // Check if eWallet exists
  else if (channelProfile.eWallet && channelProfile.eWallet[0]) {
    memberPaymentDetails = {
      "Mobile Number": channelProfile.eWallet[0].mobile,
      "App Name": channelProfile.eWallet[0].app,
    };
  }
  // If no payment method exists
  else {
    return "No payment method found";
  }

  return memberPaymentDetails;
};

export const getUpiData = (upiDetails) => {
  return {
    "Upi Id": upiDetails.upiId,
    "Mobile Number": upiDetails.mobileNumber,
  };
};
export const getEwalletData = (eWalletDetails) => {
  return {
    "App Name": eWalletDetails.appName,
    "Mobile Number": eWalletDetails.mobileNumber,
  };
};
export const getNetBankingData = (netBankingDetails) => {
  return {
    "Account Number": netBankingDetails.accountNumber,
    "Bank Name": netBankingDetails.bankName,
    "IFSC Code": netBankingDetails.ifscCode,
    "Beneficiary Name": netBankingDetails.beneficiaryName,
  };
};

export const convertBalanceTypeText = (text: string) => {
  return text
    .split("_")
    .map((word, index) => {
      return index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const extractUserType = (text: string) => {
  return text.split("_")[0].toLowerCase();
};

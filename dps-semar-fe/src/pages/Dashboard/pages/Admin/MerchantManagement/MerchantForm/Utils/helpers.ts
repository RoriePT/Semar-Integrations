import {
  MerchantRequestDto,
  MerchantResponseDto,
  PayinChannelKey,
  Tab1State,
  Tab2State,
  Tab3State,
  Tab4State,
  Tab5State,
} from "./types";

export const mapEditDataToStateTab1 = (
  data: MerchantResponseDto
): Tab1State => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    contact: data.phone,
    businessUrl: data.businessUrl,
    gst: data.gst,
    businessName: data.businessName,
    agent: data.agent,
    enabled: data.enabled,
    agentPayinCommissionRate: data.agentPayinCommissionRate,
    agentPayoutCommissionRate: data.agentPayoutCommissionRate,
  };
};

export const mapEditDataToStateTab2 = (
  data: MerchantResponseDto
): Tab2State => {
  return {
    email: data.email,
    confirmPassword: "",
    password: "",
    allowOnlyIp: data.ips.length > 0,
    ips: data.ips,
    updateLoginCredentials: false,
    updateWithdrawalCredentials: false,
    confirmWithdrawalPassword: "",
    withdrawalPassword: "",
    merchantApiKey: data.apiKey ?? "",
    merchantIntegrationId: data.integrationId ?? "",
  };
};
const allowed: PayinChannelKey[] = ["UPI"];

export const mapEditDataToStateTab3 = (
  data: MerchantResponseDto
): Tab3State => {
  const isEditMode =
    Array.isArray(data.payinChannels) && data.payinChannels.length > 0;

  const payinChannels = isEditMode
    ? Array.isArray(data.payinChannels) &&
      typeof data.payinChannels[0] === "object"
      ? data.payinChannels.map((item) => ({
          channel: item.channel,
          gateway: item.gateway,
        }))
      : data.payinChannels
    : allowed.map((channel) => ({
        channel,
        gateway: "",
      }));

  return {
    payinChannels,
    allowMemberChannelsPayin: data.allowMemberChannelsPayin,
    allowPgBackupForPayin: data.allowPgBackupForPayin,
    payinServiceRate: data.payinServiceRate,
    payinMode: data.payinMode,
    amountRanges: data.amountRangeRange,
    ratios: data.propotionRatio,
    numberOfRangesOrRatio:
      data.payinMode === "AMOUNT RANGE"
        ? data.amountRangeRange?.length
        : data?.propotionRatio?.length,
    enablePayins: data.enablePayins,
    enableUpiVendorGateway: (data as any).enableUpiVendorGateway || false,
    upiVendorAutoVerifyThreshold: (data as any).upiVendorAutoVerifyThreshold || undefined,
  };
};

export const mapEditDataToStateTab4 = (
  data: MerchantResponseDto
): Tab4State => {
  return {
    payoutChannels: data.payoutChannels.map((item) => item),
    allowMemberChannelsPayout: data.allowMemberChannelsPayout,
    allowPgBackupForPayout: data.allowPgBackupForPayout,
    payoutServiceRate: data.payoutServiceRate,
    minPayout: data.minPayout,
    maxPayout: data.maxPayout,
    enablePayouts: data.enablePayouts,
  };
};

export const mapEditDataToStateTab5 = (
  data: MerchantResponseDto
): Tab5State => {
  return {
    withdrawalServiceRate: data.withdrawalServiceRate,
    minWithdrawal: data.minWithdrawal,
    maxWithdrawal: data.maxWithdrawal,
    // channelProfile: data.channelProfile || [],
    channelProfile: {
      upi: data.channelProfile.upi || [],
      netBanking: data.channelProfile.netBanking || [],
      eWallet: data.channelProfile.eWallet || [],
    },
  };
};

export const getChannelIdFromName = (name: string, channels: any[]) => {
  return channels.find((ch) => ch.name === name)?.id || 0;
};

export const getChannelNameFromId = (id: number, channels: any[]) => {
  return channels.find((ch) => ch.id === id)?.name || 0;
};

export const formatChannelsForPayload = (channels) => {
  return channels.map((item) => ({
    channelId: item.channel.id,
    profileFields: item.fields.map((field) => ({
      fieldId: field.fieldId,
      value: field.value,
    })),
  }));
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  tab3State: Tab3State,
  tab4State: Tab4State,
  tab5State: Tab5State,
  isForUpdate: boolean
): MerchantRequestDto => {
  return {
    // Profile Info
    firstName: tab1State.firstName,
    lastName: tab1State.lastName,
    phone: tab1State.contact,
    businessName: tab1State.businessName,
    businessUrl: tab1State.businessUrl,
    agentId: tab1State?.agent?.id || null,
    agentPayinCommissionRate: tab1State?.agentPayinCommissionRate || null,
    agentPayoutCommissionRate: tab1State?.agentPayoutCommissionRate || null,
    enabled: tab1State.enabled,
    gst: tab1State.gst,

    // Credentials Tab
    email: tab2State.email,
    password:
      !isForUpdate || tab2State.updateLoginCredentials
        ? tab2State.password
        : undefined,
    withdrawalPassword:
      !isForUpdate || tab2State.updateWithdrawalCredentials
        ? tab2State.withdrawalPassword
        : undefined,
    ipAddresses: tab2State.allowOnlyIp ? tab2State.ips : [],
    updateLoginCredentials: isForUpdate
      ? tab2State.updateLoginCredentials
      : undefined,
    updateWithdrawalCredentials: isForUpdate
      ? tab2State.updateWithdrawalCredentials
      : undefined,
    apiKey: tab2State.merchantApiKey,
    integrationId: tab2State.merchantIntegrationId,

    // Payins
    payinChannels: JSON.stringify(tab3State.payinChannels),
    payinServiceRate: tab3State.payinServiceRate,
    payinMode: tab3State.payinMode,
    allowMemberChannelsPayin: tab3State.enableUpiVendorGateway
      ? false
      : tab3State.allowMemberChannelsPayin,
    allowPgBackupForPayin: tab3State.enableUpiVendorGateway
      ? false
      : tab3State.allowPgBackupForPayin,
    numberOfRangesOrRatio: tab3State.numberOfRangesOrRatio,
    amountRanges: tab3State.amountRanges,
    ratios: tab3State.ratios,
    enablePayins: tab3State.enablePayins,
    enableUpiVendorGateway: tab3State.enableUpiVendorGateway || false,
    upiVendorAutoVerifyThreshold: tab3State.enableUpiVendorGateway 
      ? tab3State.upiVendorAutoVerifyThreshold 
      : undefined,

    // Payouts
    payoutChannels: JSON.stringify(tab4State.payoutChannels),
    allowMemberChannelsPayout: tab4State.allowMemberChannelsPayout,
    allowPgBackupForPayout: tab4State.allowPgBackupForPayout,
    payoutServiceRate: tab4State.payoutServiceRate,
    minPayout: tab4State.minPayout,
    maxPayout: tab4State.maxPayout,
    enablePayouts: tab4State.enablePayouts,

    // Withdrawals
    // channelProfile: tab5State.channelProfile,
    channelProfile: {
      upi: tab5State.channelProfile.upi || [],
      netBanking: tab5State.channelProfile.netBanking || [],
      eWallet: tab5State.channelProfile.eWallet || [],
    },
    withdrawalServiceRate: tab5State.withdrawalServiceRate,
    minWithdrawal: tab5State.minWithdrawal,
    maxWithdrawal: tab5State.maxWithdrawal,
  };
};

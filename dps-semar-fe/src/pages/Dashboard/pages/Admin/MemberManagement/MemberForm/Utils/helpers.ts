import { Channel } from "../../../../../../../types/channel";
import {
  MemberRequestDto,
  MemberResponseDto,
  Tab1State,
  Tab2State,
  Tab3State,
} from "./types";

export const mapEditDataToStateTab1 = (data: MemberResponseDto): Tab1State => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    contact: data.phone,
    email: data.email,
    password: "",
    confirmPassword: "",
    enabled: data.enabled,
    referralCode: data.referralCode,
    telegramId: data.telegramId || "",
    updateLogin: false,
  };
};

export const mapEditDataToStateTab2 = (data: MemberResponseDto): Tab2State => {
  return {
    // payinCommission: data.payinCommissionRate,
    // payoutCommission: data.payoutCommissionRate,
    // topupCommission: data.topupCommissionRate,
    minPayout: data.singlePayoutLowerLimit,
    maxPayout: data.singlePayoutUpperLimit,
    dailyPayoutLimit: data.dailyTotalPayoutLimit,
  };
};

export const mapEditDataToStateTab3 = (data: MemberResponseDto): Tab3State => {
  // return { channelProfile: data.channelProfile };
  // return {
  //   channelProfile: data.channelProfile.map((item) => {
  //     let temp = {
  //       // channel: item.channel,
  //       type:item.type,
  //       fields: item.data,
  //     };
  //     return temp;
  //   }),
  // };
  return {
    channelProfile: {
      upi: data.channelProfile.upi || [],
      netBanking: data.channelProfile.netBanking || [],
      eWallet: data.channelProfile.eWallet || [],
    },
  };
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  tab3State: Tab3State,
  isForUpdate: boolean
): MemberRequestDto => {
  return {
    email: tab1State.email,
    password: tab1State.password,
    firstName: tab1State.firstName,
    lastName: tab1State.lastName,
    enabled: tab1State.enabled,
    dailyTotalPayoutLimit: tab2State.dailyPayoutLimit,
    // payinCommissionRate: tab2State.payinCommission,
    // payoutCommissionRate: tab2State.payoutCommission,
    singlePayoutLowerLimit: tab2State.minPayout,
    singlePayoutUpperLimit: tab2State.maxPayout,
    // topupCommissionRate: tab2State.topupCommission,
    phone: tab1State.contact,
    referralCode: tab1State.referralCode,
    telegramId: tab1State.telegramId,
    // channelProfile: tab3State.channelProfile.map((item) => {
    //   let temp: ChannelProfileRequest = {
    //     channelId: item.channel.id,
    //     profileFields: item.fields.map((item) => ({
    //       fieldId: item.fieldId,
    //       value: item.value,
    //     })),
    //   };

    //   return temp;
    // }),
    //  channelProfile: tab3State.channelProfile,
    channelProfile: {
      upi: tab3State.channelProfile.upi || [],
      netBanking: tab3State.channelProfile.netBanking || [],
      eWallet: tab3State.channelProfile.eWallet || [],
    },

    updateLoginCredentials: isForUpdate ? tab1State.updateLogin : true,
  };
};

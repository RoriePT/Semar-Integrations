import {
  GatewayRequestDtoType,
  GatewayResponseType,
  FieldType,
  ChannelFieldRequest,
  Tab1State,
  Tab2State,
  Tab3State,
  Key,
} from "./types";

export const mapEditDataToStateTab1 = (
  data: GatewayResponseType
): Tab1State => {
  return {
    GatewayName: data.name,
    GatewayLogo: data.logo,
    // channelTag: data.tag,
    enabledForPayins: data.incomingStatus,
    enabledForPayouts: data.outgoingStatus,
  };
};

export const mapEditDataToStateTab2 = (
  data: GatewayResponseType
): Tab2State => {
  return {
    fields: data.gatewayToChannel.map((field) => {
      const temp: FieldType = {
        id: field.id,
        payinsEnabled: field.payinsEnabled,
        lowerLimitForPayins: field.lowerLimitForPayins,
        upperLimitForPayins: field.upperLimitForPayins,
        payinFees: field.payinFees,
        payoutsEnabled: field.payoutsEnabled,
        lowerLimitForPayouts: field.lowerLimitForPayouts,
        upperLimitForPayouts: field.upperLimitForPayouts,
        payoutFees: field.payoutFees,
      };

      return temp;
    }),
  };
};

export const mapEditDataToStateTab3 = (
  data: GatewayResponseType
): Tab3State => {
  return {
    uatMerchantKeys: data.uatMerchantKeys.map((key) => {
      const temp: Key = {
        label: key.label,
        value: key.value,
      };
      return temp;
    }),
    prodMerchantKeys: data.prodMerchantKeys.map((key) => {
      const temp: Key = {
        label: key.label,
        value: key.value,
      };
      return temp;
    }),
  };
};

export const getPayload = (
  tab1State: Tab1State,
  tab2State: Tab2State,
  tab3State: Tab3State,
  isForUpdate: boolean
): GatewayRequestDtoType => {
  return {
    name: tab1State.GatewayName,
    logo: tab1State.GatewayLogo,
    incomingStatus: tab1State.enabledForPayins,
    outgoingStatus: tab1State.enabledForPayouts,
    channels: tab2State.fields.map((item) => {
      const temp: ChannelFieldRequest = {
        id: item.id,
        payinsEnabled: item.payinsEnabled,
        lowerLimitForPayins: item.lowerLimitForPayins,
        upperLimitForPayins: item.upperLimitForPayins,
        payinFees: item.payinFees,
        payoutsEnabled: item.payoutsEnabled,
        lowerLimitForPayouts: item.lowerLimitForPayouts,
        upperLimitForPayouts: item.upperLimitForPayouts,
        payoutFees: item.payoutFees,
      };
      return temp;
    }),
    uatMerchantKeys: tab3State.uatMerchantKeys.map((key) => ({
      label: key.label,
      value: key.value,
    })),
    prodMerchantKeys: tab3State.prodMerchantKeys.map((key) => ({
      label: key.label,
      value: key.value,
    })),
  };
};

import moment from "moment";
import { handleAPICatchBlock, axiosInstance as AxiosInstance } from "./utils";
import axios from "axios";
import { getAuthToken } from "../utils/auth";

const axiosInstance = AxiosInstance();

export const paginate = async (
  tableName: string,
  {
    pageSize,
    pageNumber,
    search,
    startDate,
    endDate,
    userId,
    sortBy = "latest",
    forBulletin = false,
    status,
    userEmail,

    sortByBalanceType = null,
    filterStatusArray = null,
    filterChannelArray = null,
    filterMadeVia = null,
    filterAmountLower = null,
    filterAmountUpper = null,
    filterGatewayArray = [],
    filterMemberSearch = "",
    filterMerchantSearch = "",
  },
  queryParam = "",
  skipPaginateAppend = false
): Promise<any> => {
  try {
    const endpoint = skipPaginateAppend 
      ? `/${tableName}?${queryParam}`
      : `/${tableName}/paginate?${queryParam}`;
    const response = await axiosInstance.post(
      endpoint,
      {
        pageSize,
        pageNumber,
        search,
        startDate,
        endDate,
        userId,
        sortBy,
        forBulletin,
        status,
        userEmail,
        filterStatusArray,
        filterChannelArray,
        filterMadeVia,
        filterAmountLower,
        filterAmountUpper,
        balanceType: sortByBalanceType,
        filterMemberSearch,
        filterGatewayArray,
        filterMerchantSearch,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getUser = async (tableName: string, id = null): Promise<any> => {
  let url = `/${tableName}/${id}`;
  if (!id) url = `/${tableName}`;

  try {
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const deleteUser = async (
  tableName: string,
  id: number
): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/${tableName}/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const exportRecords = async (
  startDate: Date,
  endDate: Date,
  tableName: string
): Promise<any> => {
  try {
    const formattedStartDateString = startDate;
    const formattedEndDateString = endDate;

    const response = await axiosInstance.post(
      "/export",
      {
        startDate: formattedStartDateString,
        endDate: formattedEndDateString,
        tableName,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getAllUser = async (tableName: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/${tableName}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

const changePassword = async (
  tableName: string,
  body?: any,
  withdrawal?: boolean
) => {
  try {
    const response = await axiosInstance.post(
      `/${tableName}/${
        withdrawal ? "change-withdrawal-password" : "change-password"
      }`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: true });
    console.log(error);
  }
};

export const getMemberReferralsTree = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/member-referral/tree`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getAgentReferralsTree = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/agent-referral/tree`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

export const getReferralCodesList = async (teamId?: string) => {
  if (!teamId) return;
  try {
    const referralCodeList = await axiosInstance.get(
      `member-referral/team-referral-codes/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return referralCodeList.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getReferralCodeData: any = async (
  tableName: string,
  code?: string
) => {
  if (!code) return;
  try {
    const referralData = await axiosInstance.get(
      `${tableName}/referral/${code}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return referralData;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (file: any, id): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      `upload/receipt/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error uploading file:", error);
  }
};

export const getCurrentBalance = async () => {
  try {
    const response = await axiosInstance.put(
      `/identity/current-balance`,
      null,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error uploading file:", error);
  }
};

export const updateQuotaDetails = async (
  sendingMemberId,
  receivingMemberEmail
) => {
  if (!sendingMemberId || !receivingMemberEmail) return;

  try {
    const response = await axios.put(
      `/identity/user-details/current-quota/${sendingMemberId}`,
      { receivingMemberEmail },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error updating quota details:", error);
  }
};

export const updateCurrentBalance = async (id: number, userType: string) => {
  if (!id || !userType) return;
  try {
    const response = await axios.put(
      `/identity/user-details/current-balance/${id}`,
      { userType },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error updating current balance:", error);
  }
};

const toggleBlacklistStatus = async (id: string) => {
  try {
    const response = await axios.put(
      `end-user/toggle-blacklisted/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error toggling blacklist status:", error);
  }
};

const adjustBalance = async ({
  userId,
  amount,
  description,
  operation,
  balanceType,
}) => {
  try {
    const response = await axios.post(
      `/fund-record/admin-adjustment`,
      {
        userId,
        amount,
        description,
        operation,
        balanceType,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error adjusting fund record:", error);
  }
};

const adjustMemberBalance = async ({
  sendingMemberId,
  receivingMemberEmail,
  amount,
}) => {
  try {
    const response = await axios.post(
      `/fund-record/member-adjustment`,
      {
        sendingMemberId,
        receivingMemberEmail,
        amount,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error("Error adjusting fund record:", error);
  }
};

export const merchantList = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`payin/merchant-list`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const memberList = async ({ channel, amount }): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `payin/member-list`,
      { channel, amount },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error(error);
  }
};

export const agentList = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`agent/list`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error(error);
  }
};

export const merchantUserId = async ({ id }: { id: number }): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `payin/enduser-suggestions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.error(error);
  }
};

export const EndUserDetails = async ({ id }: { id: number }): Promise<any> => {
  try {
    const response = await axiosInstance.get(`end-user/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error, raiseError: false });
    console.error(error);
  }
};

export const updateAgentCommissionRates = async (formData, agentId) => {
  const payload = {
    agentPayinCommissionRate: formData.agentPayinCommissionRate,
    agentPayoutCommissionRate: formData.agentPayoutCommissionRate,
    agentId,
  };

  try {
    await axios.put("agent/update-commission-rates", payload, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
  } catch (error) {
    console.log("Failed to update agent commission rates.");
  }
};

export const updateMemberCommissionRates = async (
  formData,
  memberId,
  teamId
) => {
  const payload = {
    agentPayinCommissionRate: formData?.payin,
    agentPayoutCommissionRate: formData?.payout,
    agentTopupCommissionRate: formData?.topup,
    memberId,
    teamId,
  };

  try {
    const res = await axios.put("member/update-commission-rates", payload, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return res;
  } catch (error) {
    console.log("Failed to update member commission rates.");
  }
};

export const getTeamTree = async (id) => {
  try {
    const response = await axiosInstance.get(`team/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getOrganizationTree = async (id) => {
  try {
    const response = await axiosInstance.get(`organization/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getChannelList = async (orderType, merchantId = null) => {
  if (!orderType) return;

  try {
    const response = await axiosInstance.post(
      `channel/channel-list`,
      {
        orderType,
        merchantId: merchantId || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const updateTeamCommissionRates = async (teamId, payload) => {
  if (!teamId) return;

  try {
    const res = await axiosInstance.patch(
      `team/update-commission-rates/${teamId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

const CommonAPIs = {
  paginate,
  getUser,
  deleteUser,
  exportRecords,
  getAllUser,
  changePassword,
  getMemberReferralsTree,
  getAgentReferralsTree,
  getReferralCodeData,
  uploadFile,
  getCurrentBalance,
  updateQuotaDetails,
  updateCurrentBalance,
  adjustBalance,
  adjustMemberBalance,
  toggleBlacklistStatus,
  merchantList,
  memberList,
  merchantUserId,
  EndUserDetails,
  updateMemberCommissionRates,
  updateAgentCommissionRates,
  getOrganizationTree,
  getTeamTree,
  agentList,
  getChannelList,
  updateTeamCommissionRates,
  getReferralCodesList,
};

export default CommonAPIs;

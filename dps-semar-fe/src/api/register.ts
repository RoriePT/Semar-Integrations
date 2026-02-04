import { AdminRequestDto } from "../pages/Dashboard/pages/Admin/AdminManagement/AdminForm/Utils/types";
import { AgentRequestDto } from "../pages/Dashboard/pages/Admin/AgentManagement/AgentForm/Utils/types";
import { ChannelRequestDtoType } from "../pages/Dashboard/pages/Admin/Channels/ChannelForm/Utils/types";
import { GatewayRequestDtoType } from "../pages/Dashboard/pages/Admin/Gateways/GatewayForm/Utils/types";
import { MemberRequestDto } from "../pages/Dashboard/pages/Admin/MemberManagement/MemberForm/Utils/types";
import { MerchantRequestDto } from "../pages/Dashboard/pages/Admin/MerchantManagement/MerchantForm/Utils/types";
import { SubMerchantRequestDto } from "../pages/Dashboard/pages/Merchant/SubAccounts/SubAccountForm/Utils/types";
import { getAuthToken } from "../utils/auth";
import {
  getAPIErrorMessage,
  axiosInstance as AxiosInstance,
  handleAPICatchBlock,
} from "./utils";

const axiosInstance = AxiosInstance();

const registerAdmin = async (body: AdminRequestDto) => {
  try {
    const response = await axiosInstance.post("/admin", body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateAdmin = async (body: AdminRequestDto, id: number) => {
  try {
    const response = await axiosInstance.patch(`/admin/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerAgent = async (body: AgentRequestDto) => {
  try {
    const response = await axiosInstance.post("/agent", body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateAgent = async (body: AgentRequestDto, id: number) => {
  try {
    const response = await axiosInstance.patch(`/agent/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }

  return;
};

const registerChannel = async (body: ChannelRequestDtoType) => {
  try {
    const data = new FormData();
    data.append("file", body.logo); // Append file to FormData

    delete body.logo;

    const jsonPayload = { ...body, file: data.get("file") };

    const response = await axiosInstance.post("/channel", jsonPayload, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateGateway = async (body: GatewayRequestDtoType, id: number) => {
  try {
    const response = await axiosInstance.patch(`/gateway/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerGateway = async (body: GatewayRequestDtoType) => {
  try {
    const response = await axiosInstance.post("/gateway", body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateChannel = async (body: ChannelRequestDtoType, id: number) => {
  try {
    const response = await axiosInstance.patch(`/channel/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerMerchant = async (body: MerchantRequestDto) => {
  try {
    const response = await axiosInstance.post(`/merchant`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateMerchant = async (body: MerchantRequestDto, id: number) => {
  try {
    const response = await axiosInstance.patch(`/merchant/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerSubMerchant = async (
  body: SubMerchantRequestDto,
  merchantId: number
) => {
  try {
    const response = await axiosInstance.post(
      `/sub-merchant/${merchantId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateSubMerchant = async (body: SubMerchantRequestDto, id: number) => {
  try {
    const response = await axiosInstance.patch(`/sub-merchant/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerMember = async (body: MemberRequestDto) => {
  try {
    const response = await axiosInstance.post(`/member`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateMember = async (body: MemberRequestDto, id = null) => {
  let url = `/member/${id}`;
  if (!id) url = `/member`;

  try {
    const response = await axiosInstance.patch(url, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateAgentChannels = async (body: AgentRequestDto) => {
  let url = `agent/channels`;

  try {
    const response = await axiosInstance.patch(url, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateMerchantChannels = async (body: MerchantRequestDto) => {
  let url = `merchant/channels`;

  try {
    const response = await axiosInstance.patch(url, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerAgentReferral = async (body) => {
  try {
    const response = await axiosInstance.post(`/agent-referral`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateAgentReferral = async (body, id: number) => {
  try {
    const response = await axiosInstance.patch(`/agent-referral/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const registerMemberReferral = async (body) => {
  try {
    const response = await axiosInstance.post(`/member-referral`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const updateMemberReferral = async (body, id: number) => {
  try {
    const response = await axiosInstance.patch(`/member-referral/${id}`, body, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAPICatchBlock({ error });
    return { isError: true, error: getAPIErrorMessage(error) };
  }
};

const RegisterAPIs = {
  registerAdmin,
  updateAdmin,
  registerAgent,
  updateAgent,
  registerChannel,
  updateChannel,
  registerGateway,
  updateGateway,
  registerSubMerchant,
  updateSubMerchant,
  registerMember,
  updateMember,
  registerMerchant,
  updateMerchant,
  registerAgentReferral,
  updateAgentReferral,
  registerMemberReferral,
  updateMemberReferral,
  updateAgentChannels,
  updateMerchantChannels,
};

export default RegisterAPIs;

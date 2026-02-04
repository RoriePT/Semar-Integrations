import axios from "axios";
import { handleAPICatchBlock } from "./utils";

export const exportExcel = async (
  bodyData: any,
  tableName: string
): Promise<any> => {
  try {
    return await axios.post(`${import.meta.env.VITE_API_BASE_URL}`, bodyData, {
      withCredentials: true,
    });
  } catch (error) {
    handleAPICatchBlock({ error });
    console.log(error);
  }
};

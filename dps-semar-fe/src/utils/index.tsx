import moment from "moment-timezone";

export const fileToBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file provided");
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export function formatDateIST(value: Date | string) {
  if (!value) return "N/A";

  const isRemoteBE =
    import.meta.env.VITE_API_BASE_URL ===
    "https://api.kingsgate-dev.kg91.pro/api";

  // const valueInMs = moment(value).valueOf();

  // const adjustedTime = isRemoteBE
  //   ? valueInMs - 5.5 * 60 * 60 * 1000
  //   : valueInMs;

  return moment(value).tz("Asia/Kolkata").format("DD MMM, YYYY | HH:mm:ss");
}

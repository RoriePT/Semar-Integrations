import { useState, useCallback, useEffect } from "react";
import CommonAPIs from "../api/common";

const useReferralCodeGenerator = (tableName: string, opened) => {
  const [regenerateCode, setRegenerateCode] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [referralLoading, setLoading] = useState(false);

  const generateCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const randomLetters = Array.from({ length: 4 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join("");

    const randomNumbers = Array.from({ length: 3 }, () =>
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    ).join("");

    return randomLetters + randomNumbers;
  };

  const validateCode = async (code: string) => {
    const response = await CommonAPIs.getReferralCodeData(tableName, code);
    if (!response?.data) {
      return false;
    } else return true;
  };

  const generateUniqueCode = async () => {
    setLoading(true);
    let uniqueCode = false;
    while (!uniqueCode) {
      const code = generateCode();
      const isCodeExists = await validateCode(code);
      if (!isCodeExists) {
        setReferralCode(code);
        uniqueCode = true;
        setLoading(false);
      } else uniqueCode = false;
    }
  };

  return {
    setRegenerateCode,
    referralCode,
    generateUniqueCode,
    referralLoading,
  };
};

export default useReferralCodeGenerator;

import { Select } from "@mantine/core";
import React, { useEffect, useState } from "react";
import CommonAPIs from "../../api/common";

interface CustomDropdownProps {
  listType: "MERCHANT" | "MEMBER";
  onChange: (value: string) => void;
  value: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  label?: string;
  payload?: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  listType,
  onChange,
  value,
  error,
  required,
  readOnly,
  label,
  payload,
}) => {
  const [listData, setListData] = useState([]);

  const fetchListData = async (listType: "MERCHANT" | "MEMBER") => {
    try {
      if (listType === "MERCHANT") {
        const data = await CommonAPIs.merchantList();
        setListData(data || []);
      }

      if (listType === "MEMBER") {
        const data = await CommonAPIs.memberList({
          channel: payload?.channel,
          amount: payload?.amount,
        });
        setListData(data || []);
      }
    } catch (error) {
      console.error("Error fetching list data:", error);
      setListData([]);
    }
  };

  useEffect(() => {
    fetchListData(listType);
  }, []);

  return (
    <Select
      data={
        listData?.map((item) => ({
          label: item?.name,
          value: `${item?.id}`,
        })) || []
      }
      label={label}
      onChange={(v) => onChange(v)}
      value={value}
      error={error}
      required={required}
      placeholder={`Select ${listType === "MERCHANT" ? "Merchant" : "Member"} `}
      readOnly={readOnly || false}
      maxDropdownHeight={200}
      searchable
    />
  );
};

export default CustomDropdown;

import { Button } from "@mantine/core";
import { exportToExcel } from "react-json-to-excel";

function JsonToExcel({ data, fileName }) {
  // Remove specified keys from each object
  const handleRemoveFields = (data) => {
    return data.map((item) => {
      const temp = { ...item };

      delete temp?.payoutChannels;
      delete temp?.payinChannels;
      delete temp?.channelProfile;
      delete temp?.profileFields;
      delete temp?.ips;

      return temp;
    });
  };

  const handleExportData = () => {
    const filteredData = handleRemoveFields(data);
    const sortedData = filteredData.sort((a, b) => a.id - b.id);
    exportToExcel(sortedData, fileName);
  };

  return <Button onClick={handleExportData}>Download Excel file</Button>;
}

export default JsonToExcel;

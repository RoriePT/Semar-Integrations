import { Accordion } from "@mantine/core";
import InfoRow from "../../../../../../../components/InfoRow";

const VendorInfo = ({ data }) => {
  // Only render if vendor information exists
  if (!data?.upiVendorName && !data?.vendorName && !data?.upiId) {
    return null;
  }

  return (
    <Accordion.Item value="vendor-info">
      <Accordion.Control>Vendor Information</Accordion.Control>
      <Accordion.Panel>
        {(data?.upiVendorName || data?.vendorName) && (
          <InfoRow
            label="UPI Vendor"
            value={data?.upiVendorName || data?.vendorName || "N/A"}
          />
        )}
        {data?.upiId && (
          <InfoRow
            label="UPI ID"
            value={data?.upiId}
          />
        )}
        {data?.vendorEmail && (
          <InfoRow
            label="Email"
            value={data?.vendorEmail}
          />
        )}
        {data?.vendorMobile && (
          <InfoRow
            label="Mobile"
            value={data?.vendorMobile}
          />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default VendorInfo;


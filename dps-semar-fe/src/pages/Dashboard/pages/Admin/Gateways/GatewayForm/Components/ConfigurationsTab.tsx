import {
  TextInput,
  FileInput,
  Switch,
  Flex,
  Fieldset,
  Button,
} from "@mantine/core";

import { MdCancel } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";

import { fileToBase64 } from "../../../../../../../utils";
import { GatewayResponseType, ErrorsTab1, Tab1State } from "../Utils/types";

const ConfigurationsTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: string, value: any) => void;
  errors: ErrorsTab1;
  editData: GatewayResponseType;
}> = ({ formState, handleChange, errors }) => {
  const handleGatewayLogoChange = async (file: File) => {
    if (file)
      try {
        const base64 = await fileToBase64(file);
        handleChange("gatewayLogo", base64);
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <>
      <TextInput
        label="Gateway Name"
        withAsterisk
        placeholder="Enter gateway name"
        value={formState.GatewayName}
        onChange={(e) => handleChange("GatewayName", e.target.value)}
        error={errors.GatewayName}
      />

      <Switch
        label={"Allow this gateway for payins"}
        labelPosition="right"
        defaultChecked={formState.enabledForPayins}
        onChange={(e) => handleChange("enabledForPayins", e.target.value)}
      />

      <Switch
        label={"Allow this channel for payouts and withdrawals"}
        labelPosition="right"
        defaultChecked={formState.enabledForPayouts}
        onChange={(e) => handleChange("enabledForPayouts", e.target.value)}
      />

      <FileInput
        label="Gateway Logo"
        description="Upload a logo which will be used in checkout page"
        multiple={false}
        accept="image/png,image/jpeg"
        leftSection={<BsFillImageFill />}
        placeholder="Click to upload an image (Optional)"
        onChange={handleGatewayLogoChange}
      />

      {formState.GatewayLogo && (
        <Flex
          w={"40px"}
          p={"4px"}
          style={{
            position: "relative",
            border: "1px solid #0E385C`",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: "6px",
              padding: "5px",
              background: "#dadada",
            }}
          >
            <img
              src={formState.GatewayLogo}
              alt=""
              height={"100%"}
              width={"100px"}
              style={{ borderRadius: "6px" }}
            />
            <MdCancel
              style={{
                position: "absolute",
                right: -5,
                top: -5,
                cursor: "pointer",
              }}
              onClick={() => {
                handleChange("GatewayLogo", "");
              }}
              color="#353535"
            />
          </div>
        </Flex>
      )}
    </>
  );
};

export default ConfigurationsTab;

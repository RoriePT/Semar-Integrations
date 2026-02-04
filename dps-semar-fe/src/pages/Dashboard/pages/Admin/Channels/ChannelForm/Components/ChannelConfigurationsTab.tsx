import { TextInput, FileInput, Switch, Flex } from "@mantine/core";

import { MdCancel } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";

import { fileToBase64 } from "../../../../../../../utils";
import { ChannelResponseType, ErrorsTab1, Tab1State } from "../Utils/types";

const ChannelConfigurationsTab: React.FC<{
  formState: Tab1State;
  handleChange: (key: string, value: any) => void;
  errors: ErrorsTab1;
  editData: ChannelResponseType;
}> = ({ formState, handleChange, errors }) => {
  const handleChannelLogoChange = async (file: File) => {
    if (file)
      try {
        const base64 = await fileToBase64(file);
        handleChange("channelLogo", base64);
      } catch (error) {
        console.log(error);
      }
  };

  return (
    <>
      <TextInput
        label="Channel Name"
        withAsterisk
        placeholder="Enter channel name"
        value={formState.channelName}
        onChange={(e) => handleChange("channelName", e.target.value)}
        error={errors.channelName}
      />

      <TextInput
        label="Channel Tag"
        withAsterisk
        placeholder="Enter channel tag"
        description="Only lowercase letters allowed. Spaces and special characters (except '-') are not allowed."
        value={formState.channelTag}
        onChange={(e) => handleChange("channelTag", e.target.value)}
        error={errors.channelTag}
      />

      <Switch
        label={"Allow this channel for 3rd-party PG Payins"}
        labelPosition="right"
        checked={formState.enabledForPayins}
        onChange={(e) =>
          handleChange("enabledForPayins", e.currentTarget.checked)
        }
      />

      <Switch
        label={"Allow this channel for 3rd-party PG Payouts"}
        labelPosition="right"
        checked={formState.enabledForPayouts}
        onChange={(e) =>
          handleChange("enabledForPayouts", e.currentTarget.checked)
        }
      />

      {/* <FileInput
        label="Channel Logo"
        description="Upload a logo which will be used in checkout page"
        multiple={false}
        accept="image/png,image/jpeg"
        leftSection={<BsFillImageFill />}
        placeholder="Click to upload an image (Optional)"
        onChange={handleChannelLogoChange}
      /> */}

      {/* {formState.channelLogo && (
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
              src={formState.channelLogo}
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
                handleChange("channelLogo", "");
              }}
              color="#353535"
            />
          </div>
        </Flex>
      )} */}
    </>
  );
};

export default ChannelConfigurationsTab;

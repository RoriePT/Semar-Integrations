import { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  Flex,
  TextInput,
  Button,
  Text,
  Switch,
  Box,
  Select,
  Title,
  Fieldset,
  NumberInput,
  Stack,
} from "@mantine/core";
import { FaTrash, FaPlus } from "react-icons/fa";
import { ErrorsTab2, FieldTypeKeyNames, Tab2State } from "../Utils/types";
//import { useDefaultValues } from "../../../../../DefaultValueProvider";
 import { useDefaultValues } from "../../../../../DefaultValue";


const ChannelsTab: React.FC<{
  formState: Tab2State;
  setTab2State: Dispatch<SetStateAction<Tab2State>>;
  handleChange: (index: number, key: FieldTypeKeyNames, value: any) => void;
  errors: ErrorsTab2;
}> = ({ formState, setTab2State, handleChange, errors }) => {
 const { channels } = useDefaultValues();

//  const channelOptions = Array.isArray(channels)
//    ? channels.map((channel) => ({
//        value: channel.id,
//        label: channel.name,
//      }))
//    : [];
//     const channelNames = channelOptions.map((option) => option.label);
//     const id = channelOptions.map((option) => option.value);

  const getChannelIdByName = (channelName: string) => {
    const channel = channels.find((c) => c.name === channelName);
    return channel ? channel.id : null;
    
  };
   
  const handleAddField = () => {
    setTab2State((prevState) => ({
      ...prevState,
      fields: [
        ...prevState.fields,
        {
          id: null,
          payinsEnabled: false,
          lowerLimitForPayins: null,
          upperLimitForPayins: null,
          payinFees: null,
          payoutsEnabled: false,
          lowerLimitForPayouts: null,
          upperLimitForPayouts: null,
          payoutFees: null,
        },
      ],
    }));
  };

  const handleRemoveField = (index: number) => {
    setTab2State((prevState) => ({
      ...prevState,
      fields: prevState.fields.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Text c={"gray"} size="xs">
        Add the necessary fields for this channel which should be filled by user
        when adding a channel profile via this channel.
      </Text>

      <Accordion variant="filled" defaultValue="item-0">
        {formState.fields.map((field, index) => (
          <Accordion.Item value={`item-${index}`} key={index}>
            <Accordion.Control>{`Channel ${index + 1}`}</Accordion.Control>
            <Accordion.Panel>
              <Flex direction={"column"} gap={"lg"}>
                <Select
                  label={"Channel"}
                  placeholder="Select channel"
                  // data={["UPI", "Netbanking"]}
                  data={channels?.map((channel) => channel.name)}
                  onChange={(value) =>
                    handleChange(index, "id", getChannelIdByName(value))
                  }
                  error={errors[index]?.channelName}
                />

                <Fieldset legend="Payin profile" variant="filled">
                  <Stack>
                    <Switch
                      label={"Enabled"}
                      labelPosition="right"
                      checked={field.payinsEnabled}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "payinsEnabled",
                          e.currentTarget.checked
                        )
                      }
                    />

                    <NumberInput
                      label="Minimum amount"
                      placeholder="Enter the minimum amount"
                      withAsterisk
                      value={field.lowerLimitForPayins}
                      error={errors[index]?.lowerLimitForPayins}
                      onChange={(value) =>
                        handleChange(index, "lowerLimitForPayins", value)
                      }
                    />

                    <NumberInput
                      label="Maximum amount"
                      placeholder="Enter the maximum amount"
                      withAsterisk
                      value={field.upperLimitForPayins}
                      error={errors[index]?.upperLimitForPayins}
                      onChange={(value) =>
                        handleChange(index, "upperLimitForPayins", value)
                      }
                    />

                    <NumberInput
                      label="Upstream fees"
                      placeholder="Enter the maximum amount"
                      withAsterisk
                      rightSection={"%"}
                      value={field.payinFees}
                      error={errors[index]?.payinFees}
                      onChange={(value) =>
                        handleChange(index, "payinFees", value)
                      }
                    />
                  </Stack>
                </Fieldset>

                <Fieldset legend="Payout/Withdrawal profile" variant="filled">
                  <Stack>
                    <Switch
                      label={"Enabled"}
                      labelPosition="right"
                      checked={field.payoutsEnabled}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "payoutsEnabled",
                          e.currentTarget.checked
                        )
                      }
                    />

                    <NumberInput
                      label="Minimum amount"
                      placeholder="Enter the minimum amount"
                      withAsterisk
                      value={field.lowerLimitForPayouts}
                      error={errors[index]?.lowerLimitForPayouts}
                      onChange={(value) =>
                        handleChange(index, "lowerLimitForPayouts", value)
                      }
                    />

                    <NumberInput
                      label="Maximum amount"
                      placeholder="Enter the maximum amount"
                      withAsterisk
                      value={field.upperLimitForPayouts}
                      error={errors[index]?.upperLimitForPayouts}
                      onChange={(value) =>
                        handleChange(index, "upperLimitForPayouts", value)
                      }
                    />

                    <NumberInput
                      label="Upstream fees"
                      placeholder="Enter the maximum amount"
                      withAsterisk
                      rightSection={"%"}
                      value={field.payoutFees}
                      error={errors[index]?.payoutFees}
                      onChange={(value) =>
                        handleChange(index, "payoutFees", value)
                      }
                    />
                  </Stack>
                </Fieldset>

                {formState.fields.length > 1 && (
                  <Button
                    variant="outline"
                    color="red"
                    leftSection={<FaTrash />}
                    w={"fit-content"}
                    size="xs"
                    onClick={() => handleRemoveField(index)}
                  >
                    Remove
                  </Button>
                )}
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button variant="light" leftSection={<FaPlus />} onClick={handleAddField}>
        Add new field
      </Button>
    </>
  );
};

export default ChannelsTab;

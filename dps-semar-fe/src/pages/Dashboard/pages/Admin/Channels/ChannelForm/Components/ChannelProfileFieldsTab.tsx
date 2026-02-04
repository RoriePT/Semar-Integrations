import { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  Flex,
  TextInput,
  Button,
  Text,
  Switch,
  Box,
} from "@mantine/core";
import { FaTrash, FaPlus } from "react-icons/fa";
import { ErrorsTab2, FieldTypeKeyNames, Tab2State } from "../Utils/types";

const ChannelProfileFieldsTab: React.FC<{
  formState: Tab2State;
  setTab2State: Dispatch<SetStateAction<Tab2State>>;
  handleChange: (index: number, key: FieldTypeKeyNames, value: any) => void;
  errors: ErrorsTab2;
  forUpdate:boolean;
}> = ({ formState, setTab2State, handleChange, errors,forUpdate }) => {
  const handleAddField = () => {
    setTab2State((prevState) => ({
      ...prevState,
      fields: [
        ...prevState.fields,
        {
          fieldLabel: "",
          isOptional: false,
          fieldRegex: "",
          fieldErrorMessage: "",
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
            <Accordion.Control>{`Field ${index + 1}`}</Accordion.Control>
            <Accordion.Panel>
              <Flex direction={"column"} gap={"lg"}>
                <TextInput
                  label="Field Label"
                  placeholder="Enter the label for this field"
                  withAsterisk
                  value={field.fieldLabel}
                  error={errors[index]?.fieldLabel}
                  onChange={(e) =>
                    handleChange(index, "fieldLabel", e.target.value)
                  }
                  disabled={forUpdate}
                />
                <Switch
                  label={"This field is optional"}
                  labelPosition="right"
                  checked={field.isOptional}
                  onChange={(e) =>
                    handleChange(index, "isOptional", e.currentTarget.checked)
                  }
                  disabled={forUpdate}
                />

                <Box>
                  <TextInput
                    label="Field Validation"
                    placeholder="Enter validation pattern rule"
                    withAsterisk
                    value={field.fieldRegex}
                    error={errors[index]?.fieldRegex}
                    onChange={(e) =>
                      handleChange(index, "fieldRegex", e.target.value)
                    }
                    mb={"lg"}
                    disabled={forUpdate}
                  />
                  <TextInput
                    label="Validation Error Message"
                    placeholder="Enter error message"
                    withAsterisk
                    value={field.fieldErrorMessage}
                    error={errors[index]?.fieldErrorMessage}
                    onChange={(e) =>
                      handleChange(index, "fieldErrorMessage", e.target.value)
                    }
                    disabled={forUpdate}
                  />
                </Box>

                {formState.fields.length > 1 && (
                  <Button
                    variant="outline"
                    color="red"
                    leftSection={<FaTrash />}
                    w={"fit-content"}
                    size="xs"
                    onClick={() => handleRemoveField(index)}
                    disabled={forUpdate}
                  >
                    Remove
                  </Button>
                )}
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button
        variant="light"
        leftSection={<FaPlus />}
        onClick={handleAddField}
        disabled={forUpdate}
      >
        Add new field
      </Button>
    </>
  );
};

export default ChannelProfileFieldsTab;

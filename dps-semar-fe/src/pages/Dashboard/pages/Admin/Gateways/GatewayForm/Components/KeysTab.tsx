
import { Button, Fieldset, Flex, Stack, Tabs, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { ErrorsTab3, Key, Tab3State } from "../Utils/types";

const KeysTab: React.FC<{
  formState: Tab3State;
  handleChange: (key: string, value: Key[]) => void;
  errors: ErrorsTab3;
}> = ({ formState, handleChange, errors }) => {
  const [inputValue, setInputValue] = useState("");
  const [fields, setFields] = useState<string[]>([]);

  const handleAddField = () => {
    if (inputValue.trim() !== "") {
      const newKey: Key = { label: inputValue.trim(), value: "" };
      handleChange("uatMerchantKeys", [  ...formState.uatMerchantKeys,{ ...newKey }, ]);
      handleChange("prodMerchantKeys", [...formState.prodMerchantKeys, { ...newKey }]);
      setFields((prevFields) => [...prevFields, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveField = (label: string) => {
    const updateduatMerchantKeys = formState.uatMerchantKeys.filter(
      (key) => key.label !== label
    );
    const updatedprodMerchantKeys = formState.prodMerchantKeys.filter(
      (key) => key.label !== label
    );

    handleChange("uatMerchantKeys", updateduatMerchantKeys);
    handleChange("prodMerchantKeys", updatedprodMerchantKeys);
    setFields((prevFields) => prevFields.filter((field) => field !== label));
  };

 
  const handleuatMerchantKeysChange = (label: string, value: string) => {
    const updateduatMerchantKeys = formState.uatMerchantKeys.map((key) =>
      key.label === label ? { ...key, value } : key
    );
    handleChange("uatMerchantKeys", updateduatMerchantKeys);
  };

  
  const handleprodMerchantKeysChange = (label: string, value: string) => {
    const updatedprodMerchantKeys = formState.prodMerchantKeys.map((key) =>
      key.label === label ? { ...key, value } : key
    );
    handleChange("prodMerchantKeys", updatedprodMerchantKeys);
  };


  return (
    <>
      <Fieldset legend="Gateway Keys and Secrets" variant="filled">
        {fields.length > 0 && (
          <Stack mt={"md"}>
            {fields.map((field, index) => (
              <Flex align="center" key={index} gap="xs" mb={"xs"}>
                <TextInput value={field} readOnly w={"100%"} />
                <FaTrash
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveField(field)}
                />
              </Flex>
            ))}
          </Stack>
        )}

        <Flex align={"center"} gap={"xs"} mb={"xs"}>
          <TextInput
            placeholder="e.g API URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            w={"100%"}
          />
        </Flex>
        <Button mt={"xs"} variant="light" onClick={handleAddField}>
          Add Field
        </Button>
      </Fieldset>

      <Tabs defaultValue="uatMerchantKeys" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="uatMerchantKeys" w={"50%"}>
            Live Keys
          </Tabs.Tab>
          <Tabs.Tab value="prodMerchantKeys" w={"50%"}>
            Sandbox Keys
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="uatMerchantKeys">
          <Stack mt={"md"}>
            {formState.uatMerchantKeys.length > 0 &&
              formState.uatMerchantKeys.map((key, index) => (
                <Flex align="center" key={index} gap="xs">
                  <TextInput
                    label={key.label}
                    value={key.value}
                    placeholder={`Please enter the value for ${key.label}`}
                    withAsterisk
                    w={"100%"}
                    onChange={(e) =>
                      handleuatMerchantKeysChange(key.label, e.target.value)
                    }
                    error={errors.uatMerchantKeys}
                  />
                </Flex>
              ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="prodMerchantKeys">
          <Stack mt={"md"}>
            {formState.prodMerchantKeys.length > 0 &&
              formState.prodMerchantKeys.map((key, index) => (
                <Flex align="center" key={index} gap="xs">
                  <TextInput
                    label={key.label}
                    value={key.value}
                    placeholder={`Please enter the value for ${key.label}`}
                    withAsterisk
                    w={"100%"}
                    onChange={(e) =>
                      handleprodMerchantKeysChange(key.label, e.target.value)
                    }
                    error={errors.prodMerchantKeys}
                  />
                </Flex>
              ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default KeysTab;

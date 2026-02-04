import { Button, Flex, Modal, Select, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Channels } from "../../types/channel";
import { getAllChannels } from "../../api/channel";

const ChannelProfile = ({ opened, handlers, handleSubmit, tag, fields }) => {
  const convertFieldArrayToValueObject = () => {
    let obj = {};
    for (const field of fields) {
      obj[field.label] = field.value;
    }
    return obj;
  };

  const [channels, setChannels] = useState<Channels>([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(null);

  useEffect(() => {
    setValues(convertFieldArrayToValueObject());
    setSelectedChannel(tag);
  }, [tag, fields, opened]);

  useEffect(() => {
    setValues({});
    setErrors({});
  }, [selectedChannel]);

  const getChannelNameFromTag = (tag) => {
    return channels.find((ch) => ch.tag === tag)?.name;
  };

  const getChannelTagFromName = (name) => {
    return channels.find((ch) => ch.name === name)?.tag;
  };

  const selectedChannelObj = channels.find((ch) => ch.tag === selectedChannel);

  const convertValueObjectToFieldArray = (values) => {
    const v = values;
    let arr = [];
    for (const key in v) {
      arr.push({
        label: key,
        value: values[key],
        fieldId: selectedChannelObj.profileFields?.find((f) => f.label === key)
          ?.id,
      });
    }
    return arr;
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const data = await getAllChannels();
      setChannels(data);
    };
    fetchChannels();
  }, [opened]);

  useEffect(() => {
    if (!opened) {
      setSelectedChannel("");
      setErrors({});
      setValues({});
    }
  }, [opened]);

  const handleSave = () => {
    const profileFields =
      channels?.find((ch) => ch.tag === selectedChannel)?.profileFields || [];

    let flag = true;
    for (const field of profileFields) {
      if (!field.optional && !values[field.label]) {
        setErrors((prev) => ({
          ...prev,
          [field.label]: "Please fill this field",
        }));
        flag = false;
      }

      if (field.regex && flag) {
        const regex = new RegExp(field.regex);
        if (!regex.test(values[field.label])) {
          setErrors((prev) => ({ ...prev, [field.label]: field.errorMessage }));
          flag = false;
        }
      }
    }

    if (!flag) return;

    handleSubmit(selectedChannelObj, convertValueObjectToFieldArray(values));
    handlers.close();
  };

  // new RegExp(regexPattern)

  const handleChangeValue = (key, value) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      centered
      opened={opened}
      onClose={handlers.close}
      title={"Channel Profile"}
    >
      <Flex direction={"column"} gap={"lg"}>
        <Select
          data={channels.map((ch) => ch.name)}
          label="Channel"
          withAsterisk
          value={getChannelNameFromTag(selectedChannel)}
          onChange={(v) => setSelectedChannel(getChannelTagFromName(v))}
          placeholder="Please select a channel"
        />

        {selectedChannel && (
          <>
            {channels
              .find((ch) => ch.tag === selectedChannel)
              ?.profileFields?.map((field) => (
                <>
                  <TextInput
                    label={field.label}
                    withAsterisk={!field.optional}
                    error={errors[field.label]}
                    value={values[field.label]}
                    onChange={(e) =>
                      handleChangeValue(field.label, e.target.value)
                    }
                  />
                </>
              ))}
          </>
        )}

        <Button disabled={selectedChannel === ""} onClick={handleSave}>
          Save
        </Button>
      </Flex>
    </Modal>
  );
};

export default ChannelProfile;

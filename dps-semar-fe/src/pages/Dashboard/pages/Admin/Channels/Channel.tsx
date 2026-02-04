// import {
//   Button,
//   Divider,
//   Paper,
//   Stack,
//   Switch,
//   TextInput,
//   Title,
// } from "@mantine/core";
// import React, { useEffect, useState } from "react";
// import { updateChannelAPI } from "../../../../../api/channel";

// interface ChannelProps {
//   name: string;
//   tag: string;
//   enabledForPayins: boolean;
//   enabledForPayouts: boolean;
//   setChannelsData: (data: any) => void;
//   channelsData: any;
// }

// const Channel: React.FC<ChannelProps> = ({
//   name,
//   tag,
//   enabledForPayins,
//   enabledForPayouts,
//   setChannelsData,
//   channelsData,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const updateChannel = (type: "incoming" | "outgoing", value: boolean) => {
//     const updatedChannels = channelsData.map((item) => {
//       if (item.name === name) {
//         return { ...item, [type]: value };
//       }
//       return item;
//     });
//     setChannelsData(updatedChannels);
//   };

//   const handleSave = async (name: string) => {
//     const response = await updateChannelAPI(
//       channelsData.filter((item) => item.name === name)[0]
//     );
//   };

//   return (
//     <Paper px="lg" py="md">
//       <Title order={2} ta="center">
//         {name}
//       </Title>

//       <Divider my="md" />

//       <Stack gap="xl">
//         <TextInput
//           label="Channel Tag"
//           withAsterisk
//           placeholder="Enter channel tag"
//           description="Only lowercase letters allowed. Spaces and special characters (except '-') are not allowed."
//           value={tag}
//           readOnly
//         />

//         <Switch
//           label="Enabled for Incoming Transactions"
//           labelPosition="left"
//           description="Determines whether this channel is enabled for payins and top-ups throughout the system"
//           checked={enabledForPayins}
//           onChange={(event) =>
//             updateChannel("incoming", event.currentTarget.checked)
//           }
//         />

//         <Switch
//           label="Enabled for Outgoing Transactions"
//           labelPosition="left"
//           description="Determines whether this channel is enabled for payouts and withdrawals throughout the system"
//           checked={enabledForPayouts}
//           onChange={(event) =>
//             updateChannel("outgoing", event.currentTarget.checked)
//           }
//         />

//         <Button
//           w="100%"
//           size="md"
//           onClick={() => handleSave(name)}
//           loading={loading}
//         >
//           Save
//         </Button>
//       </Stack>
//     </Paper>
//   );
// };

// export default Channel;
import {
  Button,
  Divider,
  Paper,
  Stack,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useState } from "react";
import { updateChannelAPI } from "../../../../../api/channel";
import { showNotification } from "@mantine/notifications";


interface ChannelProps {
  name: string;
  tag: string;
  enabledForPayins: boolean;
  enabledForPayouts: boolean;
  setChannelsData: (data: any) => void;
  channelsData: any;
}

const Channel: React.FC<ChannelProps> = ({
  name,
  tag,
  enabledForPayins,
  enabledForPayouts,
  setChannelsData,
  channelsData,
}) => {
  const [loading, setLoading] = useState(false);

  const updateChannel = (type: "incoming" | "outgoing", value: boolean) => {
    const updatedChannels = channelsData.map((item) => {
      if (item.name === name) {
        return { ...item, [type]: value };
      }
      return item;
    });
    setChannelsData(updatedChannels);
  };

  const handleSave = async (name: string) => {
    setLoading(true);
    
      const response = await updateChannelAPI(
        channelsData.filter((item) => item.name === name)[0]
      );
     if(response){ 
       showNotification({
        title: "Success",
        message: "Channel updated successfully!",
        color: "green",
        autoClose: 3000,
      });}
    else{
       showNotification({
        title: "Error",
        message: "An error occurred while updating the channel.",
        color: "red",
        autoClose: 3000,
      });
    }
   
   
      setLoading(false);
 
  };

  return (
    <Paper px="lg" py="md">
      <Title order={2} ta="center">
        {name}
      </Title>

      <Divider my="md" />

      <Stack gap="xl">
        <TextInput
          label="Channel Tag"
          withAsterisk
          placeholder="Enter channel tag"
          description="Only lowercase letters allowed. Spaces and special characters (except '-') are not allowed."
          value={tag}
          readOnly
        />

        <Switch
          label="Enabled for Incoming Transactions"
          labelPosition="left"
          description="Determines whether this channel is enabled for payins and top-ups throughout the system"
          checked={enabledForPayins}
          onChange={(event) =>
            updateChannel("incoming", event.currentTarget.checked)
          }
        />

        <Switch
          label="Enabled for Outgoing Transactions"
          labelPosition="left"
          description="Determines whether this channel is enabled for payouts and withdrawals throughout the system"
          checked={enabledForPayouts}
          onChange={(event) =>
            updateChannel("outgoing", event.currentTarget.checked)
          }
        />

        <Button
          w="100%"
          size="md"
          onClick={() => handleSave(name)}
          loading={loading}
        >
          Save
        </Button>
      </Stack>
    </Paper>
  );
};

export default Channel;


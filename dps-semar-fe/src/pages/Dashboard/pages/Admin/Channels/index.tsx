import { useEffect, useState } from "react";

import { Container, Grid, Text } from "@mantine/core";
import { getAllChannels } from "../../../../../api/channel";
import Channel from "./Channel";

const Channels = () => {
  const [channelsData, setChannelsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await getAllChannels();
      if (response) {
        setChannelsData(response);
      }
    };
    fetchChannels();
  }, []);

  return (
    <Container maw={"100%"}>
      <Text c={"gray"} maw={"700px"}>
        A channel in Semar refers to a payment method that can be used for
        various transactions, including pay-ins, pay-outs, withdrawals, and
        top-up orders.
      </Text>

      <Grid mt={"xl"}>
        {channelsData.length > 0 ? (
          channelsData.map((channel) => (
            <Grid.Col span={6} key={channel.id}>
              <Channel
                name={channel.name}
                tag={channel.tag_name}
                enabledForPayins={channel.incoming}
                enabledForPayouts={channel.outgoing}
                setChannelsData={setChannelsData}
                channelsData={channelsData}
              />
            </Grid.Col>
          ))
        ) : (
          <Text>No channels available</Text>
        )}
      </Grid>
    </Container>
  );
};

export default Channels;

import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Tabs,
  Text,
  Title,
  Flex,
  ScrollArea,
} from "@mantine/core";
import InfoRow from "../../InfoRow";
import Withdrawals from "./Components/Withdrawals";
import Commissions from "./Components/Commissions";
import FundRecord from "./FundRecord";
import UserDetailAPIs from "../../../api/userDetails";
import moment from "moment";

const Agent = ({ opened, setOpened, id }) => {
  const [payinLength, setPayinLength] = useState(0);
  const [payoutLength, setPayoutLength] = useState(0);
  const [withdrawalLength, setWithdrawalLength] = useState(0);
  const [topupLength, setTopupLength] = useState(0);
  const [commissionLength, setCommissionLength] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (opened && id) {
        const data = await UserDetailAPIs.getUserDetails("agent", id);
        if (data) {
          setUserData(data);
        }
      }
    };
    fetchUserDetails();
  }, [opened, id]);

  return (
    <div>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={4} p="xs">
            Order Summary
          </Title>
        }
        padding="xs"
        position="bottom"
        size="95vh"
      >
        <ScrollArea
          type="hover"
          // maw={"100%"}
          offsetScrollbars
          scrollbarSize={"5px"}
          style={{ flexGrow: 1 }}
        >
          <Tabs defaultValue="orderHistory" py="xs" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="orderHistory" w="50%">
                {" "}
                Order History
              </Tabs.Tab>
              <Tabs.Tab value="fundRecords" w="50%">
                Fund Records
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="orderHistory" p="xs">
              <ScrollArea
                type="hover"
                // maw={"100%"}
                offsetScrollbars
                scrollbarSize={"5px"}
                style={{ flexGrow: 1 }}
              >
                <Tabs defaultValue="withdrawal">
                  <Tabs.List>
                    <Tabs.Tab value="withdrawal">
                      Withdrawal Orders ({withdrawalLength})
                    </Tabs.Tab>
                    <Tabs.Tab value="commission">
                      Commissions ({commissionLength})
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="withdrawal">
                    <Withdrawals setLength={setWithdrawalLength} userId={id} />
                  </Tabs.Panel>

                  <Tabs.Panel value="commission">
                    <Commissions setLength={setCommissionLength} userId={id} />
                  </Tabs.Panel>
                </Tabs>
              </ScrollArea>
            </Tabs.Panel>

            <Tabs.Panel value="fundRecords" p="xs">
              {userData && <FundRecord email={userData?.email} />}
            </Tabs.Panel>
          </Tabs>
        </ScrollArea>
      </Drawer>
    </div>
  );
};

export default Agent;

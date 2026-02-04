import {
  Button,
  Fieldset,
  Flex,
  NumberInput,
  Paper,
  PasswordInput,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";
import TabsLayout from "../../../../../../components/TabsLayout";
import DrawerLayout from "../../../../../../components/DrawerLayout";

import { useDisclosure } from "@mantine/hooks";
import ChannelProfile from "../../../../../../components/ChannelProfile";
import ProfileTab from "./Components/ProfileTab";
import RatesLimitsTab from "./Components/RatesLimitsTab";
import ChannelProfilesTab from "./Components/ChannelProfilesTab";
import useStepper from "./useStepper";

const MemberForm = ({ opened, handlers, editData, triggerReload }) => {
  const {
    currentTab,
    errorsTab1,
    errorsTab2,
    handleSubmitTab1,
    handleSubmitTab2,
    handleTab1Change,
    handleTab2Change,
    tab1State,
    tab2State,
    tab3State,
    handleTab3Change,
    handleBack,
    loading,
    handleSubmitTab3,
  } = useStepper(editData, triggerReload, opened, handlers.close);

  const Header = !editData ? (
    <Title order={4}>Create a new member</Title>
  ) : (
    <Title order={4}>Update member</Title>
  );

  const Body = (
    <div>
      <TabsLayout
        currentValue={currentTab}
        tabs={[
          { label: "Profile Info", value: "1" },
          { label: "Payout Limits", value: "2" },
          { label: "Channel Profiles", value: "3" },
        ]}
        tabPanels={[
          <ProfileTab
            formState={tab1State}
            handleChange={handleTab1Change}
            errors={errorsTab1}
            editData={editData}
          />,
          <RatesLimitsTab
            formState={tab2State}
            handleChange={handleTab2Change}
            errors={errorsTab2}
          />,
          <ChannelProfilesTab
            formState={tab3State}
            handleChange={handleTab3Change}
            editData={editData}
          />,
        ]}
      />
    </div>
  );

  const Footer = (
    <Flex justify={"space-between"} align={"center"}>
      {currentTab === "1" ? (
        <>
          <Button variant="outline" onClick={handlers.close}>
            Cancel
          </Button>
          <Button onClick={handleSubmitTab1}>Next</Button>
        </>
      ) : currentTab === "2" ? (
        <>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSubmitTab2}>Next</Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSubmitTab3} loading={loading}>
            Save
          </Button>
        </>
      )}
    </Flex>
  );

  return (
    <DrawerLayout
      opened={opened}
      close={handlers.close}
      header={Header}
      body={Body}
      footer={Footer}
      position={"right"}
      closeOnOutsideClick={false}
      withCloseButton={true}
    />
  );
};

export default MemberForm;

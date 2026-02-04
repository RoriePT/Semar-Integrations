import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  PasswordInput,
  Select,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import TabsLayout from "../../../../../../components/TabsLayout";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import ProfileTab from "./Components/ProfileTab";
import PermissionsTab from "./Components/PermissionsTab";
import { defaultErrorsTab1, getIntialStateTab1 } from "./Utils/config";

import useStepper from "./useStepper";
import Confirmation from "../../../../../../components/Confirmation";

const SubAccountForm = ({ opened, handlers, editData, triggerReload }) => {
  const {
    currentTab,
    errorsTab1,
    handleSubmitTab1,
    handleSubmitTab2,
    handleTab1Change,
    handleTab2Change,
    tab1State,
    tab2State,
    handleBack,
    disableAll,
    loading,
  } = useStepper(editData, triggerReload, opened, handlers.close);

  const Header = !!editData ? (
    <Title order={4}>Update sub account</Title>
  ) : (
    <Title order={4}>Create a new sub account</Title>
  );

  const Body = (
    <div>
      <TabsLayout
        currentValue={currentTab}
        tabs={[
          { label: "Profile", value: "1" },
          { label: "Permissions", value: "2" },
        ]}
        tabPanels={[
          <ProfileTab
            formState={tab1State}
            handleChange={handleTab1Change}
            errors={errorsTab1}
            editData={editData}
          />,
          <PermissionsTab
            formState={tab2State}
            handleChange={handleTab2Change}
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
      ) : (
        <>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSubmitTab2} loading={loading}>
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

export default SubAccountForm;

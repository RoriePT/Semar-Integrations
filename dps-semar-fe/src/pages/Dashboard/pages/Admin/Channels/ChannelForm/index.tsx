import { Box, Button, Flex, Text, Title } from "@mantine/core";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import TabsLayout from "../../../../../../components/TabsLayout";

import { useDefaultValues } from "../../../../DefaultValue";
import ChannelConfigurationsTab from "./Components/ChannelConfigurationsTab";
import ChannelProfileFieldsTab from "./Components/ChannelProfileFieldsTab";
import useStepper from "./useStepper";

const ChannelForm = ({ opened, handlers, editData, triggerReload }) => {
  const { setReload } = useDefaultValues();

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
    setTab2State,
    handleBack,

    loading,
  } = useStepper(editData, triggerReload, opened, handlers.close, setReload);

  const Header = (
    <Box>
      {!!editData ? (
        <Title order={4}>Update channel</Title>
      ) : (
        <Title order={4}>Create a new channel</Title>
      )}
    </Box>
  );

  const Body = (
    <div>
      <Text c={"gray"} size="xs" mb={"md"}>
        A Channel in Semar is a payment method available for payin, payout,
        top-up and withdrawal orders.
      </Text>
      <TabsLayout
        currentValue={currentTab}
        tabs={[
          { label: "Channel Configurations", value: "1" },
          { label: "Channel Profile Fields", value: "2" },
        ]}
        tabPanels={[
          <ChannelConfigurationsTab
            formState={tab1State}
            handleChange={handleTab1Change}
            errors={errorsTab1}
            editData={editData}
          />,
          <ChannelProfileFieldsTab
            formState={tab2State}
            setTab2State={setTab2State}
            handleChange={handleTab2Change}
            errors={errorsTab2}
            forUpdate={!!editData}
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

export default ChannelForm;

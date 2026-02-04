import { Box, Button, Flex, Text, Title } from "@mantine/core";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import TabsLayout from "../../../../../../components/TabsLayout";

import ChannelsTab from "./Components/ChannelsTab";
import ConfigurationsTab from "./Components/ConfigurationsTab";
import KeysTab from "./Components/KeysTab";
import useStepper from "./useStepper";

const GatewayForm = ({ opened, handlers, editData, triggerReload }) => {
  const {
    currentTab,
    errorsTab1,
    errorsTab2,
    errorsTab3,
    handleSubmitTab1,
    handleSubmitTab2,
    handleTab1Change,
    handleTab2Change,
    handleSubmitTab3,
    handleTab3Change,
    tab1State,
    tab2State,
    tab3State,
    setTab2State,
    handleBack,

    loading,
  } = useStepper(editData, triggerReload, opened, handlers.close);

  const Header = (
    <Box>
      {!!editData ? (
        <Title order={4}>Update gateway</Title>
      ) : (
        <Title order={4}>Create a new gateway</Title>
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
          { label: "Configurations", value: "1" },
          { label: "Keys", value: "2" },
          { label: "Channels", value: "3" },
        ]}
        tabPanels={[
          <ConfigurationsTab
            formState={tab1State}
            handleChange={handleTab1Change}
            errors={errorsTab1}
            editData={editData}
          />,
          <KeysTab
            formState={tab3State}
            handleChange={handleTab3Change}
            errors={errorsTab3}
          />,
          <ChannelsTab
            formState={tab2State}
            setTab2State={setTab2State}
            handleChange={handleTab2Change}
            errors={errorsTab2}
          />,
        ]}
      />
    </div>
  );

  const Footer = (
    // <Flex justify={"space-between"} align={"center"}>
    //   {currentTab === "1" ? (
    //     <>
    //       <Button variant="outline" onClick={handlers.close}>
    //         Cancel
    //       </Button>
    //       <Button onClick={handleSubmitTab1}>Next</Button>
    //     </>
    //   ) : (
    //     <>
    //       <Button variant="outline" onClick={handleBack}>
    //         Back
    //       </Button>
    //       <Button onClick={handleSubmitTab2} loading={loading}>
    //         Save
    //       </Button>
    //     </>
    //   )}
    // </Flex>
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
          <Button
            onClick={() => {
              handleSubmitTab3(); // Handle submit for Tab 2 (using `handleSubmitTab3`)
            }}
          >
            Next
          </Button>
        </>
      ) : currentTab === "3" ? (
        <>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button loading={loading} onClick={handleSubmitTab2}>
            Save
          </Button>
        </>
      ) : null}
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

export default GatewayForm;

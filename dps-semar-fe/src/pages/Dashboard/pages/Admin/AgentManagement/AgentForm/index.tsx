import { Button, Flex, Title } from "@mantine/core";
import TabsLayout from "../../../../../../components/TabsLayout";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import ProfileTab from "./Components/ProfileTab";

import useStepper from "./useStepper";
import WithdrawalsTab from "./Components/Withdrawals";

const AgentForm = ({ opened, handlers, editData, triggerReload }) => {
  const {
    currentTab,
    errorsTab1,
    errorsTab2,

    handleSubmitTab1,
    handleTab1Change,
    handleTab2Change,
    handleSubmitTab2,
    handleBack,

    tab1State,
    tab2State,

    disableAll,
    loading,
  } = useStepper(editData, triggerReload, opened, handlers.close);

  const Header = !!editData ? (
    <Title order={4}>Update agent</Title>
  ) : (
    <Title order={4}>Create a new agent</Title>
  );

  const Body = (
    <div>
      <TabsLayout
        currentValue={currentTab}
        tabs={[
          { label: "Profile", value: "1" },
          { label: "Withdrawal", value: "2" },
        ]}
        tabPanels={[
          <ProfileTab
            formState={tab1State}
            handleChange={handleTab1Change}
            errors={errorsTab1}
            editData={editData}
          />,
          <WithdrawalsTab
            errors={errorsTab2}
            editData={editData}
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

          <Button onClick={handleSubmitTab1} loading={loading}>
            Next
          </Button>
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

export default AgentForm;

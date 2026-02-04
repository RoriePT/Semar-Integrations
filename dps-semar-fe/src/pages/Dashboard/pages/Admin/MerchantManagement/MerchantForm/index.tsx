import { Button, Flex, Tabs, Title } from "@mantine/core";
import TabsLayout from "../../../../../../components/TabsLayout";
import DrawerLayout from "../../../../../../components/DrawerLayout";

import ProfileTab from "./Components/ProfileTab";
import CredentialsTab from "./Components/CredentialsTab";
import PayinsTab from "./Components/PayinsTab";
import PayoutsTab from "./Components/PayoutsTab";
import WithdrawalsTab from "./Components/WithdrawalsTab";
import useStepper from "./useStepper";

const MerchantForm = ({ opened, handlers, editData, triggerReload }) => {
  const {
    currentTab,
    mainTab,
    tab1State,
    handleSubmitTab1,
    handleTab1Change,
    errorsTab1,

    tab2State,
    handleTab2Change,
    handleSubmitTab2,
    handleSubmitTab4,
    errorsTab2,
    handleBack,
    loading,

    tab3State,
    handleTab3Change,
    handleSubmitTab3,
    errorsTab3,
    channels,

    tab4State,
    handleTab4Change,
    errorsTab4,

    tab5State,
    handleTab5Change,
    errorsTab5,
    handleSubmitTab5,
  } = useStepper(editData, triggerReload, opened, handlers.close);

  const Header = !!editData ? (
    <Title order={4}>Update merchant</Title>
  ) : (
    <Title order={4}>Create a new merchant</Title>
  );

  const Body = (
    <div>
      <Tabs value={mainTab} variant="outline">
        <Tabs.List>
          <Tabs.Tab w={"50%"} value="general">
            General Info
          </Tabs.Tab>
          <Tabs.Tab w={"50%"} value="advanced">
            Advanced Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" py={"sm"}>
          <TabsLayout
            currentValue={currentTab}
            tabs={[
              { label: "Profile Info", value: "1" },
              { label: "Credentials", value: "2" },
            ]}
            tabPanels={[
              <ProfileTab
                formState={tab1State}
                handleChange={handleTab1Change}
                errors={errorsTab1}
                editData={editData}
              />,
              <CredentialsTab
                formState={tab2State}
                handleChange={handleTab2Change}
                errors={errorsTab2}
                editData={editData}
              />,
            ]}
          />
        </Tabs.Panel>

        <Tabs.Panel value="advanced" py={"sm"}>
          <TabsLayout
            currentValue={currentTab}
            tabs={[
              { label: "Payins", value: "3" },
              { label: "Payouts", value: "4" },
              { label: "Withdrawals", value: "5" },
            ]}
            tabPanels={[
              <PayinsTab
                formState={tab3State}
                handleChange={handleTab3Change}
                errors={errorsTab3}
                channels={channels}
                editData={editData}
              />,
              <PayoutsTab
                channels={channels}
                formState={tab4State}
                errors={errorsTab4}
                handleChange={handleTab4Change}
              />,
              <WithdrawalsTab
                formState={tab5State}
                errors={errorsTab5}
                handleChange={handleTab5Change}
                channels={channels}
                editData={editData}
              />,
            ]}
          />
        </Tabs.Panel>
      </Tabs>
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
      ) : currentTab === "5" ? (
        <>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button loading={loading} onClick={handleSubmitTab5}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button
            onClick={() => {
              if (currentTab == "2") handleSubmitTab2();
              if (currentTab == "3") handleSubmitTab3();
              if (currentTab == "4") handleSubmitTab4();
            }}
          >
            Next
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

export default MerchantForm;

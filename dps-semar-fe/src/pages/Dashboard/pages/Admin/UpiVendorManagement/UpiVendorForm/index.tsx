import { Button, Flex, Title } from "@mantine/core";
import React from "react";
import DrawerLayout from "../../../../../../components/DrawerLayout";
import TabsLayout from "../../../../../../components/TabsLayout";
import { UpiVendor } from "../../../../../../types/upiVendor";
import ProfileTab from "./Components/ProfileTab";
import RatesTab from "./Components/RatesTab";
import UpiInfoTab from "./Components/UpiInfoTab";
import useStepper from "./useStepper";

interface UpiVendorFormProps {
  opened: boolean;
  handlers: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  editData: UpiVendor | null;
  triggerReload: () => void;
}

const UpiVendorForm: React.FC<UpiVendorFormProps> = ({
  opened,
  handlers,
  editData,
  triggerReload,
}) => {
  const Header = !editData ? (
    <Title order={4}>Create a new UPI vendor</Title>
  ) : (
    <Title order={4}>Update UPI vendor</Title>
  );

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
    loading,
  } = useStepper(editData, triggerReload, opened, handlers.close);

  const Body = (
    <div>
      <TabsLayout
        currentValue={currentTab}
        tabs={[
          { label: "Profile Info", value: "1" },
          { label: "Rates and Others", value: "2" },
          { label: "UPI Info", value: "3" },
        ]}
        tabPanels={[
          <ProfileTab
            formState={tab1State}
            handleChange={handleTab1Change}
            errors={errorsTab1}
            editData={editData}
          />,
          <RatesTab
            commissionRate={tab2State.commissionRate}
            settlementUpiId={tab2State.settlementUpiId}
            onCommissionRateChange={(val) => handleTab2Change("commissionRate", val)}
            onSettlementUpiIdChange={(val) => handleTab2Change("settlementUpiId", val)}
          />,
          <UpiInfoTab formState={tab2State} handleChange={handleTab2Change} editData={editData} />,
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
      position="right"
      closeOnOutsideClick={true}
      withCloseButton={true}
    />
  );
};

export default UpiVendorForm;

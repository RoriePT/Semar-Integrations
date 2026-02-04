import React, { useState } from "react";
import { Button, Flex, Title, Text, Loader } from "@mantine/core";
import { FiDownload } from "react-icons/fi";
import ModalLayout from "../../../ModalLayout";
import { MdDateRange } from "react-icons/md";
import { DatePickerInput } from "@mantine/dates";
import styles from "./ExportBtn.module.css";

import CommonAPIs from "../../../../api/common";
import JsonToExcel from "../../../JsonToExcel";
import { useMediaQuery } from "@mantine/hooks";

const ExportBtn: React.FC<any> = ({ table }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [showExportButton, setShowExportButton] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTablet = useMediaQuery("(max-width: 460px)");

  const closeModal = () => {
    setIsOpen(false);
    setEndDate(new Date());
    setStartDate(null);
    setRecords([]);
    setShowExportButton(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleStartDate = (date: Date) => {
    setStartDate(date);
  };

  const handleEndDate = (date: Date) => {
    setEndDate(date);
  };

  const handleConfirm = async () => {
    setShowError(false);

    try {
      setLoading(true);
      const res = await CommonAPIs.exportRecords(startDate, endDate, table);
      setRecords(res.data);

      if (res?.total) setShowExportButton(true);
      else setShowError(true);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ModalLayout
        opened={isOpen}
        resetCallback={() => {}}
        close={closeModal}
        header={
          <Title order={2} fw={600} c={"rgba(0,0,0,1)"} size={20}>
            Export Data
          </Title>
        }
        body={
          loading ? (
            <Flex
              justify={"center"}
              align={"center"}
              style={{ height: "200px" }}
            >
              <Loader size="lg" />
            </Flex>
          ) : showExportButton ? (
            <Flex
              justify={"center"}
              align={"center"}
              direction={"column"}
              gap={"16px"}
              m={"12px 0"}
            >
              <Text ta={"center"} w={500} size={"18px"}>
                Click on the button below to download the excel file
              </Text>
              <JsonToExcel data={records} fileName={table} />
            </Flex>
          ) : (
            <>
              <Flex
                justify={"space-between"}
                gap={16}
                className={`${styles.modalBody}`}
              >
                <DatePickerInput
                  rightSection={<MdDateRange color="black" />}
                  rightSectionPointerEvents="none"
                  label="Choose a start date"
                  size={"md"}
                  flex={1}
                  onChange={setStartDate}
                  value={startDate}
                  maxDate={endDate}
                  clearable
                />
                <DatePickerInput
                  rightSection={<MdDateRange color="black" />}
                  rightSectionPointerEvents="none"
                  label="Choose an end date"
                  size={"md"}
                  flex={1}
                  onChange={setEndDate}
                  value={endDate}
                  maxDate={new Date()}
                  clearable
                />
              </Flex>
              {showError && (
                <Text ta={"center"} c={"red"} mt={"12px"}>
                  No records found between selected dates!
                </Text>
              )}
            </>
          )
        }
        footer={
          !showExportButton &&
          !loading && (
            <Flex justify={"flex-end"} gap={12}>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!startDate || !endDate}>
                Confirm
              </Button>
            </Flex>
          )
        }
        size="lg"
      />
      <Button
        size="md"
        leftSection={<FiDownload size={20} />}
        fw={400}
        variant={"default"}
        onClick={openModal}
        style={{ width: isTablet ? "100%" : "auto" }}
      >
        Export
      </Button>
    </>
  );
};

export default ExportBtn;

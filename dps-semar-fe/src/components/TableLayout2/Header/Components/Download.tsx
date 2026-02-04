import React, { useState } from "react";
import { Button, Flex, Title, Text, Loader, Box, Modal } from "@mantine/core";
import { FiDownload } from "react-icons/fi";

import { MdDateRange } from "react-icons/md";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import styles from "./ExportBtn.module.css";

import CommonAPIs from "../../../../api/common";
import JsonToExcel from "../../../JsonToExcel";

const Download = ({ table, opened, close }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [showExportButton, setShowExportButton] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    close();
    setEndDate(new Date());
    setStartDate(null);
    setRecords([]);
    setShowExportButton(false);
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
    <Modal
      opened={opened}
      onClose={closeModal}
      withCloseButton={false}
      centered
    >
      <Box mb={"lg"}>
        <Title order={2} fw={600} c={"rgba(0,0,0,1)"} size={20}>
          Download Data
        </Title>
        <Text size="sm" c={"gray"}>
          Data will be downloaded in an excel file
        </Text>
      </Box>

      <>
        {loading ? (
          <Flex justify={"center"} align={"center"} style={{ height: "200px" }}>
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
            <Flex justify={"space-between"} gap={16} direction={"column"}>
              <DateTimePicker
                rightSection={<MdDateRange color="black" />}
                rightSectionPointerEvents="none"
                label="Choose a start date"
                size={"md"}
                flex={1}
                onChange={setStartDate}
                value={startDate}
                maxDate={endDate}
                clearable
                withSeconds
              />
              <DateTimePicker
                rightSection={<MdDateRange color="black" />}
                rightSectionPointerEvents="none"
                label="Choose an end date"
                size={"md"}
                flex={1}
                onChange={setEndDate}
                value={endDate}
                maxDate={new Date()}
                clearable
                withSeconds
              />
            </Flex>
            {showError && (
              <Text ta={"center"} c={"red"} mt={"12px"}>
                No records found between selected dates!
              </Text>
            )}
          </>
        )}
      </>

      {!showExportButton && !loading && (
        <Flex justify={"space-between"} mt={"lg"}>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!startDate || !endDate}>
            Download
          </Button>
        </Flex>
      )}
    </Modal>
  );
};

export default Download;

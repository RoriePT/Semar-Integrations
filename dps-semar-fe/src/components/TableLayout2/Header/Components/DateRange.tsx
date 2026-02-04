import { Box, Button, Flex, Modal, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";

const DateRange = ({ opened, close, handleApplyDate, startDate, endDate }) => {
  const [startDateLocal, setStartDate] = useState(null);
  const [endDateLocal, setEndDate] = useState(null);

  useEffect(() => {
    setStartDate(startDate);
    setEndDate(endDate);
  }, [startDate, endDate]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title=""
      withCloseButton={false}
      centered
    >
      <Box mb={"lg"}>
        <Title order={3}>Choose date range</Title>
        <Text size="sm" c={"gray"} tabIndex={2}>
          Select a start and end date (e.g., 01/01/2023 - 01/31/2024)
        </Text>
      </Box>

      <DateTimePicker
        maxDate={new Date()}
        placeholder="Choose start date"
        size="md"
        leftSection={<FaRegCalendarAlt />}
        label="Start date"
        withAsterisk
        autoFocus={false}
        clearable
        value={startDateLocal}
        onChange={setStartDate}
        mb={"md"}
        withSeconds
        timePickerProps={{
          withDropdown: true,
          popoverProps: { withinPortal: false },
        }}
        dropdownType="modal"
      />

      <DateTimePicker
        maxDate={new Date()}
        placeholder="Choose end date"
        size="md"
        label="End date"
        leftSection={<FaRegCalendarAlt />}
        withAsterisk
        autoFocus={false}
        clearable
        value={endDateLocal}
        onChange={setEndDate}
        withSeconds
        timePickerProps={{
          withDropdown: true,
          popoverProps: { withinPortal: false },
        }}
        dropdownType="modal"
      />

      {startDate && endDate && (
        <Button
          variant="light"
          onClick={() => handleApplyDate(null, null)}
          mt={"sm"}
          leftSection={<MdOutlineClear />}
        >
          Clear applied dates
        </Button>
      )}
      <Flex
        gap={"md"}
        mt={"lg"}
        justify={"space-between"}
        align={"center"}
        onClick={close}
      >
        <Button w={"100%"} variant="outline">
          Close{" "}
        </Button>
        <Button
          w={"100%"}
          disabled={
            !(startDateLocal && endDateLocal) || startDateLocal > endDateLocal
          }
          onClick={() => {
            handleApplyDate(startDateLocal, endDateLocal);
          }}
        >
          Apply
        </Button>
      </Flex>
    </Modal>
  );
};

export default DateRange;

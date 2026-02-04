import { useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { ActionIcon, Button, Group, Text } from "@mantine/core";
import { FaArrowRight } from "react-icons/fa";

const DateTimeRangePicker = ({ handleDateRange = (start, end) => {} }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = () => {
    if (startDate && endDate) {
      handleDateRange(startDate, endDate);
    } else {
      handleDateRange("01/01/2024", "12/12/2030");
    }
  };

  return (
    <Group align="center">
      <DateTimePicker
        placeholder="Start date & time"
        value={startDate}
        onChange={setStartDate}
        valueFormat="DD/MM/YY HH:mm:ss"
        style={{ maxWidth: 240 }}
        dropdownType="modal"
        timePickerProps={{
          withDropdown: true,
          popoverProps: { withinPortal: false },
        }}
        withSeconds
        clearable
      />
      <Text>To</Text>
      <DateTimePicker
        placeholder="End date & time"
        value={endDate}
        onChange={setEndDate}
        valueFormat="DD/MM/YY HH:mm:ss"
        style={{ maxWidth: 240 }}
        dropdownType="modal"
        timePickerProps={{
          withDropdown: true,
          popoverProps: { withinPortal: false },
        }}
        withSeconds
        clearable
      />
      <Button size="xs" onClick={handleSubmit}>
        <ActionIcon>
          <FaArrowRight />
        </ActionIcon>
      </Button>
    </Group>
  );
};

export default DateTimeRangePicker;

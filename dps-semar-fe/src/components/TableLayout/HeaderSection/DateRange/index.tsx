import { Flex } from "@mantine/core";
import React from "react";
import { DateInput } from "@mantine/dates";
import { FaRegCalendarAlt } from "react-icons/fa";

const DateRange = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <Flex gap={"sm"} align={"center"}>
      <DateInput
        maxDate={new Date()}
        placeholder="Start Date"
        size="md"
        leftSection={<FaRegCalendarAlt />}
        clearable
        value={startDate}
        onChange={setStartDate}
      />
      <DateInput
        maxDate={new Date()}
        placeholder="End Date"
        size="md"
        leftSection={<FaRegCalendarAlt />}
        clearable
        value={endDate}
        onChange={setEndDate}
      />
    </Flex>
  );
};

export default DateRange;

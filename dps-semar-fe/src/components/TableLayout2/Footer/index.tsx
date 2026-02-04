import { Flex, Pagination, Paper, Select, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import React from "react";
import { MdTableRows } from "react-icons/md";

const Footer = ({
  totalPages,
  pageNumber,
  handleSetCurrentPage,
  pageSize,
  handleSetPageSize,

  startRecord,
  endRecord,
  totalRecords,
}) => {
  const { width } = useViewportSize();

  return (
    <Paper w={"100%"} radius={0} mt={"sm"} bg={"gray.0"} p={"xs"}>
      <Flex
        w="100%"
        align={"center"}
        justify={"space-between"}
        direction={width > 640 ? "row" : "column-reverse"}
        gap={"md"}
      >
        <Flex
          align={"center"}
          gap={"sm"}
          direction={width > 640 ? "row" : "column-reverse"}
        >
          <Select
            data={["10", "25", "50", "100", "500"]}
            defaultValue="10"
            w={"100px"}
            ta={"center"}
            leftSection={<MdTableRows />}
            size="sm"
            checkIconPosition="right"
            value={pageSize.toString()}
            onChange={handleSetPageSize}
          />
          <Text size="sm" fw={500} c={"gray.6"}>
            Showing {startRecord} - {endRecord} of total {totalRecords}
          </Text>
        </Flex>

        <Pagination
          total={totalPages}
          value={pageNumber}
          onChange={handleSetCurrentPage}
          size={width > 640 ? "md" : "sm"}
        />
      </Flex>
    </Paper>
  );
};

export default Footer;

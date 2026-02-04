import { Flex, Loader, ScrollArea, Table, Text } from "@mantine/core";
import React from "react";

const Body = ({ rows, columns, loading }) => {
  return (
    <ScrollArea
      // scrollbars="x"
      type="hover"
      maw={"100%"}
      h={"100%"}
      bg={"white"}
      offsetScrollbars
      scrollbarSize={"5px"}
      style={{ flexGrow: 1, position: "relative" }}
    >
      <Table
        // highlightOnHover
        withRowBorders={true}
        withTableBorder={false}
        stickyHeader
        horizontalSpacing={"md"}
        verticalSpacing={"sm"}
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th>{column}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        {!loading && <Table.Tbody>{rows}</Table.Tbody>}
      </Table>
      {loading && (
        <Flex
          justify={"center"}
          align={"center"}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <Loader />
        </Flex>
      )}

      {!loading && rows.length < 1 && (
        <Flex justify={"center"} align={"center"} mt={"100px"}>
          <Text size="lg" c="gray" style={{ position: "absolute", top: "50%",left:"50%", transform:"translateX(-50%)"}}>
            No rows found
          </Text>
        </Flex>
      )}
    </ScrollArea>
  );
};

export default Body;

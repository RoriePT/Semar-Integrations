import React from "react";
import {
  Table,
  ScrollArea,
  Flex,
  Text,
  Pagination,
  Loader,
} from "@mantine/core";
import styles from "./UserTable.module.css";
import HeaderSection from "./HeaderSection";
import PageSizeSelector from "./HeaderSection/PageSizeSelector";

const TableLayout = ({
  columns,
  rows,
  showPagination = true,
  showHeader = true,
  handleChangePageSize,
  pageSize,
  pageNumber,
  handleSetCurrentPage,
  totalPages,
  startRecord,
  endRecord,
  totalRecords,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  search,
  setSearch,
  loading,
  searchPlaceholder="Search by Name",
}) => {
  return (
    <>
      <HeaderSection
        showHeader={showHeader}
        showPageSizeSelector={true}
        showFilterRoles={true}
        showSearchBox={true}
        showExportBtn={false}
        showAddUserButton={true}
        onAddUserClick={() => {
          // setEditUser(null);
          // form.reset();
          // setModalOpened(true);
        }}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        search={search}
        setSearch={setSearch}
        searchPlaceholder={searchPlaceholder}
      />
      <div className={styles.mainTable}>
        <ScrollArea className={styles.container}>
          <Table className={styles.AdminTable}>
            <thead>
              <tr className={styles.row}>
                {columns.map(
                  (column) =>
                    column.visible && (
                      <th
                        key={column.accessor}
                        style={{ maxWidth: column.maxWidth }}
                      >
                        {column.Header}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody className={styles.adminTableEntries}>
              {!loading &&
                rows.map((row, rowIndex) =>
                  React.cloneElement(row, {
                    key: rowIndex,
                    children: React.Children.map(
                      row.props.children,
                      (cell, cellIndex) =>
                        React.cloneElement(cell, {
                          style: { maxWidth: columns[cellIndex]?.maxWidth },
                        })
                    ),
                  })
                )}
            </tbody>
          </Table>
          {loading && (
            <Flex justify={"center"} align={"center"} mt={"50px"}>
              <Loader />
            </Flex>
          )}
          {!rows.length && !loading && (
            <Flex justify={"center"} align={"center"} mt={"50px"}>
              <Text>No records found!</Text>
            </Flex>
          )}
        </ScrollArea>
      </div>

      {showPagination && rows.length > 0 && (
        <Flex
          my={"md"}
          justify={"space-between"}
          align={"center"}
          className={styles.paginationSection}
        >
          <Flex align={"center"} gap={"lg"}>
            <PageSizeSelector
              pageSize={pageSize}
              handleChangePageSize={handleChangePageSize}
            />
            <Text>
              Showing <strong>{startRecord}</strong> to{" "}
              <strong>{endRecord}</strong> from <strong>{totalRecords}</strong>{" "}
              entries
            </Text>
          </Flex>

          <Pagination
            total={totalPages}
            value={pageNumber}
            onChange={handleSetCurrentPage}
          />
        </Flex>
      )}
    </>
  );
};

export default TableLayout;

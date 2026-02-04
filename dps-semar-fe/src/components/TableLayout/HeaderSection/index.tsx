import React from "react";
import { Button, Group } from "@mantine/core";

import styles from "./HeaderSection.module.css";
import PageSizeSelector from "./PageSizeSelector";
import FilterRoles from "./FilterRoles";
import SearchBox from "./SearchBox";
import ExportBtn from "./ExportBtn";
import DateRange from "./DateRange";

interface HeaderSectionProps {
  showHeader?: boolean;
  showPageSizeSelector?: boolean;
  showFilterRoles?: boolean;
  showSearchBox?: boolean;
  showExportBtn?: boolean;
  showAddUserButton?: boolean;
  searchPlaceholder?: string;
  onAddUserClick: () => void;
}

const HeaderSection = ({
  showHeader = true,
  showPageSizeSelector = true,
  showFilterRoles = true,
  showSearchBox = true,
  showExportBtn = true,
  showAddUserButton = true,
  searchPlaceholder = "Search by Name",
  onAddUserClick,

  startDate,
  endDate,
  setStartDate,
  setEndDate,

  search,
  setSearch,
}) => {
  if (!showHeader) return null;

  return (
    <>
      <div className={styles.headerSection}>
        <div className={styles.actionsContainer}>
          {true && (
            <DateRange
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
          {/* {showPageSizeSelector && <PageSizeSelector />} */}
          {/* {showFilterRoles && <FilterRoles />} */}
        </div>

        <div className={`${styles.actionsContainer} ${styles.BtnGrp2}`}>
          {showSearchBox && (
            <SearchBox
              search={search}
              setSearch={setSearch}
              placeholder={searchPlaceholder}
            />
          )}
          {/* {showExportBtn && <ExportBtn />} */}
        </div>
      </div>
    </>
  );
};

export default HeaderSection;

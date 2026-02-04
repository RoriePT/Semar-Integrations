import { useEffect, useState } from "react";
import CommonAPIs from "../../api/common";
// import moment from "moment";
import moment from "moment-timezone";

import { MadeVia, defaultFilterData } from "./filterData";

export const usePagination = ({
  table = "admin",
  userId = undefined,
  forBulletin = false,
  status = "",
  userEmail = undefined,
  queryParam = "",
  forWithdrawal = false,
  skipPaginateAppend = false,
}: {
  table?: string;
  userId?: number;
  forBulletin?: boolean;
  status?: string;
  userEmail?: string;
  queryParam?: string;
  forWithdrawal?: boolean;
  skipPaginateAppend?: boolean;
}) => {
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageLength, setPageLength] = useState<number>(10);
  const [startRecord, setStartRecord] = useState<number>(1);
  const [endRecord, setEndRecord] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<any[] | []>([]);
  const [reload, setReload] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [paymentStatus, setPaymentStatus] = useState(status || "");
  const [filterData, setFilterData] = useState(defaultFilterData);
  const [currentFilterData, setCurrentFilterData] = useState(defaultFilterData);
  const [sortByBalanceType, setSortByBalanceType] = useState("");

  const handleChangeFilterData = (key, value) => {
    setFilterData((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilterData(defaultFilterData);

  const handleApplyFilter = () => {
    setCurrentFilterData(filterData);
  };

  const getNumberOfAppliedFilters = () => {
    let count = 0;
    if (currentFilterData?.channels?.length !== 3) count++;
    if (currentFilterData?.statuses?.length !== 5) count++;
    if (
      currentFilterData?.lowerAmount !== 1 ||
      currentFilterData?.upperAmount !== 1000000000
    )
      count++;
    if (currentFilterData.madeVia !== MadeVia[0]) count++;

    return count;
  };

  useEffect(() => {
    const getData = async () => {
      setRowsLoading(true);
      const data = await CommonAPIs.paginate(
        table,
        {
          pageSize: pageLength,
          pageNumber: currentPage,
          startDate: startDate
            ? moment(startDate).tz("Asia/Kolkata")
            : undefined,
          endDate: endDate ? moment(endDate).tz("Asia/Kolkata") : undefined,
          search,
          userId,
          sortBy,
          forBulletin,
          status: paymentStatus,
          userEmail,
          sortByBalanceType: sortByBalanceType,
          filterStatusArray: filterData.statuses,
          filterChannelArray: filterData.channels,
          filterMadeVia: filterData.madeVia,
          filterAmountLower: filterData.lowerAmount,
          filterAmountUpper: filterData.upperAmount,
          filterMemberSearch: filterData.filterMemberSearch,
          filterGatewayArray: filterData.filterGatewayArray,
          filterMerchantSearch: filterData.filterMerchantSearch,
        },
        queryParam,
        skipPaginateAppend
      );
      setTotalEntries(data.total);
      // setCurrentPage(data.page);
      // setPageLength(data.pageSize);
      setStartRecord(data.startRecord);
      setEndRecord(data.endRecord);
      setTotalPages(data.totalPages);
      setRows(table === "channel" ? data : data.data);
      setRowsLoading(false);
    };
    getData();
  }, [
    pageLength,
    search,
    startDate,
    endDate,
    currentPage,
    reload,
    sortBy,
    paymentStatus,
    currentFilterData,
    sortByBalanceType,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageLength]);

  // Fuctions
  const handleSetCurrentPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleStartDate = (event) => {
    if (startDate < endDate) setStartDate(event.target.value);
  };

  const handleEndDate = (event) => {
    if (endDate > startDate) setEndDate(event.target.value);
  };

  return {
    startRecord,
    endRecord,
    totalRecords: totalEntries,
    currentPage,
    pageSize: pageLength,
    pageNumber: currentPage,
    sortBy,
    setSortBy,
    sortByBalanceType,
    setSortByBalanceType,
    setPaymentStatus,
    paymentStatus,

    totalPages,
    rows,
    rowsLoading,

    handleSetCurrentPage,
    handleStartDate,
    handleEndDate,
    handleChangePageSize: setPageLength,

    startDate,
    endDate,
    setStartDate,
    setEndDate,

    search,
    setSearch,
    triggerReload: () => setReload((prev) => !prev),
    filterData,
    handleChangeFilterData,
    resetFilters,
    handleApplyFilter,
    appliedFilterCount: getNumberOfAppliedFilters(),
  };
};

export default usePagination;

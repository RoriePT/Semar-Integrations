import { useEffect, useState } from "react";
import { Input } from "@mantine/core";
import { IoIosSearch } from "react-icons/io";
import styles from "./SearchBox.module.css";

const SearchBox = ({ search, setSearch, placeholder }) => {
  const [searchText, setSearchText] = useState(search);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      setSearch(searchText);
    }, 500);
    return () => {
      clearTimeout(timeId);
    };
  }, [searchText]);
  return (
    <Input
      placeholder={placeholder}
      leftSection={<IoIosSearch size={20} className={styles.searchIcon} />}
      size="md"
      value={searchText}
      onChange={handleSearch}
    />
  );
};

export default SearchBox;

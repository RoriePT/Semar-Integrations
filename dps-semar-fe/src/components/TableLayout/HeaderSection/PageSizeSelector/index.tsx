import React, { useState, useRef, useEffect } from "react";
import { Menu, Button, Flex } from "@mantine/core";
import { IoMdArrowDropdown } from "react-icons/io";
import styles from "./PageSizeSelector.module.css";

const pageSizes = [10, 25, 50, 100, 500];

const PageSizeSelector = ({ pageSize, handleChangePageSize }) => {
  const [isActive, setIsActive] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleSelectSize = (size: number) => {
    handleChangePageSize(size);

    setIsActive(true);
  };

  const handleButtonClick = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Menu position="bottom">
      <Menu.Target>
        <Button
          ref={buttonRef}
          variant="default"
          size="md"
          onClick={handleButtonClick}
          rightSection={<IoMdArrowDropdown size={16} />}
          fw={400}
        >
          {pageSize || "Page Size"}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {pageSizes.map((size) => (
          <Menu.Item key={size} onClick={() => handleSelectSize(size)}>
            {size}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default PageSizeSelector;

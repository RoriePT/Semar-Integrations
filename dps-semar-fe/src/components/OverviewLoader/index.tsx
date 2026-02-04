import { Flex, Loader } from "@mantine/core";
import React from "react";

const OverviewLoader = () => {
  return (
    <Flex
      h={"100%"}
      justify={"center"}
      w={"100%"}
      align={"center"}
      style={{ visibility: "visible", position: "absolute", inset: 0 }}
    >
      <Loader />
    </Flex>
  );
};

export default OverviewLoader;

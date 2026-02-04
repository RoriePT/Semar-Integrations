import React, { useState, useEffect } from "react";

import { useDisclosure } from "@mantine/hooks";
import usePagination from "../../../../../hook/usePagination";
import { Flex } from "@mantine/core";
import OrganisationTree from "../../../../../components/OrganisationTree";
import Tree from "../../../../../components/Tree";
import { useDashboardUser } from "../../../DashboardProvider";

const MyTeam = () => {
  const { userData } = useDashboardUser();

  return (
    <Tree
      opened={true}
      close={(undefined) => {}}
      type={"members"}
      forUser={"user"}
      teamId={userData?.teamId}
    />
  );
};

export default MyTeam;

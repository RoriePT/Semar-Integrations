import { useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { AdminOverviewAPIs } from "../../../../../../../api/overview";

const useData = () => {
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isTablet = useMediaQuery("(max-width: 990px)");

  const [loading, setLoading] = useState(true);

  const [memberData, setMemberData] = useState({
    self: 23,
    admin: 45,
  });

  const [userData, setUserData] = useState({
    admins: 0,
    merchants: 0,
    agents: 0,
    members: 0,
  });

  const [members, setMembers] = useState([]);

  const getAllData = async () => {
    setLoading(true);

    const data = await AdminOverviewAPIs.users();
    setMembers(data.members);
    setMemberData(data.memberData);
    setUserData(data.userInfo);

    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  return {
    isMobile,
    isTablet,
    userData,
    memberData,
    members,

    loading,
  };
};

export default useData;

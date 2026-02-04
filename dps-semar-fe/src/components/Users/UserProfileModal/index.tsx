import { Center, Flex, Loader, Modal, Paper, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import InfoRow from "../../InfoRow";
import moment from "moment";
import UserDetailAPIs from "../../../api/userDetails";
import Agent from "./components/Agent";
import Member from "./components/Member";
import Merchant from "./components/Merchant";
import UpiVendor from "./components/UpiVendor";

const UserProfileModal = ({ opened, setOpened, userId, userType }) => {
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    setLoader(true);
    const res = await UserDetailAPIs.getUserDetails(
      userType.toLowerCase(),
      userId
    );
    if (res) setUserDetails(res);
    setLoader(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [opened]);

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`${userType} Information`}
        centered
        size="lg"
      >
        {loader ? (
          <Flex>
            <Loader />
          </Flex>
        ) : (
          <>
            <div style={{ marginBottom: "10px", padding: "10px" }}>
              {userType.toLowerCase() === "agent" && (
                <Agent userDetails={userDetails} />
              )}
              {userType.toLowerCase() === "member" && (
                <Member userDetails={userDetails} />
              )}
              {userType.toLowerCase() === "merchant" && (
                <Merchant userDetails={userDetails} />
              )}
              {userType.toLowerCase() === "upi vendor" && (
                <UpiVendor userDetails={userDetails} />
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UserProfileModal;

import { Loader } from "@mantine/core";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  getMyAlerts,
  getMyNotifications,
} from "../../api/alertsAndNotifications";
import CommonAPIs from "../../api/common";
import Alert from "../../components/Alert";
import useSocket from "../../hook/useSocket";
import {
  decodeJwt,
  getUserTable,
  getUserType,
  isUserLoggedIn,
} from "../../utils/auth";

// Create the UserContext
const DashboardContext = createContext<any>({});

// Custom hook to use the UserContext
export const useDashboardUser = () => {
  return useContext(DashboardContext);
};

// Provider component
export const DashboardProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  const userTypeFromURL = pathname.split("/");

  const decodedToken: any = decodeJwt(localStorage.getItem("KGtoken2"));

  let userId = null;
  let userType = null;
  let userTable = null;

  if (decodedToken.id) {
    userId = decodedToken.id;
    userType = getUserType(decodedToken.type);
    userTable = getUserTable(decodedToken.type);
  }

  const addNotification = (data) => {
    setNotifications((prev) => [...prev, data]);
  };

  const addAlert = (data) => {
    setAlerts((prev) => [...prev, data]);
  };

  const {} = useSocket(import.meta.env.VITE_SOCKET_BASE_URL, {
    userId,
    userType,
    addNotification,
    addAlert,
  });

  // Fetch user data on the first render
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await CommonAPIs.getUser(userTable);
        setUserData({ ...data, userType, userTable });
      } catch (e) {
        setUserData({ id: userId, userType, userTable });
      }

      // if (userType === "Member") {
      //   setUserId(decodedToken.id);
      // }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    if (isUserLoggedIn() && userId) {
      fetchUserData();
    } else setUserData(null);
  }, []);

  if (!isUserLoggedIn()) {
    setUserData(null);
    return <Navigate to={"/sign-in"} />;
  }

  // if (userTypeFromURL[1] !== userData?.userTable)
  //   return <Text>Unauthorized!</Text>;

  const DashboardLoader = (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Loader color="brand" size={"lg"} />
    </div>
  );

  const fetchNotifications = async () => {
    const data = await getMyNotifications();
    setNotifications(data);

    let dataTo;
    if (userData?.userType && !userData.userType.includes("Admin")) {
      dataTo = await getMyAlerts(userData?.userType);
      setAlerts(dataTo);
    }
  };

  useEffect(() => {
    if (
      (userData?.userRole === "MEMBER" ||
        userData?.userRole === "UPI_VENDOR" ||
        userData?.userTable === "member" ||
        userData?.userTable === "upi-vendor") &&
      userData?.id
    ) {
      fetchNotifications();
    }
  }, [userData?.id]);

  return (
    <DashboardContext.Provider
      value={{
        userData,
        loading,
        alerts,
        notifications,
      }}
    >
      <Alert
        opened={alerts?.length >= 1}
        close={() => {
          setAlerts([]);
        }}
        alerts={alerts}
      />
      {loading ? DashboardLoader : children}
    </DashboardContext.Provider>
  );
};

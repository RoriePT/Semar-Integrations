import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AlertType, NotificationType } from "../types/enums";

// Convert frontend userType to backend format
const getBackendUserType = (type: string) => {
  switch (type) {
    case "UPI Vendor":
      return "UpiVendor";
    case "Member":
      return "Member";
    case "Merchant":
      return "Merchant";
    case "Sub-Merchant":
      return "SubMerchant";
    case "Agent":
      return "Agent";
    case "Super Admin":
      return "SuperAdmin";
    case "Sub Admin":
      return "SubAdmin";
    default:
      return type;
  }
};

const useSocket = (
  url = import.meta.env.VITE_SOCKET_BASE_URL,
  { userId, userType, addNotification, addAlert }
) => {
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef(userId);
  const userTypeRef = useRef(userType);

  // Update refs when props change
  useEffect(() => {
    userIdRef.current = userId;
    userTypeRef.current = userType;
  }, [userId, userType]);

  useEffect(() => {
    if (!userId || !url) return;

    // Initialize socket only once
    if (!socketRef.current) {
      console.log("%c🔌 Initializing WebSocket connection...", "color: blue; font-size: 14px");
      console.log("URL:", url);
      console.log("User ID:", userId);
      console.log("User Type:", userType);
      
      socketRef.current = io(url, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity, // Keep trying to reconnect
        timeout: 20000,
      });

      // Listen to ALL events for debugging
      socketRef.current.onAny((eventName, ...args) => {
        console.log("%c📡 WebSocket Event:", "color: purple; font-size: 12px", eventName, args);
      });

      // Connection handlers
      socketRef.current.on("connect", () => {
        console.log("%c✅ CONNECTED", "color: green; font-size: 16px", socketRef.current?.id);
        setIsOnline(true);
        
        // Join room after connection is established
        const currentUserId = userIdRef.current;
        const currentUserType = userTypeRef.current;
        const backendUserType = getBackendUserType(currentUserType);
        
        console.log(`%c🚪 Joining room with userId: ${currentUserId}, userType: ${backendUserType}`, "color: blue; font-size: 14px");
        
        socketRef.current?.emit("joinRoom", { 
          userId: currentUserId, 
          userType: backendUserType 
        });
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("%c❌ DISCONNECTED", "color: red; font-size: 16px", reason);
        setIsOnline(false);
      });

      socketRef.current.on("userJoined", (socketId) => {
        console.log("%c✅ ROOM JOINED", "color: green; font-size: 16px", socketId);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("%c❌ CONNECTION ERROR", "color: red; font-size: 16px", error);
        setIsOnline(false);
      });

      socketRef.current.on("reconnect", (attemptNumber) => {
        console.log("%c🔄 RECONNECTED", "color: orange; font-size: 16px", "Attempt:", attemptNumber);
      });

      socketRef.current.on("reconnect_attempt", (attemptNumber) => {
        console.log("%c🔄 Reconnecting...", "color: orange; font-size: 14px", "Attempt:", attemptNumber);
      });

      socketRef.current.on("reconnect_error", (error) => {
        console.error("%c❌ RECONNECT ERROR", "color: red; font-size: 14px", error);
      });

      socketRef.current.on("reconnect_failed", () => {
        console.error("%c❌ RECONNECT FAILED", "color: red; font-size: 16px");
      });

      // Status update handler
      socketRef.current.on("statusUpdate", (data) => {
        console.log("📊 Status update:", data);
      });

      // Notification handlers
      socketRef.current.on("newNotification", (data) => {
        console.log("%c📬 NEW NOTIFICATION!", "color: blue; font-size: 20px");
        console.log(data);
        addNotification(data);
      });

      socketRef.current.on("newAlert", (data) => {
        console.log("%c🚨 NEW ALERT!", "color: red; font-size: 20px");
        console.log(data);
        addAlert(data);
      });
    }

    // Cleanup ONLY on unmount (not on dependency changes)
    return () => {
      if (socketRef.current) {
        console.log("%c🔌 Cleaning up WebSocket connection...", "color: orange; font-size: 14px");
        socketRef.current.emit("leaveRoom");
        socketRef.current.removeAllListeners(); // Remove all listeners
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const joinRoom = () => {
    const currentUserId = userIdRef.current;
    const currentUserType = userTypeRef.current;
    
    if (!currentUserId || !socketRef.current) return;
    
    const backendUserType = getBackendUserType(currentUserType);
    console.log(`🚪 Joining room with userId: ${currentUserId}, userType: ${backendUserType}`);
    
    socketRef.current.emit("joinRoom", { 
      userId: currentUserId, 
      userType: backendUserType 
    });
  };

  const changeStatus = (status) => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || !socketRef.current) return;
    socketRef.current.emit("changeStatus", status);
  };

  const leaveRoom = () => {
    const currentUserId = userIdRef.current;
    if (!currentUserId || !socketRef.current) return;
    console.log("🚪 Leaving room...");
    socketRef.current.emit("leaveRoom");
  };

  return {
    userId,
    isOnline,
    status,
    socket: socketRef.current,
  };
};

export default useSocket;

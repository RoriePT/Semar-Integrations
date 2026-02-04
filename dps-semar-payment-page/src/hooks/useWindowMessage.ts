import { useEffect } from "react";

const useWindowMessage = (onMessage) => {
  useEffect(() => {
    const handleMessage = (event) => {
      onMessage(event.data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onMessage]);
};

export default useWindowMessage;

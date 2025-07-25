import { useEffect, useState } from "react";
import { customTheme } from "../../App";
import { t } from "i18next";

function NetworkStatusAlert() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    !isOnline && (
      <div
        style={{
          textAlign: "center",
          position: "fixed",
          bottom: 10,
          width: "100%",
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: customTheme.palette.background.redDark,
            color: "white",
            padding: "10px",
            width: "80%",
            fontSize: "14px",
          }}
        >
          {t("errors.no_network")}
        </div>
      </div>
    )
  );
}

export default NetworkStatusAlert;

import { Button } from "@mui/material";
import { t } from "i18next";
import { customTheme } from "../App";
import { ArrowBack } from "../utils/constants/Icons";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigateTo = useNavigate();
  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          flex: 0,
          justifyContent: "left",
          alignItems: "flex-start",
          margin: "10px",
        }}
      >
        <Button
          size="large"
          onClick={() => navigateTo("/")}
          sx={{ padding: 0 }}
        >
          <ArrowBack
            backgroundColor={customTheme.palette.background.defaultBlue}
          />
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img style={{ width: "300px" }} src="/img/404-pages.png" alt="" />
        <span>{t("errors.wrong_page")}</span>
      </div>
    </div>
  );
};

export default NoPage;

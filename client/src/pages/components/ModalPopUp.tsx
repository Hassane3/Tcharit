import React, { MouseEventHandler } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { customTheme } from "../../App";
import { useTranslation } from "react-i18next";
import { Close } from "../../utils/constants/Icons";
import { BoxContainer, ModalContainer } from "./PopUp";

interface ModalPopUpProps {
  isQrModalOpen: boolean;
  qrModalStateHandler: (
    state: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}
const ModalPopUp = (props: ModalPopUpProps) => {
  const { isQrModalOpen, qrModalStateHandler } = props;

  const navigateTo = useNavigate();
  const { t } = useTranslation();

  const qrRedirection = (link: string) => {
    // setVisitedTank(tank);
    console.log("MapPage>qr link " + link);
    //Retrieve the last url character to get the number of the tank
    try {
      console.log(link);
      if (link.startsWith("http://q-r.to/tank")) {
        navigateTo("/tank/" + link.at(-1));
      } else {
        throw new Error("Not valide qr-code link");
      }
    } catch (error) {
      alert(
        "it seems that the qr-code isn't related to the cistern \n" + error
      );
    }
  };
  return (
    <ModalContainer
      open={isQrModalOpen}
      onClose={qrModalStateHandler(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <QrModalStyle
        backgroundColor={customTheme.palette.background.defaultWhite}
      >
        <Button
          onClick={qrModalStateHandler(false)}
          sx={{
            minWidth: "unset",
            position: "absolute",
            top: 20,
            right: 20,
            padding: 0,
            color: customTheme.palette.background.defaultBlue,
          }}
        >
          <Close backgroundColor={customTheme.palette.background.defaultBlue} />
          {/* <CloseRoundedIcon fontSize="large" /> */}
        </Button>
        <div>
          <Typography
            id="modal-modal-title"
            variant="h4"
            color={customTheme.palette.text.primary}
            style={{ textAlign: "center", margin: "4px" }}
          >
            {t("common.qrCode.scan_info")}
          </Typography>
          <QrScanner
            // setIsStartScan={setIsStartScan}
            handleQrRedirection={qrRedirection}
          />
        </div>
      </QrModalStyle>
    </ModalContainer>
  );
};

const QrModalStyle = styled(Box)<{ backgroundColor: string }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 30px;
  box-shadow: 24;
  margin: 10px;
  padding-top: 60px;
  overflow: hidden;
  > * {
    /* margin-bottom: 2px; */
  }
`;

export default ModalPopUp;

import React, { MouseEventHandler } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import { StyledEngineProvider } from "@mui/styled-engine-sc";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { customTheme } from "../../App";

interface ModalPopUpProps {
  isQrModalOpen: boolean;
  qrModalStateHandler: (
    state: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}
const ModalPopUp = (props: ModalPopUpProps) => {
  const { isQrModalOpen, qrModalStateHandler } = props;

  const navigateTo = useNavigate();
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
    <Modal
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
            display: "flex",
            alignSelf: "end",
            minWidth: "unset",
            color: customTheme.palette.background.blueDark,
          }}
        >
          <CloseRoundedIcon fontSize="large" />
        </Button>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          color={customTheme.palette.text.secondary}
          style={{ textAlign: "center", margin: "4px" }}
        >
          Scannez le qr code collé quelque part sur la citerne
        </Typography>
        <QrScanner
          // setIsStartScan={setIsStartScan}
          handleQrRedirection={qrRedirection}
        />
      </QrModalStyle>
    </Modal>
  );
};

const QrModalStyle = styled(Box)<{ backgroundColor: string }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 10px;
  box-shadow: 24;
  margin: 10px;
  overflow: hidden;
  > * {
    /* margin-bottom: 2px; */
  }
`;

export default ModalPopUp;

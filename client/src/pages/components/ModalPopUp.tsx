import React, { MouseEventHandler } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import QrScanner from "./QrScanner";
import { StyledEngineProvider } from "@mui/styled-engine-sc";

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
    navigateTo("/tank/" + link.at(-1));
  };
  return (
    <Modal
      open={isQrModalOpen}
      onClose={qrModalStateHandler(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <QrModalStyle>
        <Button
          onClick={qrModalStateHandler(false)}
          sx={{ display: "flex", alignSelf: "end", marginBottom: "2px" }}
        >
          <Close />
        </Button>
        <Typography id="modal-modal-title" variant="h6" component="h2">
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

const QrModalStyle = styled(Box)`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  border: "2px solid #000";
  background-color: antiquewhite;
  background-position: top;
  border: solid;
  box-shadow: 24;
  padding: 4px;
  > * {
    /* margin-bottom: 2px; */
  }
`;

export default ModalPopUp;

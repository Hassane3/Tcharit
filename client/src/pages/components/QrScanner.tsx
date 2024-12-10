import zIndex from "@mui/material/styles/zIndex";
import React, { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  setIsStartScan: (i: boolean) => void;
  handleQrRedirection: (qrLink: string) => void;
}
const QrScanner = (props: QrScannerProps) => {
  const { setIsStartScan, handleQrRedirection } = props;

  const previewStyle = {
    height: "auto",
    width: 320,
    top: 50,
    position: "relative",
    margin: 6,
  };

  return (
    <div>
      <QrReader
        constraints={{ facingMode: "environment" }}
        scanDelay={1000}
        containerStyle={previewStyle}
        videoId="scanVideo"
        onResult={(result, error) => {
          if (!!result) {
            handleQrRedirection(result.toString());
            setIsStartScan(false);
          }
          if (!!error) {
            // gerer l'erreur
            console.log("error => ", error);
          }
        }}
      />
    </div>
  );
};

export default QrScanner;

import zIndex from "@mui/material/styles/zIndex";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

export interface QrScannerProps {
  setQrLink: (qrLink: string) => void;
  setIsStartScan: (i: boolean) => void;
}
const QrScanner = (props: QrScannerProps) => {
  const { setQrLink, setIsStartScan } = props;
  const [result, setResult] = useState("No result");

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
          console.log("result >", result);
          if (result) {
            alert("result");
            setResult(result.toString());
            setQrLink(result.toString());
            setIsStartScan(false);
          }
          if (error) {
            // gerer l'erreur
            console.log("error => ", error);
          }
        }}
      />
      <p style={{ position: "relative", top: 30 }}>{result}</p>
    </div>
  );
};

export default QrScanner;

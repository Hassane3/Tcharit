import zIndex from "@mui/material/styles/zIndex";
import { width } from "@mui/system";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { OnResultFunction, QrReader } from "react-qr-reader";
import styled from "styled-components";
import { checkAndRequestCamera } from "../../utils/methods/methods";

export interface QrScannerProps {
  // setIsStartScan: (i: boolean) => void;
  handleQrRedirection: (qrLink: string) => void;
}

const QrScanner = (props: QrScannerProps) => {
  const { handleQrRedirection } = props;

  const animateQrBorder = (result: any) => {
    let qrBorder = document.getElementById("qrBorder");
    qrBorder && qrBorder.style.setProperty("animation", "scaleInOut ease 2s");
    setTimeout(() => {
      handleQrRedirection(result.toString());
      qrBorder?.style.removeProperty("animation");
    }, 2000);
  };
  useEffect(() => {
    checkAndRequestCamera();
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then((stream) => {
    //     console.log("Camera access granted");
    //     // You can now use the stream (e.g., assign it to a video element)
    //     stream.getTracks().forEach((track) => track.stop()); // optional: stop stream after test
    //   })
    //   .catch((err) => {
    //     console.error("Camera access denied:", err);
    //     // You can handle permission denial or unsupported device here
    //   });
  }, []);

  return (
    <div>
      <StyledQrReader
        constraints={{ facingMode: "environment" }}
        scanDelay={4000}
        videoId="scanVideo"
        ViewFinder={() => (
          <div
            id="qrBorder"
            style={{
              position: "absolute",
              zIndex: 1,
              width: "200px",
              height: "200px",
            }}
          >
            <span
              style={{
                position: "absolute",
                zIndex: 1,
                height: 40,
                width: 40,
                top: 0,
                left: 0,
                borderTop: "solid 10px",
                borderLeft: "solid 10px",
                borderColor: "white",
                borderTopLeftRadius: 5,
              }}
            ></span>
            <span
              style={{
                position: "absolute",
                zIndex: 1,
                height: 40,
                width: 40,
                top: 0,
                right: 0,
                borderTop: "solid 10px",
                borderRight: "solid 10px",
                borderColor: "white",
                borderTopRightRadius: 5,
              }}
            ></span>
            <span
              style={{
                position: "absolute",
                zIndex: 1,
                height: 40,
                width: 40,
                bottom: 0,
                left: 0,
                borderBottom: "solid 10px",
                borderLeft: "solid 10px",
                borderColor: "white",
                borderBottomLeftRadius: 5,
              }}
            ></span>
            <span
              style={{
                position: "absolute",
                zIndex: 1,
                height: 40,
                width: 40,
                bottom: 0,
                right: 0,
                borderBottom: "solid 10px",
                borderRight: "solid 10px",
                borderColor: "white",
                borderBottomRightRadius: 5,
              }}
            ></span>
          </div>
        )}
        onResult={(result, error) => {
          if (!!result) {
            animateQrBorder(result);
            // setTimeout(() => {
            //   handleQrRedirection(result.toString());
            // }, 2000);
          }
          if (!!error) {
            console.log("error => ", error);
          }
        }}
      />
    </div>
  );
};
const StyledQrReader = styled(QrReader)`
  height: 100%;
  width: 100%;
  position: "relative";
  overflow: hidden;
  > div {
    padding-top: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > div > video {
    height: 100%;
    width: 100%;
    position: relative !important;
  }
  @keyframes scaleInOut {
    0% {
      transform: scale(1);
    }
    10% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default QrScanner;

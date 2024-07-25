import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QrScanner = () => {
  const [result, setResult] = useState("No result");

  const previewStyle = {
    height: 240,
    width: 320,
  };
  return (
    <div>
      <QrReader
        constraints={{ facingMode: "environment" }}
        // scanDelay={500}
        onResult={(result, error) => {
          if (result) {
            alert("result");
            setResult(result.toString());
          }
          if (error) {
            alert("Error : " + error);
          }
        }}
      />
      <p>{result}</p>
    </div>
  );
};

export default QrScanner;

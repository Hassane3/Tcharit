import React from "react";
import { CookiesProvider } from "react-cookie";
import App from "./App";

const Root = (): JSX.Element => {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <App />
    </CookiesProvider>
  );
};

export default Root;

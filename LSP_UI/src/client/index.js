import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import serviceWorker from "./serviceWorker";
import App from "../shared/App";
require("regenerator-runtime");

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);
// serviceWorker();

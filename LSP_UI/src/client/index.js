import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import serviceWorker from "./serviceWorker";
import App from "../shared/App";

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("app")
);
// serviceWorker();

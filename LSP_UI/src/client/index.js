import React from "react";
import { hydrate } from "react-dom";
import Loadable, { preloadReady } from "react-loadable";
// import App from "../shared/App";
import { BrowserRouter } from "react-router-dom";

const App = Loadable({
  loader: () => import(/*webpackChunkName: "App"*/ "../shared/App"),
  loading: () => "loading...",
  modules: ["App"]
});

preloadReady().then(() => {
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("app")
  );
});

const nodemon = require("nodemon");
const path = require("path");
const paths = require("../config/paths");


const ssr = nodemon({
  script: path.resolve(paths.appServer, "render-server.main.js"),
  watch: [
    path.resolve(paths.appSrc, "render-server/*"),
    path.resolve(paths.appSrc, "shared/*")
  ]
});

["SIGINT", "SIGTERM"].forEach(sig => {
  ssr.on(sig, () => {
    ssr.exit();
  });
});

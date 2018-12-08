const nodemon = require("nodemon");
const path = require("path");
const paths = require("../config/paths");

const api = nodemon({
  script: path.resolve(paths.appServer, "data-server.main.js"),
  watch: path.resolve(paths.appSrc, "data-server/*")
});

["SIGINT", "SIGTERM"].forEach(sig => {
  api.on(sig, () => {
    api.exit();
  });
});

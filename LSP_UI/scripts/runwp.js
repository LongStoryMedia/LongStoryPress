const { exec } = require("child_process");
const chalk = require("chalk");
const path = require("path");
const paths = require("../config/paths");

exec(
  `echo ${
    process.env.PW
  } | sudo -S wp server --docroot=${path.resolve(
    paths.appRoot,
    "..",
    "LSP_WP"
  )} --allow-root`,
  {
    shell: "/bin/bash"
  },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    chalk`
    {blue stdout: ${stdout}}\n
    `;
    console.log(`stderr: ${stderr}`);
  }
);

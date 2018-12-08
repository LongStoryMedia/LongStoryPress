"use strict";

const fs = require("fs-extra");
const path = require("path");
const paths = require("./paths");

delete require.cache[require.resolve("./paths")];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV)
  throw new Error(
    "The NODE_ENV environment variable is required but was not specified."
  );

const dotenvFiles = [
  path.resolve(process.cwd(), `${process.env.LSP_URL}/.env`),
  path.resolve(process.cwd(), `${process.env.LSP_URL}/.env.${NODE_ENV}`),
  path.resolve(process.cwd(), `${process.env.LSP_URL}/.env.build.${NODE_ENV}`),
  path.resolve(process.cwd(), `.env.${NODE_ENV}`),
  paths.dotenv
].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv").config({ path: dotenvFile });
  }
});

const lsp = /^LSP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => lsp.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || "development",
        PUBLIC_URL: publicUrl
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;

const path = require("path");
const fs = require("fs-extra");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appRoot: appDirectory,
  appAssets: resolveApp("assets"),
  dotenv: resolveApp(".env"),
  appDir: path.resolve(process.env.LSP_URL),
  appDist: path.resolve(process.env.LSP_URL, "dist"),
  appDistServer: path.resolve(process.env.LSP_URL, "dist", "server"),
  appDistPublic: path.resolve(process.env.LSP_URL, "dist", "public"),
  appPublic: path.resolve(process.env.LSP_URL, "public"),
  appServer: path.resolve(process.env.LSP_URL, "server"),
  appScripts: resolveApp("scripts"),
  appIndexJs: resolveApp("src/index.js"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveApp("src/setupTests.js"),
  appNodeModules: resolveApp("node_modules")
};

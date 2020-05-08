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
  appStatic: path.resolve(process.env.LSP_URL, "src", "static"),
  globalStatic: resolveApp("src/shared/static"),
  appScripts: resolveApp("scripts"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  appNodeModules: resolveApp("node_modules")
};

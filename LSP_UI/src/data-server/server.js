import endpoint from "./endpoint";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import timeout from "connect-timeout";
import express from "express";
import path from "path";
import chalk from "chalk";

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
const devMode = process.env.NODE_ENV !== "production";

require("dotenv").config();
require("dotenv").config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

const app = express();

export default config => {
  app.use(helmet());
  app.use(compression());
  app.use(timeout(10000));

  const haltOnTimedout = (req, res, next) => {
    if (!req.timedout) next();
  };
  app.use(haltOnTimedout);

  app.use(cors());

  app.use(bodyParser.json({ strict: false }));

  app.use(
    "/lsp-api/login",
    endpoint({ type: "login", path: "jwt-auth/v1/token" })(config)
  );
  app.use(
    "/lsp-api/search",
    endpoint({
      type: "search",
      path: "wp/v2/search",
      chainAllOptions: false
    })(config)
  );
  app.use(
    "/lsp-api/media",
    endpoint({ type: "media", path: "lsp-api/v1/media" })(config)
  );
  app.use(
    "/lsp-api/pages",
    endpoint({ type: "pages", path: "lsp-api/v1/pages" })(config)
  );
  app.use(
    "/lsp-api/posts",
    endpoint({ type: "posts", path: "lsp-api/v1/posts" })(config)
  );
  app.use(
    "/lsp-api/tutorials",
    endpoint({ type: "tutorials", path: "lsp-api/v1/tutorials" })(config)
  );
  app.use(
    "/lsp-api/categories",
    endpoint({ type: "categories", path: "wp/v2/categories" })(config)
  );
  app.use(
    "/lsp-api/products",
    endpoint({ type: "products", path: "lsp-api/v1/products" })(config)
  );
  app.use(
    "/lsp-api/users",
    endpoint({ type: "users", path: "wp/v2/users", pwRequired: true })(config)
  );
  app.use(
    "/lsp-api/types",
    endpoint({ type: "types", path: "wp/v2/types" })(config)
  );
  app.use(
    "/lsp-api/gallerys",
    endpoint({ type: "gallerys", path: "lsp-api/v1/gallerys" })(config)
  );
  app.use(
    "/lsp-api/menus",
    endpoint({
      type: "menus",
      path: "lsp-api/v1/menus",
      chainAllOptions: false,
      byQuery: false
    })(config)
  );
  app.use(
    "/lsp-api/taxonomies",
    endpoint({ type: "taxonomies", path: "wp/v2/taxonomies" })(config)
  );
  app.use(
    "/lsp-api/settings",
    endpoint({ type: "settings", path: "lsp-api/v1/settings" })(config)
  );
  app.use(
    "/lsp-api",
    endpoint({ type: "root", path: "/", chainAllOptions: false })(config)
  );

  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  if (process.env.NODE_ENV === "development") {
    app.use((err, req, res) => {
      res.status(err.status || 500).send(err);
      throw new Error(err)
    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500).send(err);
  });

  app.listen(config.port, config.api, () => {
    if (devMode)
      console.log(
        chalk`{bold.red API} is listening on port {cyan.underline ${
          config.port
        }}`
      );
  });
};

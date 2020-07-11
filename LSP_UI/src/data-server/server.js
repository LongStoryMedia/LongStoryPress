import endpoint from "./endpoint";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import chalk from "chalk";
import NodeCache from "node-cache";

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
const devMode = process.env.NODE_ENV !== "production";

require("dotenv").config();
require("dotenv").config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

const app = express();

export default (config) => {
  app.set("trust proxy", 1);
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(timeout(10000));
  app.use(cors());
  app.use(bodyParser.json({ strict: false }));

  app.use((req, res, next) => {
    if (!req.timedout) next();
  });

  app.use((req, res, next) => {
    const { lsp_header_payload, lsp_signature } = req.cookies;
    const token = [lsp_header_payload, lsp_signature].join(".");
    if (lsp_header_payload && lsp_signature) {
      res.cookie("lsp_header_payload", lsp_header_payload, {
        secure: devMode ? false : true,
        sameSite: "strict",
        httpOnly: false,
        expires: new Date(Date.now() + 900000),
      });
      req.headers["Authorization"] = `Bearer ${token}`;
    }
    next();
  });

  app.use(
    "/lsp-api/login",
    endpoint({
      type: "login",
      path: "jwt-auth/v1/token",
      chainAllOptions: false,
    })(config)
  );
  app.use(
    "/lsp-api/search",
    endpoint({
      type: "search",
      path: "wp/v2/search",
      chainAllOptions: false,
    })(config, new NodeCache({ stdTTL: 60 * 5 }))
  );
  app.use(
    "/lsp-api/media",
    endpoint({ type: "media", path: "lsp-api/v1/media" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/pages",
    endpoint({ type: "pages", path: "lsp-api/v1/pages" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/posts",
    endpoint({ type: "posts", path: "lsp-api/v1/posts" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/tutorials",
    endpoint({ type: "tutorials", path: "lsp-api/v1/tutorials" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/categories",
    endpoint({ type: "categories", path: "wp/v2/categories" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/tags",
    endpoint({ type: "tags", path: "wp/v2/tags" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/products",
    endpoint({ type: "products", path: "lsp-api/v1/products" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/users",
    endpoint({ type: "users", path: "wp/v2/users", pwRequired: true })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/types",
    endpoint({ type: "types", path: "wp/v2/types" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/galleries",
    endpoint({ type: "galleries", path: "lsp-api/v1/galleries" })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );
  app.use(
    "/lsp-api/menus",
    endpoint({
      type: "menus",
      path: "lsp-api/v1/menus",
      chainAllOptions: false,
      byQuery: false,
    })(config, new NodeCache({ stdTTL: 60 * 60 * 24 * 365 }))
  );
  app.use(
    "/lsp-api/settings",
    endpoint({
      type: "settings",
      path: "lsp-api/v1/settings",
      chainAllOptions: false,
    })(config, new NodeCache({ stdTTL: 60 * 60 * 24 }))
  );
  app.use(
    "/lsp-api",
    endpoint({ type: "root", path: "/", chainAllOptions: false })(
      config,
      new NodeCache({ stdTTL: 60 * 5 })
    )
  );

  app.use("/lsp-api/flushcache", (req, res) => {
    new NodeCache().flushAll();
    res.json("cache flushed");
  });

  app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  if (process.env.NODE_ENV === "development") {
    app.use((err, req, res) => {
      res.status(err.status || 500).send(err);
      throw new Error(err);
    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500).send(err);
  });

  app.listen(config.port, config.api, () => {
    if (devMode)
      console.log(
        chalk`{bold.red API} is listening on port {cyan.underline ${config.port}}`
      );
  });
};

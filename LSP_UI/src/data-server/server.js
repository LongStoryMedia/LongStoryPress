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
import secret from "LSP/utils/secret";

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
const devMode = process.env.NODE_ENV !== "production";

require("dotenv").config();
require("dotenv").config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

secret();

const app = express();

export default config => {
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
    console.log(req.cookies);
    console.log(res.headers);
    next();
  });
  app.use("/login", (req, res) => {
    fetch(`${config.url}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        Cache: "no-cache"
      }),
      body: JSON.stringify({
        password: req.body.password,
        username: req.body.username
      }),
      credentials: "include"
    })
      .then(r => r.json())
      .then(r => {
        res
          .cookie(
            "lsp_header_payload",
            r.token.slice(0, r.token.lastIndexOf(".")),
            {
              secure: false,
              sameSite: "strict",
              httpOnly: false,
              domain: "localhost"
            }
          )
          .cookie("lsp_signature", r.token.split(".").pop(), {
            secure: false,
            sameSite: "strict",
            httpOnly: true,
            domain: "localhost"
          })
          .end();
        // .json({ ...r, status: req.body.status });
      })
      .catch(err => res.json({ message: err }));
  });
  app.use(
    "/search",
    endpoint({
      type: "search",
      path: "wp/v2/search",
      chainAllOptions: false
    })(config)
  );
  app.use(
    "/media",
    endpoint({ type: "media", path: "lsp-api/v1/media" })(config)
  );
  app.use(
    "/pages",
    endpoint({ type: "pages", path: "lsp-api/v1/pages" })(config)
  );
  app.use(
    "/posts",
    endpoint({ type: "posts", path: "lsp-api/v1/posts" })(config)
  );
  app.use(
    "/tutorials",
    endpoint({ type: "tutorials", path: "lsp-api/v1/tutorials" })(config)
  );
  app.use(
    "/categories",
    endpoint({ type: "categories", path: "wp/v2/categories" })(config)
  );
  app.use(
    "/products",
    endpoint({ type: "products", path: "lsp-api/v1/products" })(config)
  );
  app.use(
    "/users",
    endpoint({ type: "users", path: "wp/v2/users", pwRequired: true })(config)
  );
  app.use("/types", endpoint({ type: "types", path: "wp/v2/types" })(config));
  app.use(
    "/galleries",
    endpoint({ type: "galleries", path: "lsp-api/v1/galleries" })(config)
  );
  app.use(
    "/menus",
    endpoint({
      type: "menus",
      path: "lsp-api/v1/menus",
      chainAllOptions: false,
      byQuery: false
    })(config)
  );
  app.use(
    "/taxonomies",
    endpoint({ type: "taxonomies", path: "wp/v2/taxonomies" })(config)
  );
  app.use(
    "/settings",
    endpoint({ type: "settings", path: "lsp-api/v1/settings" })(config)
  );
  app.use(
    "",
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

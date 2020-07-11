import express from "express";
import fetch from "isomorphic-fetch";
import { deepFilter, objectToQueryString } from "LSP/utils/helpers";
import cacheService from "./cacheService";

const devMode = process.env.NODE_ENV === "development";

export default ({
  type,
  path,
  byQuery = true,
  pageNum = 1,
  startAt = 0,
  pageLength = 10,
  sort = "asc",
  sortBy = "id",
  pwRequired = false,
  chainAllOptions = true,
  fields = [
    "slug",
    "excerpt",
    "content",
    "title",
    "id",
    "name",
    "featured_media",
    "lsp_tags",
    "lsp_categories",
    "children",
    "price",
    "url",
    "items",
    "lsp_galleries",
    "lsp_gallery",
  ],
  tags,
  categories,
}) => (config, cache) => {
  const router = express.Router();
  const basePath = `${config.url}/wp-json`;

  const qs = (string) => {
    const sym = /\?/.test(string) ? "&" : "?";
    return `${sym}per_page=${pageLength}&page=${pageNum}&offset=${startAt}&order=${sort}&orderby=${sortBy}&_fields=${fields.join(
      ","
    )}${tags ? `lsp_tags_filter=${tags}` : ""}${
      categories ? `lsp_categories_filter=${categories}` : ""
    }`;
  };

  const sendIf = ({ item, prop, ifNot = void 0 }) => {
    const handleArray = (arr) =>
      arr.map((a) =>
        typeof a === "object" && !Array.isArray(a)
          ? responseObject(a)
          : Array.isArray(a)
          ? handleArray(a)
          : a
      );
    if (typeof item === "object" && prop && !Array.isArray(item))
      return item[prop]
        ? Array.isArray(item[prop])
          ? prop === "wp:featuredmedia" || prop === "author"
            ? handleArray(item[prop])[0]
            : handleArray(item[prop])
          : item[prop]
        : ifNot;
    else
      return item
        ? (Array.isArray(item) && item?.length > 0) || !Array.isArray(item)
          ? item
          : ifNot
        : ifNot;
  };

  const responseObject = (item) =>
    deepFilter({
      ...config.wpFields,
      id: sendIf({ item: item.id, ifNot: sendIf({ item: item.ID }) }),
      slug: sendIf({ item: item.slug }),
      name: sendIf({ item: item.name }),
      title: sendIf({ item: item.title, prop: "rendered" }),
      price: sendIf({ item: item.price }),
      url: sendIf({ item: item.url, ifNot: sendIf({ item: item.source_url }) }),
      content: sendIf({
        item: item.content,
        prop: "rendered",
        ifNot: sendIf({ item: item.items, ifNot: "" }),
      }),
      excerpt: sendIf({ item: item.excerpt, prop: "rendered" }),
      description: sendIf({ item: item.description }),
      categories: sendIf({
        item: item.lsp_categories,
        ifNot: sendIf({ item: item.lsp_product_categories }),
      }),
      tags: sendIf({
        item: item.lsp_tags,
        ifNot: sendIf({ item: item.lsp_product_tags }),
      }),
      featuredMedia: sendIf({
        item: item.featured_media,
        ifNot: 0,
      }),
      date: sendIf({ item: item.date }),
      modified: sendIf({ item: item.modified }),
      author: sendIf({ item: item.author }),
      mediaDetails: sendIf({ item: item.media_details }),
      mediaType: sendIf({ item: item.media_type }),
      mimeType: sendIf({ item: item.mime_type }),
      altText: sendIf({ item: item.alt_text, ifNot: "" }),
      caption: sendIf({ item: item.caption, prop: "rendered", ifNot: "" }),
      menuOrder: sendIf({ item: item.menu_order }),
      parent: sendIf({ item: item.parent }),
      meta: sendIf({ item: item.meta }),
      site: sendIf({ item: item.site }),
      contact: sendIf({ item: item.contact }),
      colors: sendIf({ item: item.colors }),
      lsp_galleries: sendIf({ item: item.lsp_galleries }),
      lsp_gallery: sendIf({ item: item.lsp_gallery }),
      children: sendIf({ item: item.children }),
    });

  const createResponse = async (req, data) => {
    if (pwRequired && !req.headers.authorization) {
      return { error: "Please login to access your content", status: 401 };
    }
    const responseObj = Array.isArray(data)
      ? data.map((item) => responseObject(item))
      : responseObject(data);
    let body =
      Array.isArray(responseObj) && req.params.id
        ? responseObj?.length > 1
          ? responseObj
          : responseObj[0]
          ? responseObj[0]
          : responseObj
        : responseObj;
    let head = {
      type,
      path,
      title: body.title ? body.title : type,
      slug: body.slug ? body.slug : type,
    };
    return { head, body };
  };

  const createRequest = async (
    req,
    res, //
    next,
    { pathname, method = "GET", body, headers },
    cb
  ) => {
    let queryKeys = Object.keys(req.query);
    for (let key of queryKeys) {
      req.query[`lsp_${key}_filter`] = req.query[key];
      delete req.query[key];
    }

    const slash = "/" === pathname[0] ? "" : "/";
    const query = objectToQueryString(req.query);
    const options = chainAllOptions ? qs(`${pathname}${query}`) : "";

    body = body ? JSON.stringify(body) : body;
    headers = new Headers({
      ...headers,
      "Content-Type": "application/json",
    });

    if (req.headers.authorization) {
      res.setHeader("Authorization", req.headers.authorization);
    }

    try {
      const reqUrl = [basePath, slash, pathname, query, options].join("");
      const request = await fetch(reqUrl, { method, headers, body });
      const response = await request.json();
      return cb(req, response);
    } catch (e) {
      console.error("error in createRequest (endpoint.js)\n" + e);
      return next(e);
    }
  };

  router
    .route("/")
    .get(async (req, res, next) =>
      cacheService(
        res,
        `${type}_${path}`,
        cache,
        await createRequest(req, res, next, { pathname: path }, createResponse)
      )
    )
    .post(async (req, res, next) => {
      if (type === "login") {
        const { password, username } = req.body;
        const data = await createRequest(
          req,
          res,
          next,
          {
            pathname: path,
            body: { password, username },
            method: "POST",
          },
          (req, data) => data
        );
        res
          .cookie(
            "lsp_header_payload",
            data.token.slice(0, data.token.lastIndexOf(".")),
            {
              secure: devMode ? false : true,
              sameSite: "strict",
              httpOnly: false,
            }
          )
          .cookie("lsp_signature", data.token.split(".").pop(), {
            secure: devMode ? false : true,
            sameSite: "strict",
            httpOnly: true,
          })
          .end();
      }
    });

  router
    .route(`/:id`)
    .get(async (req, res, next) =>
      cacheService(
        res,
        `${type}_${path}_${req.params.id}`,
        cache,
        type === "users" || req.params.id === "me"
          ? await createRequest(
              req,
              res,
              next,
              { pathname: "/wp/v2/users/me" },
              createResponse
            )
          : await createRequest(
              req,
              res,
              next,
              {
                pathname: byQuery
                  ? `${path}?slug=${req.params.id}`
                  : `${path}/${req.params.id}`,
              },
              createResponse
            )
      )
    );

  return router;
};

import express from "express";
import fetch from "isomorphic-fetch";

const devMode = process.env.NODE_ENV === "development";

export default ({
  type,
  path,
  body = {},
  byQuery = true,
  pageNum = 1,
  startAt = 0,
  pageLength = 100,
  sort = "asc",
  sortBy = "id",
  pwRequired = false,
  chainAllOptions = true
}) => config => {
  const router = express.Router();

  const isEmpty = obj =>
    !!(Object.entries(obj).length === 0 && obj.constructor === Object);

  const qs = string => {
    const sym = /\?/.test(string) ? "&" : "?";
    return `${sym}per_page=${pageLength}&page=${pageNum}&offset=${startAt}&order=${sort}&orderby=${sortBy}`;
  };

  const sendIf = ({ item, prop, ifNot = void 0 }) => {
    const handleArray = arr =>
      arr.map(
        a =>
          typeof a === "object" && !Array.isArray(a)
            ? responseObject(a)
            : Array.isArray(a)
              ? handleArray(a)
              : a
      );
    if (typeof item === "object" && prop && !Array.isArray(item)) {
      return item[prop]
        ? Array.isArray(item[prop])
          ? prop === "wp:featuredmedia" || prop === "author"
            ? handleArray(item[prop])[0]
            : handleArray(item[prop])
          : item[prop]
        : ifNot;
    } else return item ? item : ifNot;
  };

  const responseObject = item => ({
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
      ifNot: sendIf({ item: item.items, ifNot: "" })
    }),
    excerpt: sendIf({ item: item.excerpt, prop: "rendered" }),
    description: sendIf({ item: item.description }),
    categories: sendIf({ item: item.categories }),
    tags: sendIf({ item: item.tags }),
    featuredMedia: sendIf({
      item: item.featured_media,
      ifNot: 0
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
    children: sendIf({ item: item.children })
  });

  const createResponse = async (req, res, next, data) => {
    const responseObj = Array.isArray(data)
      ? data.map(item => responseObject(item))
      : responseObject(data);
    let response =
      Array.isArray(responseObj) && req.params.id
        ? responseObj.length > 1
          ? responseObj
          : responseObj[0]
            ? responseObj[0]
            : responseObj
        : responseObj;
    if (pwRequired && !req.headers.authorization)
      res.json({ error: "Please login to access your content", status: 401 });
    await res.json({
      head: {
        type,
        path,
        title: response.title ? response.title : type,
        slug: response.slug ? response.slug : type
      },
      body: response
    });
  };

  const createRequest = async (
    req,
    res,
    next,
    { path, method = "GET", body, headers }
  ) => {
    const slash = "/" === path[0] ? "" : "/";
    const query = isEmpty(req.query)
      ? ""
      : `${Object.keys(req.query)
          .map((key, i) => {
            const sym = i === 0 ? "?" : "&";
            return `${sym}${key}=${req.query[key]}`;
          })
          .join("")}`;
    const options = chainAllOptions ? qs(`${path}${query}`) : "";
    body = body ? JSON.stringify(body) : body;
    headers = new Headers({
      ...headers,
      "Content-Type": "application/json"
    });
    req.headers.authorization &&
      res.setHeader("Authorization", req.headers.authorization);
    try {
      const request = await fetch(
        `${config.url}/wp-json${slash}${path}${query}${options}`,
        { method, headers, body }
      );
      return await request.json();
    } catch (e) {
      return next(e);
    }
  };
  router
    .route("/")
    .get(async (req, res, next) => {
      const data = await createRequest(req, res, next, { path });
      return createResponse(req, res, next, data);
    })
    .post(async (req, res, next) => {
      if (type === "login") {
        const { password, username } = req.body;
        const data = await createRequest(req, res, next, {
          path,
          body: { password, username },
          method: "POST"
        });
        res
          .cookie(
            "lsp_header_payload",
            data.token.slice(0, data.token.lastIndexOf(".")),
            {
              secure: devMode ? false : true,
              sameSite: "strict",
              httpOnly: false
            }
          )
          .cookie("lsp_signature", data.token.split(".").pop(), {
            secure: devMode ? false : true,
            sameSite: "strict",
            httpOnly: true
          })
          .end();
      }
    });

  router.route(`/:id`).get(async (req, res, next) => {
    const pathname = byQuery
      ? `${path}?slug=${req.params.id}`
      : `${path}/${req.params.id}`;

    if (type === "users" || req.params.id === "me")
      res.json(await createRequest(req, res, next, { path: "/wp/v2/users/me" }));

    const data = await createRequest(req, res, next, { path: pathname });
    return createResponse(req, res, next, data);
  });

  router.route("/parent/:id").get(async (req, res, next) => {
    const parents = await createRequest(req, res, next, { path, body });
    const parentId = parents.filter(parent => parent.slug === req.params.id);
    if (!parentId || !parentId[0]) res.send().status(404);
    else {
      const data = await createRequest(req, res, next, {
        path: `${path}?parent=${parentId[0].id}`,
        body
      });
      return createResponse(req, res, next, data);
    }
  });
  return router;
};

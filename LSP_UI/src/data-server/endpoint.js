import express from "express";
import fetch from "isomorphic-fetch";

export default ({
  type,
  path,
  body = {},
  parameter = "slug",
  pageNum = 1,
  startAt = 0,
  pageLength = 10,
  sort = "asc",
  sortBy = "id",
  pwRequired = false,
  chainAllOptions = true
}) => config => {
  const router = express.Router();

  const qs = string => {
    const sym = /\?/.test(string) ? "&" : "?";
    return chainAllOptions
      ? `${sym}per_page=${pageLength}&page=${pageNum}&offset=${startAt}&order=${sort}&orderby=${sortBy}&_embed`
      : "";
  };

  const sendIf = ({ item, prop, ifNot = void 0 }) => {
    const handleArray = arr =>
      arr.map(
        a =>
          typeof a === "object" && !Array.isArray(a)
            ? wpObj(a)
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

  const wpObj = item => ({
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
      ifNot: sendIf({ item: item.items, ifNot: [] })
    }),
    excerpt: sendIf({ item: item.excerpt, prop: "rendered" }),
    description: sendIf({ item: item.description }),
    author: sendIf({ item: item.author }),
    categories: sendIf({ item: item.categories }),
    tags: sendIf({ item: item.tags }),
    featuredMedia: sendIf({
      item: item._embedded,
      prop: "wp:featuredmedia",
      ifNot: {}
    }),
    date: sendIf({ item: item.date }),
    modified: sendIf({ item: item.modified }),
    writtenBy: sendIf({ item: item._embedded, prop: "author" }),
    mediaDetails: sendIf({ item: item.media_details }),
    mediaType: sendIf({ item: item.media_type }),
    mimeType: sendIf({ item: item.mime_type }),
    altText: sendIf({ item: item.alt_text, ifNot: "" }),
    caption: sendIf({ item: item.caption, prop: "rendered", ifNot: "" }),
    menuOrder: sendIf({ item: item.menu_order }),
    parent: sendIf({ item: item.parent }),
    meta: sendIf({ item: item.meta }),
    custom: sendIf({ item: item.meta_box }),
    post: sendIf({ item: item.post }),
    page: sendIf({ item: item.page }),
    attachment: sendIf({ item: item.attachment }),
    product: sendIf({ item: item.product }),
    wp_block: sendIf({ item: item.wp_block }),
    lsp_product: sendIf({ item: item.lsp_product }),
    lsp_tutorial: sendIf({ item: item.lsp_tutorial }),
    lsp_slider: sendIf({ item: item.lsp_slider }),
    _links: sendIf({ item: item._links }),
    site: sendIf({ item: item.site }),
    contact: sendIf({ item: item.contact }),
    colors: sendIf({ item: item.colors }),
    lspSliders: sendIf({ item: item.lsp_sliders }),
    lspGallery: sendIf({ item: item.lsp_gallery, ifNot: [] })
  });

  const resJSON = async (req, res, next, data) => {
    const responseObj = Array.isArray(data)
      ? data.map(item => wpObj(item))
      : wpObj(data);
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
    await res.json(response);
  };

  const tryCatch = async (
    req,
    res,
    next,
    { path, method = "GET", body, headers, queryString = "" }
  ) => {
    const slash = "/" === path[0] ? "" : "/";
    body = body ? JSON.stringify(body) : body;
    headers = new Headers({
      ...headers,
      "Content-Type": "application/json"
    });
    req.headers.authorization &&
      res.setHeader("Authorization", req.headers.authorization);
    try {
      const request = await fetch(
        `${config.url}/wp-json${slash}${path}${qs(path)}`,
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
      const data = await tryCatch(req, res, next, { path });
      return resJSON(req, res, next, data);
    })
    .post(async (req, res, next) => {
      if (type === "login") {
        const { password, username } = req.body;
        const data = await tryCatch(req, res, next, {
          path,
          body: { password, username },
          method: "POST"
        });
        res.json(data);
      }
    });

  router.route(`/:id`).get(async (req, res, next) => {
    const pathname =
      parameter !== "id"
        ? `${path}?${parameter}=${req.params.id}`
        : `${path}/${req.params.id}`;

    if (type === "users" || req.params.id === "me")
      res.json(await tryCatch(req, res, next, { path: "/wp/v2/users/me" }));

    if (type === "menus") {
      const menus = await tryCatch(req, res, next, { path });
      const menuId = menus.filter(menu => menu.slug === req.params.id);
      if (!menuId || !menuId[0]) res.json(wpObj({}));
      else {
        const data = await tryCatch(req, res, next, {
          path: `${path}/${menuId[0].ID}`
        });
        return resJSON(req, res, next, data);
      }
    }
    const data = await tryCatch(req, res, next, { path: pathname });
    return resJSON(req, res, next, data);
  });

  router.route("/parent/:id").get(async (req, res, next) => {
    const parents = await tryCatch(req, res, next, { path, body });
    const parentId = parents.filter(parent => parent.slug === req.params.id);
    if (!parentId || !parentId[0]) res.send().status(404);
    else {
      const data = await tryCatch(req, res, next, {
        path: `${path}?parent=${parentId[0].id}`,
        body
      });
      return resJSON(req, res, next, data);
    }
  });
  return router;
};

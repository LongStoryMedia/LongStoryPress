import express from "express";
import fetch from "isomorphic-fetch";
import { objectIsEmpty } from "LSP/utils/helpers";

export default class Endpoint {
  constructor(settings, config){
    this.pageType = settings.pageType;
    this.path = settings.path;
    this.body = settings.body || {};
    this.byQuery = settings.byQuery || true;
    this.pageNum = settings.pageNum || 1;
    this.startAt = settings.startAt || 0;
    this.pageLength = settings.pageLength || 100;
    this.sort = settings.sort || "asc";
    this.sortBy = settings.sortBy || "id";
    this.pwRequired = settings.pwRequired || false;
    this.chainAllOptions = settings.chainAllOptions || true;
    this.config = config;
  }
  
  qs = string => {
    const sym = /\?/.test(string) ? "&" : "?";
    return `${sym}per_page=${this.pageLength}&page=${this.pageNum}&offset=${this.startAt}&order=${this.sort}&orderby=${this.sortBy}`;
  };

  sendIf = ({ item, prop, ifNot = void 0 }) => {
    const handleArray = arr =>
      arr.map(a =>
        typeof a === "object" && !Array.isArray(a)
          ? this.responseObject(a)
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

  responseObject = item => ({
    ...this.config.wpFields,
    id: this.sendIf({ item: item.id, ifNot: this.sendIf({ item: item.ID }) }),
    slug: this.sendIf({ item: item.slug }),
    name: this.sendIf({ item: item.name }),
    title: this.sendIf({ item: item.title, prop: "rendered" }),
    price: this.sendIf({ item: item.price }),
    url: this.sendIf({ item: item.url, ifNot: this.sendIf({ item: item.source_url }) }),
    content: this.sendIf({
      item: item.content,
      prop: "rendered",
      ifNot: this.sendIf({ item: item.items, ifNot: "" })
    }),
    excerpt: this.sendIf({ item: item.excerpt, prop: "rendered" }),
    description: this.sendIf({ item: item.description }),
    categories: this.sendIf({ item: item.categories }),
    tags: this.sendIf({ item: item.tags }),
    featuredMedia: this.sendIf({
      item: item.featured_media,
      ifNot: 0
    }),
    date: this.sendIf({ item: item.date }),
    modified: this.sendIf({ item: item.modified }),
    author: this.sendIf({ item: item.author }),
    mediaDetails: this.sendIf({ item: item.media_details }),
    mediaType: this.sendIf({ item: item.media_type }),
    mimeType: this.sendIf({ item: item.mime_type }),
    altText: this.sendIf({ item: item.alt_text, ifNot: "" }),
    caption: this.sendIf({ item: item.caption, prop: "rendered", ifNot: "" }),
    menuOrder: this.sendIf({ item: item.menu_order }),
    parent: this.sendIf({ item: item.parent }),
    meta: this.sendIf({ item: item.meta }),
    site: this.sendIf({ item: item.site }),
    contact: this.sendIf({ item: item.contact }),
    colors: this.sendIf({ item: item.colors }),
    lsp_galleries: this.sendIf({ item: item.lsp_galleries }),
    lsp_gallery: this.sendIf({ item: item.lsp_gallery }),
    children: this.sendIf({ item: item.children })
  });

  createResponse = async (req, res, data) => {
    const responseObj = Array.isArray(data)
      ? data.map(item => this.responseObject(item))
      : this.responseObject(data);
    let response =
      Array.isArray(responseObj) && req.params.id
        ? responseObj.length > 1
          ? responseObj
          : responseObj[0]
          ? responseObj[0]
          : responseObj
        : responseObj;
    if (this.pwRequired && !req.headers.authorization)
      res.json({ error: "Please login to access your content", status: 401 });
    await res.json({
      head: {
        pageType: this.pageType,
        path: this.path,
        title: response.title ? response.title : this.pageType,
        slug: response.slug ? response.slug : this.pageType
      },
      body: response
    });
  };

  createRequest = async (
    req,
    res,
    next,
    { path, method = "GET", body, headers }
  ) => {
    // console.log(Object.keys(req));
    // console.log(req.cookies);
    const slash = "/" === path[0] ? "" : "/";
    const query = objectIsEmpty(req.query)
      ? ""
      : `${Object.keys(req.query)
          .map((key, i) => {
            const sym = i === 0 ? "?" : "&";
            return `${sym}${key}=${req.query[key]}`;
          })
          .join("")}`;
    const options = this.chainAllOptions ? this.qs(`${path}${query}`) : "";
    body = body ? JSON.stringify(body) : body;
    headers = new Headers({
      ...headers,
      "Content-Type": "application/json"
    });
    req.headers.authorization &&
      res.setHeader("Authorization", req.headers.authorization);
    try {
      const request = await fetch(
        `${this.config.url}/wp-json${slash}${path}${query}${options}`,
        { method, headers, body }
      );
      return await request.json();
    } catch (e) {
      return next(e);
    }
  };

  getRouter(router) {
    router
      .route("/")
      .get(async (req, res, next) => {
        const data = await this.createRequest(req, res, next, { path: this.path });
        return this.createResponse(req, res, data);
      })
      .post(async (req, res, next) => {
        if (this.pageType === "login") {
          const { password, username } = req.body;
          console.log(req.body);
          const data = await this.createRequest(req, res, next, {
            path: this.path,
            body: { password, username },
            method: "POST"
          });
          // res.cookie("lsp_token", `Bearer ${data.token.slice(0, 10)}`, {
          //   // httpOnly: true,
          //   // secure: process.env.NODE_ENV === "development" ? false : true
          // });
          res.json(data);
        }
      });
  
    router.route(`/:id`).get(async (req, res, next) => {
      const pathname = this.byQuery
        ? `${this.path}?slug=${req.params.id}`
        : `${this.path}/${req.params.id}`;
  
      if (this.pageType === "users" || req.params.id === "me")
        res.json(
          await this.createRequest(req, res, next, { path: "/wp/v2/users/me" })
        );
  
      const data = await this.createRequest(req, res, next, { path: pathname });
      return this.createResponse(req, res, data);
    });
  
    router.route("/parent/:id").get(async (req, res, next) => {
      const parents = await this.createRequest(req, res, next, { path: this.path, body: this.body });
      const parentId = parents.filter(parent => parent.slug === req.params.id);
      if (!parentId || !parentId[0]) res.send().status(404);
      else {
        const data = await this.createRequest(req, res, next, {
          path: `${this.path}?parent=${parentId[0].id}`,
          body: this.body
        });
        return this.createResponse(req, res, data);
      }
    });
    return router;
  }
}

// export default ({
//   pageType,
//   path,
//   body = {},
//   byQuery = true,
//   pageNum = 1,
//   startAt = 0,
//   pageLength = 100,
//   sort = "asc",
//   sortBy = "id",
//   pwRequired = false,
//   chainAllOptions = true
// }) => config => {
//   const router = express.Router();

//   const qs = string => {
//     const sym = /\?/.test(string) ? "&" : "?";
//     return `${sym}per_page=${pageLength}&page=${pageNum}&offset=${startAt}&order=${sort}&orderby=${sortBy}`;
//   };

//   const sendIf = ({ item, prop, ifNot = void 0 }) => {
//     const handleArray = arr =>
//       arr.map(a =>
//         typeof a === "object" && !Array.isArray(a)
//           ? wpObj(a)
//           : Array.isArray(a)
//           ? handleArray(a)
//           : a
//       );
//     if (typeof item === "object" && prop && !Array.isArray(item)) {
//       return item[prop]
//         ? Array.isArray(item[prop])
//           ? prop === "wp:featuredmedia" || prop === "author"
//             ? handleArray(item[prop])[0]
//             : handleArray(item[prop])
//           : item[prop]
//         : ifNot;
//     } else return item ? item : ifNot;
//   };

//   const wpObj = item => ({
//     ...config.wpFields,
//     id: sendIf({ item: item.id, ifNot: sendIf({ item: item.ID }) }),
//     slug: sendIf({ item: item.slug }),
//     name: sendIf({ item: item.name }),
//     title: sendIf({ item: item.title, prop: "rendered" }),
//     price: sendIf({ item: item.price }),
//     url: sendIf({ item: item.url, ifNot: sendIf({ item: item.source_url }) }),
//     content: sendIf({
//       item: item.content,
//       prop: "rendered",
//       ifNot: sendIf({ item: item.items, ifNot: "" })
//     }),
//     excerpt: sendIf({ item: item.excerpt, prop: "rendered" }),
//     description: sendIf({ item: item.description }),
//     categories: sendIf({ item: item.categories }),
//     tags: sendIf({ item: item.tags }),
//     featuredMedia: sendIf({
//       item: item.featured_media,
//       ifNot: 0
//     }),
//     date: sendIf({ item: item.date }),
//     modified: sendIf({ item: item.modified }),
//     author: sendIf({ item: item.author }),
//     mediaDetails: sendIf({ item: item.media_details }),
//     mediaType: sendIf({ item: item.media_type }),
//     mimeType: sendIf({ item: item.mime_type }),
//     altText: sendIf({ item: item.alt_text, ifNot: "" }),
//     caption: sendIf({ item: item.caption, prop: "rendered", ifNot: "" }),
//     menuOrder: sendIf({ item: item.menu_order }),
//     parent: sendIf({ item: item.parent }),
//     meta: sendIf({ item: item.meta }),
//     site: sendIf({ item: item.site }),
//     contact: sendIf({ item: item.contact }),
//     colors: sendIf({ item: item.colors }),
//     lsp_galleries: sendIf({ item: item.lsp_galleries }),
//     lsp_gallery: sendIf({ item: item.lsp_gallery }),
//     children: sendIf({ item: item.children })
//   });

//   const createResponse = async (req, res, next, data) => {
//     const responseObj = Array.isArray(data)
//       ? data.map(item => wpObj(item))
//       : wpObj(data);
//     let response =
//       Array.isArray(responseObj) && req.params.id
//         ? responseObj.length > 1
//           ? responseObj
//           : responseObj[0]
//           ? responseObj[0]
//           : responseObj
//         : responseObj;
//     if (pwRequired && !req.headers.authorization)
//       res.json({ error: "Please login to access your content", status: 401 });
//     await res.json({
//       head: {
//         pageType,
//         path,
//         title: response.title ? response.title : pageType,
//         slug: response.slug ? response.slug : pageType
//       },
//       body: response
//     });
//   };

//   const createRequest = async (
//     req,
//     res,
//     next,
//     { path, method = "GET", body, headers }
//   ) => {
//     console.log(Object.keys(req));
//     console.log(req.cookies);
//     const slash = "/" === path[0] ? "" : "/";
//     const query = objectIsEmpty(req.query)
//       ? ""
//       : `${Object.keys(req.query)
//           .map((key, i) => {
//             const sym = i === 0 ? "?" : "&";
//             return `${sym}${key}=${req.query[key]}`;
//           })
//           .join("")}`;
//     const options = chainAllOptions ? qs(`${path}${query}`) : "";
//     body = body ? JSON.stringify(body) : body;
//     headers = new Headers({
//       ...headers,
//       "Content-Type": "application/json"
//     });
//     req.headers.authorization &&
//       res.setHeader("Authorization", req.headers.authorization);
//     try {
//       const request = await fetch(
//         `${config.url}/wp-json${slash}${path}${query}${options}`,
//         { method, headers, body }
//       );
//       return await request.json();
//     } catch (e) {
//       return next(e);
//     }
//   };
//   router
//     .route("/")
//     .get(async (req, res, next) => {
//       const data = await createRequest(req, res, next, { path });
//       return createResponse(req, res, next, data);
//     })
//     .post(async (req, res, next) => {
//       if (pageType === "login") {
//         const { password, username } = req.body;
//         const data = await createRequest(req, res, next, {
//           path,
//           body: { password, username },
//           method: "POST"
//         });
//         res.cookie("lsp_token", `Bearer ${data.token.slice(0, 10)}`, {
//           // httpOnly: true,
//           // secure: process.env.NODE_ENV === "development" ? false : true
//         });
//         res.json(data);
//       }
//     });

//   router.route(`/:id`).get(async (req, res, next) => {
//     const pathname = byQuery
//       ? `${path}?slug=${req.params.id}`
//       : `${path}/${req.params.id}`;

//     if (pageType === "users" || req.params.id === "me")
//       res.json(
//         await createRequest(req, res, next, { path: "/wp/v2/users/me" })
//       );

//     const data = await createRequest(req, res, next, { path: pathname });
//     return createResponse(req, res, next, data);
//   });

//   router.route("/parent/:id").get(async (req, res, next) => {
//     const parents = await createRequest(req, res, next, { path, body });
//     const parentId = parents.filter(parent => parent.slug === req.params.id);
//     if (!parentId || !parentId[0]) res.send().status(404);
//     else {
//       const data = await createRequest(req, res, next, {
//         path: `${path}?parent=${parentId[0].id}`,
//         body
//       });
//       return createResponse(req, res, next, data);
//     }
//   });
//   return router;
// };

import fetch from "isomorphic-fetch";
import regeneratorRuntime from "regenerator-runtime";
import { objectToQueryString } from "./helpers";

const apiRoot =
  process.env.NODE_ENV !== "production"
    ? `http://localhost:${process.env.LSP_DEV_PORT}/lsp-api`
    : `${process.env.LSP_URL_PROTOCOL}/lsp-api`;

const invokeApi = async ({
  path,
  method = "GET",
  headers = {},
  options = {},
  query = "",
  restArgs = {},
  body,
  noReturn = false,
  props,
}) => {
  const slash = "/" === path[0] ? "" : "/";
  body = body ? JSON.stringify(body) : body;
  headers = new Headers({
    ...headers,
    "Content-Type": "application/json",
  });
  const requestOptions = {
    method,
    headers,
    body,
    ...options,
  };
  const endpoint = apiRoot + slash + path + query + objectToQueryString(restArgs);
  try {
    const res = await fetch(endpoint, requestOptions);
    if (200 !== res.status) {
      if (401 === res.status && props) {
        return props.history.push(
          `/account/login?redirect=${props.location.pathname}`
        );
      }
      throw new Error(await res.text());
    }
    return noReturn ? "" : await res.json();
  } catch (e) {
    throw new Error(e);
  }
};
export default invokeApi;

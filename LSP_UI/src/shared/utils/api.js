import fetch from "isomorphic-fetch";

const apiRoot = process.env.NODE_ENV !== "production"
  ? `http://localhost:${process.env.LSP_DATA_PORT}/lsp-api`
  : `${process.env.LSP_URL_PROTOCOL}/lsp-api`

export const invokeApi = async ({
  path,
  method = "GET",
  headers = {},
  query = "",
  body,
  props
}) => {
  const slash = "/" === path[0] ? "" : "/";
  body = body ? JSON.stringify(body) : body;
  headers = new Headers({ ...headers });
  // auth() && headers.append("Authorization", auth().token);
  headers.append("Content-Type", "application/json");
  try {
    const res = await fetch(apiRoot + slash + path + query, {
      method,
      headers,
      body
    });
    if (200 !== res.status) {
      if (401 === res.status && props) {
        return props.history.push(
          `/account/login?redirect=${props.location.pathname}`
        );
      }
      throw new Error(await res.text());
    }
    return await res.json();
  } catch (e) {
    throw new Error(e);
  }
};

// export const auth = () => {
//   const token = cookies.get("lsp_token"),
//     username = cookies.get("lsp_user");
//   return token && { token, username };
// };

// export const login = async ({ username, password }) => {
//   const doLogin = await invokeApi({
//     path: "login",
//     method: "POST",
//     body: {
//       username: username,
//       password: password
//     }
//   });
//   if (doLogin && doLogin.token) {
//     cookies.set("lsp_token", doLogin.token, { maxAge: 36000, path: "/" });
//     cookies.set("lsp_user", doLogin.user.username, {
//       maxAge: 36000,
//       path: "/"
//     });
//   } else throw new Error("authentication failed");
//   return doLogin;
// };

// export const logout = async () => {
//   cookies.remove("lsp_token");
//   cookies.remove("lsp_user");
// };

export const findLocalItems = query => {
  let i,
    results = [];
  for (i in sessionStorage) {
    if (sessionStorage.hasOwnProperty(i)) {
      if (i.match(query) || (!query && typeof i === "string")) {
        let value = JSON.parse(sessionStorage.getItem(i));
        results.push({
          [i]: value
        });
      }
    }
  }
  return results;
};

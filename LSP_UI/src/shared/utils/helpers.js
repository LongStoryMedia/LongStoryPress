import React from "react";

/**
 *
 * @param {*} obj
 *
 * @returns {boolean} if the object is empty
 *
 */
export const isEmptyObject = (obj) =>
  !!(Object.entries(obj)?.length === 0 && obj.constructor === Object);

/**
 *
 * @param {object} obj
 *
 * @returns {object} a copy of the object without empty values
 *
 */
export const deepFilter = (obj) => {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    // don't filter falsey values like 0 and false
    if (typeof value === "undefined" || value === "" || value === null) {
      continue;
    }
    // this works for arrays too
    if (typeof value === "object") {
      const objValue = deepFilter(value);
      if (isEmptyObject(objValue)) {
        continue;
      }
    }
    newObj[key] = value;
  }
  return newObj;
};

export const objectToQueryString = (queryObject) =>
  !isEmptyObject(queryObject)
    ? `?${Object.keys(queryObject)
        .filter((key) => queryObject[key])
        .map((key) => `${key}=${queryObject[key]}`)
        .join("&")}`
    : "";

export const queryStringToObject = (queryString) => {
  let queryObject = {};
  queryString
    .split("?")
    .pop()
    .split("&")
    .forEach((keyValuePair) => {
      const keyValueArray = keyValuePair.split("=");
      queryObject = {
        ...queryObject,
        [keyValueArray[0]]: keyValueArray[1],
      };
    });
  return queryObject;
};

export const styleStringToObject = (styleString) => {
  const styleObject = {};
  const keys = styleString
    .split(/[:;]/)
    .filter((key, i) => i % 2 === 0 && !!key);
  const values = styleString
    .split(/[:;]/)
    .filter((value, i) => i % 2 === 1 && !!value);
  for (let i = 0; i < keys?.length; i++) {
    styleObject[keys[i].trim()] = values[i].trim();
  }
  return styleObject;
};

export const filterManifest = (manifest, test, tag) => {
  const isJS = "script" === tag;
  const onlySrc = !tag;
  const async = isJS ? "async" : "";
  const src = isJS ? "src" : "href";
  const rel = isJS ? "" : "rel='stylesheet'";
  return Object.keys(manifest)
    .map((asset) => {
      if (onlySrc) return manifest[asset];
      if (test.test(asset))
        return `<${tag} ${src}="${manifest[asset]}" ${async} ${rel}></${tag}>`;
      return "";
    })
    .join("");
};

export const renderMarkup = ({
  markup,
  i,
  className,
  style,
  HtmlElement = "span",
}) => (
  <HtmlElement
    key={i}
    className={className}
    dangerouslySetInnerHTML={{ __html: markup }}
    style={style}
  />
);

export const removeMarkup = (markup) =>
  /<.*?\/?>/gi.test(markup) ? markup.replace(/<.*?\/?>/gi, "").trim() : markup;

export function throttle(func, interval) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = false;
    };
    if (!timeout) {
      func.apply(context, args);
      timeout = true;
      setTimeout(later, interval);
    }
  };
}

import React from "react";

export const styleStringToObject = (styleString) => {
  const styleObject = {};
  const keys = styleString.split(/[:;]/).filter((key, i) => i % 2 === 0 && !!key);
  const values = styleString.split(/[:;]/).filter((value, i) => i % 2 === 1 && !!value);
  for (let i = 0; i < keys.length; i++) {
    styleObject[keys[i].trim()] = values[i].trim();
  }
  return styleObject;
}

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

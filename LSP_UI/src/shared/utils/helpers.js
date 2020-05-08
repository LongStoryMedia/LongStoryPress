import React, { PureComponent } from "react";

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

const createMarkup = (sanitaryMarkup) => ({ __html: sanitaryMarkup });

export const renderMarkup = ({ markup, i, className, style }) => (
  <span
    key={i}
    className={className}
    dangerouslySetInnerHTML={createMarkup(markup)}
    style={style}
  />
);

export const removeMarkup = (markup) =>
  /<.*?\/?>/gi.test(markup) ? markup.replace(/<.*?\/?>/gi, "").trim() : markup;

export class CorD extends PureComponent {
  state = {};
  async componentDidMount() {
    let C;
    try {
      C = await import(`Site/${this.props.pathToCustomFile}`);
    } catch (e) {
      C = await import(`LSP/${this.props.pathToDefaultFile}`);
    } finally {
      this.setState({ C: C.default });
    }
  }
  render() {
    const { C } = this.state;
    return C ? <C {...this.props} /> : null;
  }
}

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

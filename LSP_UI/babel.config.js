module.exports = function(api) {
  api.cache(true)
  const presets = ["@babel/preset-env", "@babel/preset-react"];
  const plugins = [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "react-loadable/babel"
  ];
  return {
    presets,
    plugins
  };
};

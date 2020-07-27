const server = require("./server");

require("dotenv").config();

const {
  LSP_HOST,
  LSP_DATA_PORT,
  LSP_URL,
  STRIPE_SK,
  LSP_WP_MAIN_SITE
} = process.env;

server({
  api: LSP_HOST,
  port: LSP_DATA_PORT,
  stripe: STRIPE_SK,
  url: `https://${LSP_URL.split(".")[0]}.${LSP_WP_MAIN_SITE}`
});
console.log(`listening on ${LSP_DATA_PORT}`);
import server from "./server";

const {
  LSP_HOST,
  LSP_DATA_PORT,
  LSP_ADMIN,
  STRIPE_SK
} = process.env;

export default server({
  api: LSP_HOST,
  port: LSP_DATA_PORT,
  stripe: STRIPE_SK,
  url: LSP_ADMIN
});

const {
  LSP_API_ROOT,
  LSP_DATA_PORT,
  LSP_DEV_PORT,
  LSP_HOST,
  LSP_LAN_IP,
  LSP_RENDER_PORT,
  LSP_STRIPE_PK,
  LSP_URL, // LSP_URL is PUBLIC_URL without protocol. also dir name
  PUBLIC_URL,
  NODE_ENV
} = process.env;

const devMode = NODE_ENV !== "production";

export default {
  apiRoot: devMode
    ? `http://${LSP_LAN_IP}:${LSP_DATA_PORT}/lsp-api`
    : LSP_API_ROOT,
  ssrRoot: devMode
    ? `http://localhost:${LSP_RENDER_PORT}`
    : PUBLIC_URL,
  publicURL: devMode
    ? `http://localhost:${LSP_DEV_PORT}`
    : PUBLIC_URL,
  apiPort: LSP_DATA_PORT,
  ssrPort: LSP_RENDER_PORT,
  host: LSP_HOST,
  url: LSP_URL,
  stripePublicKey: LSP_STRIPE_PK
};

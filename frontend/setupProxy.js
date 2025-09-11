const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://model-fuel-optimizer.apps.cluster-vmt2k.vmt2k.sandbox5468.opentlc.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "" // removes /api prefix when forwarding
      },
    })
  );
};

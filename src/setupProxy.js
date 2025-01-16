const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://kibou-registry-1.onrender.com",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": "/api",
      },
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader("origin", "https://kibou-registry-1.onrender.com");
      },
      onProxyRes: (proxyRes) => {
        proxyRes.headers["access-control-allow-origin"] = "*";
        proxyRes.headers["access-control-allow-methods"] =
          "GET,POST,PUT,DELETE,OPTIONS";
        proxyRes.headers["access-control-allow-headers"] =
          "Content-Type, Authorization";
      },
    }),
  );
};

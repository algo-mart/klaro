const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://kibou-registry-1.onrender.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api' // Don't add trailing slash
      },
      onProxyReq: (proxyReq, req) => {
        // Log detailed request information
        console.log('\nOutgoing Request:');
        console.log('Method:', req.method);
        console.log('Original URL:', req.originalUrl);
        console.log('Target URL:', `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
        console.log('Headers:', proxyReq.getHeaders());
      },
      onProxyRes: (proxyRes, req) => {
        // Log detailed response information
        console.log('\nIncoming Response:');
        console.log('Status:', proxyRes.statusCode);
        console.log('Headers:', proxyRes.headers);
        console.log('For Request:', req.originalUrl);
      },
      onError: (err, req, res) => {
        console.error('\nProxy Error:', {
          message: err.message,
          code: err.code,
          stack: err.stack
        });
      }
    })
  );
};

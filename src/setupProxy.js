const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'https://node.workgenix.live',
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};

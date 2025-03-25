const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/asgardeo',
    createProxyMiddleware({
      target: process.env.REACT_APP_ASGARDEO_RESOURCE_SERVER || 'https://api.asgardeo.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api/asgardeo': '', // Remove the '/api/asgardeo' prefix when forwarding the request
      },
      logLevel: 'debug',
    })
  );
};

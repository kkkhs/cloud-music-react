const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://121.40.200.148:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // 将请求路径中的 /api 前缀去除
      },
    }),
  );
};

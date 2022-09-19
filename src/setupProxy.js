const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware(
        "/api/**", {
        "target": "http://ec2-15-207-87-71.ap-south-1.compute.amazonaws.com:8081/",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "pathRewrite": { "^/api": "http://ec2-15-207-87-71.ap-south-1.compute.amazonaws.com:8081/api" }
    }));
};
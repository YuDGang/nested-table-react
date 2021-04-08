const path = require("path");
const PORT = process.env.PORT || 8000;

module.exports = {
	common: {
		htmlTemplatePath: path.resolve(__dirname, "../src/index.html"),
		dllPath: path.resolve(__dirname, "../public/vendor")
	},
	dev: {
		hot: true,
		assetsSubDirectory: "static",
		assetsPublicPath: "/",
		proxyTable: {
			"/mock": {
				"target": "http://127.0.0.1:7001",
				"changeOrigin": true,
				"pathRewrite": {
					"^/mock": "/mock"
				}
			}
		},
		host: "0.0.0.0",
		port: PORT,
		autoOpenBrowser: true,
		devtool: "eval-source-map"
	},
	build: {
		assetsRoot: path.resolve(__dirname, "../dist"),
		assetsSubDirectory: "static",
		assetsPublicPath: "/static-liubo/",
		devtool: "source-map"
	}
};

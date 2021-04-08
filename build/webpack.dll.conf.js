const path = require("path");
const webpack = require("webpack");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const outpath = "../public/vendor";

const vendors = [
	"react",
	"react-dom"
];

module.exports = {
	mode: "production",
	entry: {
		vendor: vendors
	},
	output: {
		path: path.resolve(__dirname, outpath),
		filename: "[name].js",
		library: "[name]_library"
	},
	plugins: [
		new webpack.DllPlugin({
			name: "[name]_library",
			path: path.resolve(__dirname, outpath, "vendor_manifest.json"),
			context: __dirname
		})
		// new BundleAnalyzerPlugin({
		// 	analyzerMode: 'static'
		// })
	],
	devtool: false
};

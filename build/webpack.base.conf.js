const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = require("./config");
const utils = require("./utils");
const devMode = process.env.SYS_ENV !== "production";

const resolve = dir => {
	return path.join(__dirname, "..", dir);
};

module.exports = {
	cache: true,
	context: path.resolve(__dirname, "../"),
	entry: {
		app: "./src/main.js"
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				antdUI: {
					name: "antdUI",
					priority: 100,
					test: /(antd)/,
					minChunks: 3,
					reuseExistingChunk: true
				}
			}
		}
	},
	plugins: [
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: path.resolve(__dirname, "../public/vendor/vendor_manifest.json")
		}),
		new webpack.DefinePlugin({
			"process.env": JSON.stringify(process.env)
		}),
		new webpack.ProvidePlugin({
			React: "react"
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		path: config.build.assetsRoot,
		filename: "[name].[hash].js"
	},
	resolve: {
		extensions: [".js", ".json"],
		alias: {
			"@": resolve("src")
		}
	},
	externals: {

	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader?cacheDirectory=true"
				}
			},
			{
				test: /\.css$/,
				use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader"
					// 'postcss-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					devMode ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "less-loader",
						options: {
							javascriptEnabled: true,
							modules: true,
							localIndexName: "[name]__[local]___[hash:base64:5]"
							// modifyVars: {
							// 	hack: 'true; @import "~@tntd/antd-cover/tnt.less";'
							// 	// hack: 'true; @import \'~@/theme.less\';'
							// }
						}
					}
					// 'postcss-loader'
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: devMode ? utils.assetsPath("img/[name].[ext]") : utils.assetsPath("img/[name].[hash:7].[ext]")
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: devMode ? utils.assetsPath("media/[name].[ext]") : utils.assetsPath("media/[name].[hash:7].[ext]")
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: devMode ? utils.assetsPath("fonts/[name].[ext]") : utils.assetsPath("fonts/[name].[hash:7].[ext]")
				}
			}
		]
	}
};

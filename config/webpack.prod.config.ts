import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

const config: webpack.Configuration = {
	mode: 'production',
	entry: './src/index.tsx',
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: '[name].[contenthash].js',
		publicPath: '',
		assetModuleFilename: 'images/[hash][ext]'
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/i,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.png/,
				type: 'asset/resource'
			}
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
	},
	plugins: [
		new HtmlWebpackPlugin( {
			template: 'src/index.html',
		} ),
		new ForkTsCheckerWebpackPlugin( {
			async: false,
		} ),
		new ESLintPlugin( {
			extensions: [ 'js', 'jsx', 'ts', 'tsx' ],
		} ),
		new CleanWebpackPlugin(),
		new NodePolyfillPlugin()
	],
};

export default config;

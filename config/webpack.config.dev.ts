import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import common from './webpack.config.common';

const config: webpack.Configuration = webpackMerge( common, {
	mode: 'development',
	plugins: [
		new HtmlWebpackPlugin( {
			template: 'src/index.html',
		} ),
		new webpack.HotModuleReplacementPlugin(),
		new ForkTsCheckerWebpackPlugin( {
			async: false
		} ),
		new ESLintPlugin( {
			extensions: [ 'js', 'jsx', 'ts', 'tsx' ],
		} ),
		new NodePolyfillPlugin()
	],
	devtool: 'inline-source-map'
} );

export default config;

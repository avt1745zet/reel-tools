import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

const config: webpack.Configuration = {
	mode: 'development',
	output: {
		publicPath: '/',
	},
	entry: './src/index.tsx',
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
			}
		],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
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
	devtool: 'inline-source-map',
};



export default config;

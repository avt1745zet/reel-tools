import webpack from 'webpack';
import path from 'path';

const config: webpack.Configuration = {
	entry: path.join( __dirname, '../src/index.tsx' ),
	output: {
		filename: '[name].[contenthash].js',
		path: path.join( __dirname, '../dist' ),
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ],
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
	}
};

export default config;

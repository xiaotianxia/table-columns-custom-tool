const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'development',

	entry: {
		index: './src/index.js'
	},

	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'table-columns-custom.min.js'
	},

	module: {
		rules: [
			{
		        test: /\.vue$/,
		        loader: 'vue-loader'
		    },

		    {
		        test: /\.css$/,
		        use: [
		        	{ loader: 'style-loader'},
		        	{ loader: 'css-loader'}
		        ]
		    },

		    {
		        test: /\.js$/,
		        loader: 'babel-loader',
		        include: [path.resolve(__dirname, './src')]
		    }
		]
	},

	plugins: [
		new uglify(),

		// new htmlPlugin({
  //           //是对html文件进行压缩
  //           minify: {
  //               removeAttributeQuotes: true  //removeAttrubuteQuotes是却掉属性的双引号。
  //           },

  //           hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            
  //           template:'./src/index.html' //是要打包的html模版路径和文件名称。
           
  //       }),

		// vue-loader插件
        new VueLoaderPlugin()
	],

	devServer: {
		contentBase: path.resolve(__dirname, './dist'),

		host: 'localhost',

		compress: true,

		port: 8888
	}
}
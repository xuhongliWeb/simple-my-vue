const path = require('path')

let HtmlWebpackPlugin = require('html-webpack-plugin');

let CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js', // 入口文件
    output: {
        // 添加hash可以防止文件缓存，每次都会生成4位的hash串
        filename: 'bundle.[hash:4].js',
        path: path.resolve('dist') // 打包后的路径
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            }
        ],
    },
    plugins: [
        // 打包前先清空
        new CleanWebpackPlugin('dist'),
        // 通过new一下这个类来使用插件
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/index.html',
            hash: true, // 会在打包好的bundle.js后面加上hash串
        })
    ],
    devServer: {
        contentBase: './src',
        host: 'localhost',      // 默认是localhost
        port: 3000,             // 端口
        open: false,             // 自动打开浏览器
        hot: false               // 开启热更新
    }
}
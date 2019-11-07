const merge = require('webpack-merge')
// const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";

module.exports = {
    lintOnSave: false,
    //添加webpack配置
    configureWebpack: () => ({
        entry: `./src/entry-${target}.js`,
        devtool: 'source-map',
        target: TARGET_NODE ? "node" : "web",
        node: TARGET_NODE ? undefined : false,
        //服务端渲染使用node风格导出模块
        output: {
            libraryTarget: TARGET_NODE ? "commonjs2" : undefined
        },
        optimization: {
            splitChunks: {
                chunks: "async",
                minSize: 30000,
                minChunks: 2,
                maxAsyncRequests: 5,
                maxInitialRequests: 3
            }
        },
        // https://webpack.js.org/configuration/externals/#function
        // https://github.com/liady/webpack-node-externals
        // 外置化应用程序依赖模块。可以使服务器构建速度更快，
        // 并生成较小的 bundle 文件。
        // externals: nodeExternals({
        //     // 不要外置化 webpack 需要处理的依赖模块。
        //     // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
        //     // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
        //     whitelist: /\.css$/
        // }),
        plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
    }),
    chainWebpack: config => {
        config.module
            .rule("vue")
            .use("vue-loader")
            .tap(options => {
                merge(options, {
                    optimizeSSR: false
                });
            });
    }
}

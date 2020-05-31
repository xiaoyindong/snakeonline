const path = require('path');
const glob = require('glob');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const entry = {};

const html = [];

glob.sync('./src/pages/**/index.js').forEach(name => {
    const page = name.match(/^\.\/src\/pages\/(.*)\/index.js$/)[1];
    if (!page) {
        return;
    }
    entry[page] = path.resolve(name);
    html.push(
        new HtmlWebpackPlugin({
            template: './src/template.ejs',
            title: page,
            filename: `${page}.html`,
            chunks: [page]
        })
    )
})

module.exports = (mode = 'development') => ({
    mode,
    entry,
    output: {
        filename: '[name].js',
        path: __dirname + '/build',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    }
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 37.5,
                            remPrecision: 4
                        }
                    },
                    {
                        loader: 'less-loader'
                    },
                ],
                include: path.resolve('src'),
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            // require.resolve('@babel/preset-react'),
                            [
                                require.resolve('@babel/preset-env'),
                                {
                                    modules: false,
                                    useBuiltIns: 'usage'
                                }
                            ]
                        ],
                        plugins: [
                            ['import', { libraryName: "antd-mobile", style: 'css' }]
                        ]
                    }
                },
                include: path.resolve('src'),
            },
        ]
    },
    resolve: {
        extensions: ['.css', '.less', '.js', '.jsx',],
        alias: {
            "@": path.resolve("src"),
            "@component": path.resolve("src/components"),
            "@pages": path.resolve("src/pages"),
            "@services": path.resolve("src/services"),
            "@utils": path.resolve("src/utils"),
            "@route": path.resolve("src/utils/route"),
            "@global": path.resolve("src/global.less"),
        },
    },
    externals: {},
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require("cssnano"),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
            },
            canPrint: true
        }),
        ...html
    ],
    devServer: {
        // 根目录下dist为基本目录
        contentBase: path.join(__dirname, 'build'),
        // 自动压缩代码
        // compress: true,
        // 服务端口为3000
        port: 3000,
        // 自动打开浏览器
        open: true
    }
});
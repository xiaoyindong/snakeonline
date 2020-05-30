1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const entry = {};

const html = [];

// const dirlist = __dirname.split('/');

// const dirname = dirlist[dirlist.length - 1];

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
                            require.resolve('@babel/preset-react'),
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
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
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
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const {
    DefinePlugin,
} = require("webpack")
// const CopyPlugin = require("copy-webpack-plugin");
const config = require('./config')

module.exports = (env) => {
    const {
        REACT_ENV
    } = env
    const data = config[REACT_ENV]
    const isDev = REACT_ENV === 'dev'
    return {
        mode: data.mode,
        devtool: data.devServer,
        entry: {
            index: path.resolve(__dirname, './src/index.tsx'),
        },
        output: {
            filename: `js/[name]${isDev?'':'.[contenthash:8]'}.js`,
            path: path.resolve(__dirname, './dist'),
            clean: true,
            publicPath: '/',
            asyncChunks: true,
        },
        plugins: [
            // new CopyPlugin({
            //     patterns: [{
            //         from: path.resolve(__dirname, './public'),
            //         to: path.resolve(__dirname, './'),
            //         globOptions: {
            //             ignore: "**/index.html"
            //         }
            //     }]
            // }),
            new DefinePlugin({
                'process.env.REACT_ENV': JSON.stringify(REACT_ENV),
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, './public/index.html'),
            }),
            new MiniCssExtractPlugin({
                filename: `css/[name]${isDev?'':'.[contenthash:8]'}.css`
            }),
            ...env.analyzer ? [new BundleAnalyzerPlugin()] : [],
            ...REACT_ENV === 'release' ? [new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.js$|\.css$/,
                threshold: 10240,
                minRatio: 0.8, // 压缩率小于1才会压缩
                deleteOriginalAssets: false // 是否删除原资源
            })] : []
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '...'],
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        devServer: {
            hot: true,
            port: 10029,
            historyApiFallback: {
                index: '/'
            },
            open: ['/'],
            proxy: {
                '/api': {
                    target: data.proxy,
                    pathRewrite: {
                        '^/api': ''
                    },
                },
            },
            client: {
                overlay: {
                    errors: !isDev,
                    warnings: false,
                },
            }
        },
        optimization: {
            chunkIds: REACT_ENV === 'release' ? 'deterministic' : 'named',
            moduleIds: REACT_ENV === 'release' ? 'deterministic' : 'named',
            runtimeChunk: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    parallel: true, // 开启多进程
                    extractComments: true, //是否保留注释
                    terserOptions: {
                        format: {
                            comments: false
                        }
                    }
                })
            ],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    common: {
                        test: /[\\/]src[\\/]/,
                        name: 'common',
                        chunks: 'all',
                        minChunks: 2,
                    },
                    react: {
                        name: 'react',
                        test: module => /react|redux/.test(module.context),
                        chunks: 'initial',
                        priority: 11,
                        enforce: true,
                    },
                    antd: {
                        name: 'antd',
                        test: (module) => {
                            return /ant/.test(module.context);
                        },
                        chunks: 'initial',
                        priority: 11,
                        enforce: true,
                    },
                    utils3: {
                        name: 'utils3',
                        test: (module) => {
                            return /echarts|html2canvas|jspdf|prismjs/.test(module.context);
                        },
                        chunks: 'all',
                        priority: 11,
                        enforce: true,
                    }
                },
            },
        },
        module: {
            rules: [{
                test: /\.js?$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/,
            }, {
                test: /\.(tsx|ts)?$/,
                use: [
                    'babel-loader',
                    'ts-loader',
                ],
                exclude: /node_modules/,
            }, {
                test: /\.(less|css)$/i,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            }, {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[contenthash:8][ext][query]',
                    publicPath: '/',
                }
            }, {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[contenthash:8][ext][query]',
                    publicPath: '/',
                },
            }, ]
        }
    }
};
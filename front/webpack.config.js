// 额外配置，会和默认配置合并
// env下的配置会和其他配置合并，对应不同环境下的最终配置
const CONTEXT = "/edu2-lesson";
const path = require('path');
module.exports = {
    env: {
        development: {
            extraBabelOptions: {
                plugins: ['dva-hmr']
            }
        },
        production: {
            extraBabelOptions: {},
            cleanExclude: [ 'index.html','afterLoginWeixin.html','beforeLoginWeixin.html','jquery.min.js'],
            outputPath: '../src/main/resources/public'
        }
    },
    extraBabelOptions: {
        plugins: [
            [
                path.resolve(__dirname, './node_modules/@yo/babel-plugin-import/lib/index.js'),
                {
                    libraryName: '@mshare/mshareui',
                    libraryDirectory: 'es',
                    style: 'mshareui'
                }
            ]
        ]
    },
    alias: {
        components: './src/components',
        assets: './src/assets',
        styles: './src/styles',
        config: './src/config',
        utils: './src/utils',
        services: './src/services'
    },
    proxy: {
        '/mockApi': {
            target: 'http://192.168.0.62:3000/mock/132',
            pathRewrite: { '^/mockApi': '' }
        },
        // '/edu2-lesson/*': {
        //     target: 'http://192.168.0.62:3000/mock/238',
        // },
        '/edu2-lesson/*': {
            target: 'http://127.0.0.1:8080',
        },
        '/api': {
            target: 'http://www.prodenv.com/api',
            changeOrigin: true
        }
    },
    theme: './src/theme.js',
    port: 4014,
    publicPath: CONTEXT,
    // extraEntrys: {},//额外的入口
    extraHtmls: [
        {
            filename: 'beforeLoginWeixin.html',
            title: '微信登录之前入口页',
            inject: true,
            template: './src/pages/weLogin/beforeLoginWeixin.html',
            chunks: ['beforeLoginWeixin']
        },
        {
            filename: 'afterLoginWeixin.html',
            title: '微信登录之后入口页',
            inject: true,
            template: './src/pages/weLogin/afterLoginWeixin.html',
            chunks: ['afterLoginWeixin']
        }
    ],//额外的html页面，搭配extraEntrys使用
    // extraRules: [],//额外的规则
    // disableCSSModules: false,//是否开启css_modules
    // cssModulesExclude: [],//指定文件或文件不需要css_modules
    // publicPath: '/',//指定资源文件引用的目录 ，同webpack的publicPath
    // outputPath: '/',//用来配置打包生成的文件输出的位置，同webpack的outputPath
    // extraBabelOptions: {},//额外的babel选项
    // extraResolveExtensions: [],//额外的解析扩展
    // hash: true,//打包的文件名是否带hash
    // devtool: '#cheap-module-eval-source-map',//此选项控制是否生成，以及如何生成 source map
    // autoprefixer: {},//postcss的插件autoprefixer配置
    // proxy: {},//webpack-dev-server的proxy设置,用于代理接口请求
    // externals: {},//webpack的外部扩展，不会打包进源码中，同webpack的externals
    // library为生成的函数名称的输出，libraryTarget为控制 webpack 打包的内容是如何暴露的，同webpack的libraryTarget
    // library: '',//配合libraryTarget使用，同webpack的library
    // libraryTarget: 'var',
    // 同webpack中的webpack.DefinePlugin配置项，编译时期创建全局变量，该特性适用于开发版本同线上版本在某些常量上有区别的场景
    // define: {},
    // build的时候保留输出目录下不想被删除的文件夹或文件,shareui-kit版本需大于0.7.2;路径相对于打包完的路径
    // cleanExclude: ["./wxFront"],
    // sassOption: {},//sass-loader的配置
    // theme: '',//less-loader的theme配置的文件路径
    // MPA: true,//是否多入口项目
    // extraProvidePlugin: {},//自动加载模块，而不必到处 import 或 require
    // alias: {},//别名,让后续引用的地方减少路径的复杂度,同webpack的alias配置
    // isDve: false,//是否是在线表单项目或者dve项目
};

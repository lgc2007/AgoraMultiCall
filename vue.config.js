/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-07-16 17:20:35
 */
'use strict';
const path = require('path');
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = '测试demo'; // page title

const port = process.env.port || process.env.npm_config_port || 9600; // dev port

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // '/': {
      //   target: 'http://117.160.221.236:8087',
      //   changeOrigin: true,
      //   ws: false,
      //   pathRewrite: {
      //     '^/': '',
      //   },
      // },
      '/': {
        target: 'https://yzt.zsnetwork.com:8085',
        changeOrigin: true,
        ws: false,
        secure: false,
        headers: {
          Referer: 'https://yzt.zsnetwork.com:8085'
        },
        logLevel: 'debug',
        pathRewrite: {
          '^/': '',
        },
      },
    },
  },
  configureWebpack: {
    // 在webpack的name字段中提供标题，这样可以在index.html中访问它以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'));
    // config.module.rules.delete('svg'); // 重点:删除默认配置中处理svg

    config.module
      .rule('svgIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon'))
      .end()
      .use('svg-sprite-loader')
      // 一定要添加use
      .loader('svg-sprite-loader')
      .tap(options => {
        options = { symbolId: 'icon-[name]' };
        return options;
      }); // 原有的svg图像处理loader添加exclude
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon'))
      .end();
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 750, // UI设计稿的宽度
            unitPrecision: 3, // 转换后的精度，即小数点位数
            propList: [
              '*'
            ], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            landscapeUnit: 'vh', // 横屏时使用的单位
            landscapeWidth: 667, // 横屏时使用的视口宽度
            selectorBlackList: [], // 指定不转换为视窗单位的类名
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            // landscape: false, // 是否处理横屏情况
            exclude: /(\/|\\)(node_modules)(\/|\\)/, // 设置忽略文件，用正则做目录名匹配
          })
        ]
      }
    }
  }
};

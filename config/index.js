// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
// 配置build的配置
module.exports = {
  // build模式配置
  build: {
    env: require('./prod.env'),
    // build页面入门
    index: path.resolve(__dirname, '../dist/index.html'),
    // build输出文件夹路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 子文件夹名称
    assetsSubDirectory: 'static',
    // build项目路径
    assetsPublicPath: '/',
    // 生成模式sourceMap
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 是否开启gzip压缩
    productionGzip: false,
    // gzip压缩文件类型
    productionGzipExtensions: [
      'js', 'css'
    ],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    port: 9000
  },
  // dev模式配置
  dev: {
    env: require('./dev.env'),
    // 测试端口
    port: 8080,
    // 是否自动开启浏览器
    autoOpenBrowser: true,
    // 子目录名称
    assetsSubDirectory: 'static',
    // 项目绝对路径
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    // 是否开启cssSourceMap
    cssSourceMap: false
  }
}

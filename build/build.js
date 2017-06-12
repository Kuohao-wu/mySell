require('./check-versions')()

process.env.NODE_ENV = 'production'
//异步任务的提示，相当于loading的效果
var ora = require('ora')
// 在nodejs中实现rm -rf命令的插件
var rm = require('rimraf')
var path = require('path')
// 终端颜色输出插件
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err)
    throw err
  webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err)
      throw err
    process.stdout.write(stats.toString({colors: true, modules: false, children: false, chunks: false, chunkModules: false}) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'))
  })
})

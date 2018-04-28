/**
 * webpack 构建基本配置
 */
let path = require('path');
let HappyPack = require('happypack');
let webpack = require('webpack');

let utils = require('./utils');
let vueLoaderConfig = require('./vue-loader.conf');

let outConfig = require('../config/output');

/**
 * 获取目录绝对路径
 *
 * @param dir 目录
 * @returns 目录绝对路径
 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  // 入口js文件
  /*entry: {
    app: './src/main.js'
  },*/
  entry: utils.getEntries("./src/modules/**/index.js"),

  // 构建输出配置
  output: {
    // 编译后输出目录
    path: outConfig.assetsRoot,
    // 编译后页面文件名格式
    filename: utils.assetsPath('scripts/[name]/[name].js'),
    // 编译chunk文件名格式
    chunkFilename: utils.assetsPath('scripts/[name]/[id].js'),
    // 静态资源相对引用路径
    publicPath: outConfig.assetsPublicPath
  },

  // 解析配置
  resolve: {
    // 自动解析以下扩展命的文件
    // 导入时不用跟扩展名，如 import '/routers'
    extensions: ['.js', '.vue', '.json'],

    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [resolve('node_modules')],

    // 别名配置
    alias: {
      '@': resolve('src'),
      '@mdus': resolve('src/modules'),
      '@assets': resolve('src/assets'),
      '@scripts': resolve('src/assets/scripts'),
      '@img': resolve('/distv3/images'),
      'variables': resolve('src/assets/scss/exports.scss'),
      '@static': resolve('static')
    }
  },

  // 忽略不打包组件
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'axios': 'axios',
    'moment': 'moment',
    'element-ui': 'ELEMENT',
    'lodash': '_',
  },

  // 模块配置
  module: {

    // 规则配置
    rules: [
      // 对js/vue文件进行eslint校验
      {
        test: /\.(js|vue)$/,
        //loader: 'eslint-loader',
        use: 'happypack/loader?id=eslint',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        exclude: '/node_modules/',
      },

      // vue-loader，参考：https://vue-loader.vuejs.org/zh-cn/
      // 允许vue文件导出为module
      {
        test: /\.vue$/,
        use: 'happypack/loader?id=vueloader',
        exclude: '/node_modules/',
        //loader: 'vue-loader',
        //options: vueLoaderConfig
      },

      // babel-loader，参考：https://github.com/babel/babel-loader
      // 允许对js文件进行语法转换
      {
        test: /\.js$/,
        //loader: 'babel-loader?cacheDirectory=true',
        use: 'happypack/loader?id=babel',
        exclude: '/node_modules/',
        include: [resolve('src'), resolve('test')]
      },

      // url-loader，参考：https://github.com/webpack-contrib/url-loader
      // 对图片文件路径进行MD5序列化，同时限定小于 10kb 将返回 DataUrl
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: '/node_modules/',
        use: 'happypack/loader?id=urlloader'
      },

      // url-loader，参考：https://github.com/webpack-contrib/url-loader
      // 对字体图标文件路径进行MD5序列化，同时限定小于 10kb 将返回 DataUrl
      {
        test: /\.(woff2?|eot|ttf|otf|woff)(\?.*)?$/,
        exclude: '/node_modules/',
        use: 'happypack/loader?id=fontsloader'
      }
    ]
  },

  plugins: [
    // 多线程Loader处理，通过id标识指定使用对应loader
    new HappyPack({
      id: 'eslint',
      loaders: [{
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }],
    }),
    new HappyPack({
      id: 'vueloader',
      loaders: [{
        loader: "vue-loader",
        options: vueLoaderConfig
      }],
    }),
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory=true'],
    }),
    new HappyPack({
      id: 'urlloader',
      loaders: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }],
    }),
    new HappyPack({
      id: 'fontsloader',
      loaders: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }],
    }),
    new webpack.ProvidePlugin({
      'window.Quill': 'quill'
    })
  ]
};

/**
 * 导出webpack配置
 */
//module.exports = webpackConfig;
module.exports = webpackConfig;

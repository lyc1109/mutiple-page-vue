/**
 * 构建工具辅助类
 */
let path = require('path');
let glob = require('glob');

let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

let outConfig = require('../config/output');

/**
 * 导出静态资源输出路径
 *
 * @param _path 父级路径
 * @returns 输出目录绝对路径
 */
exports.assetsPath = function (_path) {
  return path.posix.join("", _path)
};

/**
 * 导出css相关loader
 *
 * @param options 属性配置
 * @returns 返回css的loader，如sass\less\css等
 */
exports.cssLoaders = function (options) {
  options = options || {};

  // css loader 配置定义
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  };

  // 通过提取文本插件生成loader
  function generateLoaders(loader, loaderOptions) {
    let loaders = [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // 提取CSS到独立文件中（仅生产环境时生效）
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
};

/**
 * 为独立的css文件（在vue文件外面的）生成loader
 *
 * @param options 配置
 * @returns {Array}
 */
exports.styleLoaders = function (options) {
  let output = [];
  let loaders = exports.cssLoaders(options);
  for (let extension in loaders) {
    let loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output;
};


/**
 * 获取多页面入口文件配置
 *
 * @param entryGlobPath 模块入库文件路径
 */
exports.getEntries = function (globPath) {
  let entries = {}, tmp, pathname;

  glob.sync(globPath).forEach((entry) => {
    // 提取模块名称及入口文件后缀，过滤router.js文件
    //basename = path.basename(entry, path.extname(entry), 'router.js');
    // 计算正确模块名称
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(1, 1);
    entries[pathname] = entry;
  });

  //console.log(entries);

  // {'leasedevice': './src/modules/leasedevice/index.js', ...}
  return entries;
};

/**
 * 获取Html处理插件
 * 因为涉及到多页面处理，所以有多少个入口文件就有多少个插件
 * @param entries
 */
exports.getHtmlPlugins = function (entries, env) {
  let htmlPlugins = [];
  Object.keys(entries).forEach((page) => {
    let pluginConf = {
      filename: outConfig.htmlRoot + "/" + page + "/" + page + ".html",
      template: 'index.html',
      inject: true,
      chunks: ['manifest', 'vendor', page],
      chunksSortMode: 'dependency'
    };

    if(env === "production") {
      Object.assign(pluginConf, {
        /*minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },*/
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      })
    }

    htmlPlugins.push(
      new HtmlWebpackPlugin(pluginConf)
    );
  });

  return htmlPlugins;
};

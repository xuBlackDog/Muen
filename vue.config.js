const webpack = require("webpack");
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
      }),
    ],
  },
  chainWebpack: (config) => {
    // 一个规则里的 基础Loader
    // svg是个基础loader
    const svgRule = config.module.rule("svg");

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();

    // 添加要替换的 loader
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
  },

  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "/test_router" : "/",
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.weixin.qq.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      "/upload": {
        target: "https://cos.ap-shanghai.myqcloud.com", //请求地址
        changeOrigin: true, //true表示跨域
        secure: false,
        ws: true,
        logLevel: "debug",
        pathRewrite: {
          "^/upload": "",
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        views: "@/views",
        components: "@/components",
        assets: "@/assets",
        api: "@/api",
        router: "@/router",
        fonts: "@/fonts",
        store: "@/store",
        styles: "@/styles",
        icons: "@/icons",
        const: "@/const",
        utils: "@/utils",
      },
    },
  },
};

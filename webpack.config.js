const path = require("path");
const webpack = require("webpack");
const HtmlWebPuckPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minmize: true }
          }
        ]
      },
      {
        test: /\.js$/,
        // exclude: /node-modules/,
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/preset-env"] }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      // {
      //   test: /\.css$/,
      //   loaders: ["style-loader", "css-loader"]
      // },
      {
        test: /\.pug$/,
        use: ["pug-loader"]
      },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: ["file-loader"]
      // },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader"
            // options: {
            //   limit: 5000,
            //   name: "./misc/fonts/[name].[ext]"
            // }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.$": "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebPuckPlugin({
      template: "./src/index.pug",
      filename: "./index.html"
    }),
    new CopyWebpackPlugin([
      { from: "./src/misc/images", to: "./images" }
      // { from: 'other', to: 'public' },
    ]),
    new WriteFilePlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  resolve: {
    extensions: [".js", ".css", ".scss"],
    modules: ["src", "node_modules"]
  },

  devtool: "source-map"
};

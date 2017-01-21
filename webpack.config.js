var webpack = require("webpack");

module.exports = {
  devtool: "source-map",
  entry: ["babel-polyfill", "./web/static/js/app.js", "./web/static/css/app.css"],
  output: {
    path: "./priv/static",
    filename: "js/app.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader"
    }, {
      test: /\.css?$/,
      use: ["style-loader", "css-loader"]
    }]
  },
  resolve: {
    extensions: [
      ".js"
    ],
    modules: [
      "web/static/js",
      "node_modules",
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

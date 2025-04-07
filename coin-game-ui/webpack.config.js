const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    library: "coinFlip",
    libraryTarget: "umd",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, //ts   config file
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/, // for scss config
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Image config 
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
      {
        test: /\.(mp3|mp4)$/i, // Specifically match .mp3 files
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]", // Output MP3 files to an 'audio' folder
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 8009,
    hot: true,
    open: true,
    allowedHosts: "all",
  },
  plugins: [
    // .html file config
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // dotnev config 
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_API_ENDPOINT": JSON.stringify(
        process.env.REACT_APP_API_ENDPOINT || "http://localhost:3000"  
      ),
      "process.env.REACT_APP_MEDIA_PATH": JSON.stringify(
        process.env.REACT_APP_MEDIA_PATH || "http://localhost:3000/media"
      ),
      "process.env.REACT_APP_AUDIO_PATH": JSON.stringify(
        process.env.REACT_APP_AUDIO_PATH || "http://localhost:3000/static/coin-flip"
      ),
    }),
  ],
};

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const path = require("path");
const modeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");
const { helpers } = require("./src/globalHelpers");

// Plugin to process HTML
const htmlPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  template: path.join(__dirname, "./src/views/index.pug"),
  templateParameters: helpers,
});

const htmlPlugin_logo = new HtmlWebpackPlugin({
  filename: "playground/logo/index.html",
  template: path.join(__dirname, "./src/playground/logo.pug"),
  templateParameters: helpers,
});

const htmlPlugin_despre = new HtmlWebpackPlugin({
  filename: "noutati/despre/index.html",
  template: path.join(__dirname, "./src/noutati/despre.pug"),
  templateParameters: helpers,
});
const htmlPlugin_slack = new HtmlWebpackPlugin({
  filename: "noutati/slack/index.html",
  template: path.join(__dirname, "./src/noutati/slack.pug"),
  templateParameters: helpers,
});

const config = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge(
    {
      mode,
      node: {
        fs: "empty",
      },
      context: path.join(__dirname, "./src"),
      entry: {
        // main JS file
        app: "./index.js",
      },
      output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].js",
      },
      devServer: {
        contentBase: path.resolve(__dirname, "./src"),
      },
      // use sourcemaps, 'source-map' specifically
      devtool: "source-map",
      // different loaders are responsible for different file types
      module: {
        rules: [
          {
            test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
            use: {
              loader: "url-loader",
              options: { limit: 10000 },
            },
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: "svg-url-loader",
                options: { limit: 10000 },
              },
            ],
          },
          {
            test: /\.pug$/,
            loader: "pug-loader",
          },
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [],
                },
              },
            ],
          },
          {
            test: /\.(json|geojson)$/i,
            use: [{ loader: "json-loader" }],
          },
        ],
      },
      plugins: [
        htmlPlugin,
        htmlPlugin_logo,
        htmlPlugin_despre,
        htmlPlugin_slack,
        new webpack.ProgressPlugin(),
      ],
      resolve: {
        extensions: [".js", "*"],
        modules: [path.join(__dirname, "node_modules")],
      },
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};

module.exports = config;

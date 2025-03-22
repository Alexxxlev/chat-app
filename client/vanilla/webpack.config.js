import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import Dotenv from "dotenv-webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

// Фикс для __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем режим (по умолчанию - development)
const mode = process.env.NODE_ENV || "development";
const isDev = mode === "development"; // Проверяем, в каком режиме мы находимся

export default {
  mode: mode,
  entry: {
    main: "./src/js/main.js",
    style: "./src/css/style.css",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].js",
    assetModuleFilename: "assets/[name].[contenthash][ext]", // Путь для изображений и других ресурсов
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "js",
            target: "esnext",
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset/resource", // Обработка изображений
        generator: {
          filename: "assets/images/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      minify: !isDev,
      chunks: ["main", "style"],
      inject: "body",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      filename: "main.html",
      template: "./src/main.html",
      minify: !isDev,
      chunks: ["main", "style"],
      inject: "body",
      scriptLoading: "blocking",
    }),
    new FaviconsWebpackPlugin("./public/favicon.png"),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/style.[contenthash].css",
    }),
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "dist"),
          noErrorOnMissing: true, // Не выбрасывать ошибку, если нет файлов в public
        },
      ],
    }),
  ],
};

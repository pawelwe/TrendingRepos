const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env, argv) => {
  var isDevelopmentMode = argv.mode === 'development';

  var devtool = isDevelopmentMode ? 'eval-source-map' : 'nosources-source-map';
  return {
    mode: argv.mode,
    devtool: devtool,
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
        {
          // Apply rule for .sass, .scss or .css files
          test: /\.(sa|sc|c)ss$/,

          // Set loaders to transform files.
          // Loaders are applying from right to left(!)
          // The first loader will be applied after others
          use: [
            {
              // After all CSS loaders we use plugin to do his work.
              // It gets all transformed CSS and extracts it into separate
              // single bundled file
              loader: MiniCssExtractPlugin.loader,
            },
            {
              // This loader resolves url() and @imports inside CSS
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
            {
              // Then we apply postCSS fixes like autoprefixer and minifying
              loader: 'postcss-loader',
            },
            {
              // First we transform SASS to standard CSS
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          // Now we apply rule for images
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [
            {
              // Using file-loader for these files
              loader: 'file-loader',

              // In options we can set different things like format
              // and directory to save
              options: {
                outputPath: 'images',
              },
            },
          ],
        },
        {
          // Apply rule for fonts files
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          use: [
            {
              // Using file-loader too
              loader: 'file-loader',
              options: {
                outputPath: 'fonts',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'bundle.css',
      }),
    ],
    devServer: {
      historyApiFallback: true,
    },
  };
};

const PATH = require("path");
const HTML_WEBPACK_PLUGIN = require("html-webpack-plugin");

module.exports = {
    entry: ["babel-polyfill", "./src/js/index.js"],
    output: {
        path: PATH.resolve(__dirname, "dist"),
        filename: "js/bundle.js"
    },
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new HTML_WEBPACK_PLUGIN({
            filename: "index.html",
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
}
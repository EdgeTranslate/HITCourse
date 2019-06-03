"use strict";
const path = require("path");

module.exports = {
    entry: {
        background: "./src/background.js",
        "/contents/content": "./src/contents/content.js",
        // "/popup/popup": "./src/popup/popup.js",
        // "/options/options": "./src/options/options.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: "raw-loader"
            }
        ]
    }
};

const { ModuleFederationPlugin } = require("webpack").container;
const { merge } = require("webpack-merge");
const path = require("path");
const commonConfig = require("./webpack.common");
const packageJson = require("./package.json");

const domain = process.env.CUSTOMER_PRODUCTION_DOMAIN;

module.exports = () => {
  const prodConfig = {
    mode: "production",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.[name].[contenthash].js",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "invoice_manager_invoice_ui",
        filename: "remoteEntry.js",
        exposes: {
          "./InvoicesPage": "./src/Bootstrap",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};

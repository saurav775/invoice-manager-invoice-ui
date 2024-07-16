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
      publicPath: "https://invoice-manager-invoice-ui.vercel.app/",
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "invoice_manager_invoice_ui",
        filename: "remoteEntry.js",
        remotes: {
          invoice_manager_dashboard_ui:
            "invoice_manager_dashboard_ui@https://invoice-manager-dashboard-ui.vercel.app/remoteEntry.js",
          invoice_manager_customer_ui:
            "invoice_manager_customer_ui@https://invoice-manager-customer-ui.vercel.app/remoteEntry.js",
          invoice_manager_product_ui:
            "invoice_manager_product_ui@https://invoice-manager-product-ui.vercel.app/remoteEntry.js",
        },
        exposes: {
          "./InvoicesPage": "./src/Bootstrap",
        },
        shared: packageJson.dependencies,
      }),
    ],
  };

  return merge(commonConfig, prodConfig);
};

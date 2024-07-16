import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "invoice_manager_dashboard_ui/store";
import AppRoutes from "./AppRoutes";
import {
  INVOICE_ROOT,
  DEVELOPMENT,
} from "invoice_manager_customer_ui/constants";

const InvoiceElement = (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

const InvoiceElementWithRouter = (
  <Provider store={store}>
    <BrowserRouter basename="/">
      <AppRoutes />
    </BrowserRouter>
  </Provider>
);

// if (process.env.NODE_ENV === DEVELOPMENT) {
//   const rootNode = document.getElementById(INVOICE_ROOT);
//   const root = ReactDOM.createRoot(rootNode);
//   if (rootNode) {
//     root.render(InvoiceElementWithRouter);
//   }
// }

const InvoicesPage = () => {
  return InvoiceElement;
};

export default InvoicesPage;

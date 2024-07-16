import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const InvoiceTabular = lazy(() => import("./pages/InvoiceTabular"));
const InvoiceForm = lazy(() => import("./pages/InvoiceForm"));

export const routes = [
  {
    path: ":invoice_id",
    element: <InvoiceTabular isInvoiceDetails />,
    name: "InvoiceDetails",
  },
  {
    path: "add",
    element: <InvoiceForm />,
    name: "InvoiceForm",
  },
  {
    path: "/",
    element: <InvoiceTabular />,
    name: "InvoiceTabular",
  },
];

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map(({ path, element, name }) => (
        <Route key={path} element={element} path={path} name={name} />
      ))}
    </Routes>
  );
};

export default AppRoutes;

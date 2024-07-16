import React, { lazy } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Button from "invoice_manager_customer_ui/Button";
import Snackbar from "invoice_manager_customer_ui/Snackbar";
import Popup from "invoice_manager_customer_ui/Popup";
import {
  ADD,
  PRIMARY,
  INVOICES_PAGE,
  INVOICE_DETAILS_PAGE
} from "invoice_manager_customer_ui/constants";
import "../style/_invoicePage.scss";

const InvoiceDetails = lazy(() => import("../components/InvoiceDetails"));
const InvoiceTabularView = lazy(() =>
  import("../components/InvoiceTabularView")
);

const InvoiceTabular = (props) => {
  const { snackBarIsOpen, popupIsOpen, isInvoiceDetails = false } = props;

  return (
    <div className="invoice-page-wrp">
      <div className="invoice-header">
        <h1>{isInvoiceDetails ? INVOICE_DETAILS_PAGE : INVOICES_PAGE}</h1>
        <Link to="/invoices/add">
          <Button label={ADD} variant={PRIMARY} />
        </Link>
      </div>
      {isInvoiceDetails ? <InvoiceDetails /> : <InvoiceTabularView />}
      {snackBarIsOpen && <Snackbar />}
      {popupIsOpen && <Popup />}
    </div>
  );
};

const mapStateToProps = ({ snackBar, popup }) => ({
  snackBarIsOpen: snackBar.isOpen,
  popupIsOpen: popup.isOpen,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceTabular);

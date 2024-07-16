import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import TableUI from "invoice_manager_customer_ui/TableUI";
import Loader from "invoice_manager_customer_ui/Loader";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import { togglePopup } from "invoice_manager_customer_ui/actions/popupActions";
import {
  getInvoices,
  setSelectedInvoice,
  deleteInvoice,
  getInvoiceDetails,
} from "../store/actions/invoices.actions";
import { camelToSentenceCase } from "../utils";
import {
  INVOICE_DETAILS,
  NO_INVOICE_FOUND,
  INVOICE_TOTAL_AMOUNT,
} from "invoice_manager_customer_ui/constants";
import "../style/_invoiceDetails.scss";

const InvoiceDetails = (props) => {
  const { getInvoiceDetails, invoiceDetails, isLoading } = props;

  const location = useLocation();

  useEffect(() => {
    const pathnames = location.pathname.split("/");
    const invoice_id = pathnames[pathnames.length - 1];
    getInvoiceDetails(invoice_id);
  }, []);

  const columns = Object.keys(invoiceDetails?.[0]?.invoice_details?.[0] || {});
  const invoiceInfo = Object.keys(invoiceDetails?.[0] || {}).filter(
    (key) => key !== INVOICE_DETAILS
  );

  if (isLoading) return <Loader fixedLoader />;

  if (!isLoading && !invoiceDetails?.[0]?.invoice_details?.length)
    return <div className="invoice_details_empty">{NO_INVOICE_FOUND}</div>;
  
  return (
    <div className="invoice_details_container">
      <div className="invoice_details_content_wrp">
        {!!invoiceDetails?.length &&
          Object.keys(invoiceDetails[0])
            .filter(
              (key) => key !== INVOICE_DETAILS && key !== INVOICE_TOTAL_AMOUNT
            )
            .map((invoiceKey) => (
              <div className="invoice_details_content" key={invoiceKey}>
                <p>{camelToSentenceCase(invoiceKey)} :</p>
                <p>{invoiceDetails[0][invoiceKey]}</p>
              </div>
            ))}
      </div>
      <TableUI
        rows={invoiceDetails?.[0]?.invoice_details || []}
        columns={columns}
      />
      {!!invoiceDetails?.length &&
        INVOICE_TOTAL_AMOUNT in invoiceDetails[0] && (
          <div className="invoice_details_amount_wrp">
            <p>{camelToSentenceCase(INVOICE_TOTAL_AMOUNT)} : </p>
            <p>{invoiceDetails[0][INVOICE_TOTAL_AMOUNT]}</p>
          </div>
        )}
    </div>
  );
};

const mapStateToProps = ({ invoices }) => ({
  invoiceDetails: invoices.invoiceDetails,
  isLoading: invoices.isLoading,
});

const mapDispatchToProps = {
  getInvoiceDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetails);

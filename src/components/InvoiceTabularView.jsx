import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import TableUI from "invoice_manager_customer_ui/TableUI";
import Loader from "invoice_manager_customer_ui/Loader";
import { togglePopup } from "invoice_manager_customer_ui/actions/popupActions";
import {
  getInvoices,
  setSelectedInvoice,
  deleteInvoice,
} from "../store/actions/invoices.actions";
import {
  EDIT,
  DELETE,
  SECONDARY,
  RED,
  ARE_YOU_SURE_INVOICE_DELETION,
} from "invoice_manager_customer_ui/constants";

const InvoiceTabularView = (props) => {
  const {
    getInvoices,
    invoices,
    isLoading,
    setSelectedInvoice,
    togglePopup,
    deleteInvoice,
  } = props;

  const navigate = useNavigate();

  useEffect(() => {
    getInvoices();
  }, []);

  const columns = Object.keys(invoices?.[0] || {});

  const handleEditClick = (event, row) => {
    navigate("/invoices/add")
    setSelectedInvoice(row);
  };

  const handleDeleteClick = (event, row) => {
    const { invoice_id } = row;

    const handleInvoiceDeletion = () => {
      deleteInvoice(invoice_id);
    };

    togglePopup(
      true,
      ARE_YOU_SURE_INVOICE_DELETION,
      `${DELETE} (${invoice_id})`,
      handleInvoiceDeletion
    );
  };

  const actions = [
    {
      label: EDIT,
      handleClick: handleEditClick,
      variant: SECONDARY,
    },
    {
      label: DELETE,
      handleClick: handleDeleteClick,
      variant: RED,
    },
  ];

  if (isLoading) return <Loader fixedLoader />;

  return <TableUI rows={invoices} columns={columns} actions={actions} />;
};

const mapStateToProps = ({ invoices }) => ({
  invoices: invoices.invoices,
  isLoading: invoices.isLoading,
});

const mapDispatchToProps = {
  getInvoices,
  setSelectedInvoice,
  togglePopup,
  deleteInvoice,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceTabularView);

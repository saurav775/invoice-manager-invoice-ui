import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "invoice_manager_customer_ui/Button";
import Snackbar from "invoice_manager_customer_ui/Snackbar";
import Popup from "invoice_manager_customer_ui/Popup";
import CustomerForm from "invoice_manager_customer_ui/CustomerForm";
import ProductForm from "invoice_manager_product_ui/ProductForm";
import InvoiceFormFields from "../components/InvoiceFormFields";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import {
  CREATE_INVOICE_PAGE,
  ADD_NEW_CUSTOMER,
  ADD_NEW_PRODUCT,
} from "invoice_manager_customer_ui/constants";
import "../style/_invoicePage.scss";

const InvoiceForm = (props) => {
  const { snackBarIsOpen, popupIsOpen, toggleRightDrawer } = props;
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const handleCustomerAddClick = () => {
    setShowCustomerForm(true);
    setShowProductForm(false);
    toggleRightDrawer(true);
  };

  const handleProductAddClick = () => {
    setShowProductForm(true);
    setShowCustomerForm(false);
    toggleRightDrawer(true);
  };

  return (
    <div className="invoice-page-wrp">
      <div className="invoice-header">
        <h1>{CREATE_INVOICE_PAGE}</h1>
        <div className="create-btn-wrp">
          <Button
            label={ADD_NEW_CUSTOMER}
            handleClick={handleCustomerAddClick}
          />
          <Button label={ADD_NEW_PRODUCT} handleClick={handleProductAddClick} />
        </div>
      </div>
      <InvoiceFormFields />
      {showCustomerForm && <CustomerForm />}
      {showProductForm && <ProductForm />}
      {snackBarIsOpen && <Snackbar />}
      {popupIsOpen && <Popup />}
    </div>
  );
};

const mapStateToProps = ({ snackBar, popup }) => ({
  snackBarIsOpen: snackBar.isOpen,
  popupIsOpen: popup.isOpen,
});

const mapDispatchToProps = {
  toggleRightDrawer,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceForm);

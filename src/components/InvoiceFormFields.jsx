import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "invoice_manager_customer_ui/Loader";
import Button from "invoice_manager_customer_ui/Button";
import TableUI from "invoice_manager_customer_ui/TableUI";
import { getCustomers } from "invoice_manager_customer_ui/actions/customerActions";
import { getProducts } from "invoice_manager_product_ui/actions/productActions";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import useForm from "invoice_manager_customer_ui/hooks/useForm";
import {
  SAVE,
  PRODUCT_NAME,
  SUBMIT,
  CUSTOMER_NAME,
  ORDER_REQUIRED_BY_DATE,
  ORDER_STATUS,
  SELECT_CUSTOMER_NAME,
  SELECT_PRODUCT_NAME,
  SELECT_ORDER_REQUIRED_BY_DATE,
  SELECT_ORDER_STATUS,
  RECEIVED,
  COMPLETED,
  ADD,
  PLEASE_SELECT_PRODUCT,
  TOTAL_AMOUNT,
} from "invoice_manager_customer_ui/constants";
import {
  saveInvoice,
  getInvoiceDetails,
} from "../store/actions/invoices.actions";
import { currentDataInISOFormat } from "../utils";
import "../style/_invoiceForm.scss";

const propTypes = {};

const productValidationTypes = {
  customer_name: "required",
  order_required_by_date: "required",
};

const InvoiceFormFields = (props) => {
  const {
    saveInvoice,
    selectedInvoice,
    customers,
    products,
    getCustomers,
    getProducts,
    isLoading,
    getInvoiceDetails,
    invoice_details,
  } = props;
  const [formRef, formErrors, handleChange, handleFormSubmit] = useForm(
    productValidationTypes
  );

  const navigate = useNavigate();

  const {
    invoice_id: selectedInvoiceId,
    customer_id: selectedCustomerId = "",
    invoice_creation_timestamp: selectedInvoiceCreationTimestamp = "",
    order_required_by_date: selectedOrderRequiredByDate = "",
    order_status: selectedOrderStatus,
  } = selectedInvoice;

  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const selectedProductNameRef = useRef(null);

  const calculateInvoiceTotal = () =>
    invoiceDetails.reduce((acc, cv) => {
      acc += Number(cv.product_total_amount);
      return acc;
    }, 0);

  const handleInvoiceFormSubmit = (event) => {
    handleFormSubmit(event, (formData) => {
      const customer_name = formData.get("customer_name");
      const order_required_by_date = formData.get("order_required_by_date");
      const order_status = formData.get("order_status");
      const { customer_id } = customers.find(
        (customer) => customer.customer_name === customer_name
      );
      const invoice_total_amount = calculateInvoiceTotal();
      if (selectedInvoiceId)
        saveInvoice(
          customer_id,
          invoiceDetails,
          invoice_total_amount,
          selectedInvoiceCreationTimestamp,
          order_required_by_date,
          order_status,
          selectedInvoiceId
        );
      else
        saveInvoice(
          customer_id,
          invoiceDetails,
          invoice_total_amount,
          new Date().toISOString(),
          order_required_by_date,
          RECEIVED
        );
      if (!isLoading) navigate("/invoices");
    });
  };

  useEffect(() => {
    formRef?.current?.reset();
    getCustomers();
    getProducts();
    if (selectedInvoiceId) getInvoiceDetails(selectedInvoiceId);
  }, []);

  useEffect(() => {
    setProductOptions(products.map((product) => product.product_name));
  }, [products]);

  useEffect(() => {
    if (selectedInvoiceId) {
      setInvoiceDetails(invoice_details?.[0]?.invoice_details);
      const currentProductNames = invoice_details?.[0]?.invoice_details.map(invoice => invoice.product_name);
      const filteredProductOptions = productOptions.filter(
        (product_name) => !currentProductNames.includes(product_name)
      );
      setProductOptions(filteredProductOptions);
    }
  }, [invoice_details]);

  const handleAddClick = () => {
    const selectedProductValue = selectedProductNameRef?.current?.value;
    if (selectedProductValue) {
      const selectedProduct = products.find(
        ({ product_name }) => product_name === selectedProductValue
      );
      selectedProduct.product_qty = 1;
      selectedProduct.product_rate = selectedProduct.product_rate_per_item;
      selectedProduct.product_total_amount =
        selectedProduct.product_rate_per_item;
      setInvoiceDetails([...invoiceDetails, selectedProduct]);
      const filteredProductOptions = productOptions.filter(
        (product_name) => product_name !== selectedProduct.product_name
      );
      setProductOptions(filteredProductOptions);
    }
  };

  const handleQtyInputChange = (event, productName) => {
    const selectedProduct = products.find(
      ({ product_name }) => product_name === productName
    );
    selectedProduct.product_qty = event.target.value;
    selectedProduct.product_rate = selectedProduct.product_rate_per_item;
    selectedProduct.product_total_amount =
      selectedProduct.product_rate_per_item * event.target.value;
    const currentInvoiceDetails = [...invoiceDetails];
    const currentInvoiceIndex = currentInvoiceDetails.findIndex(
      (invoice) => invoice.product_id === selectedProduct.product_id
    );
    currentInvoiceDetails[currentInvoiceIndex] = selectedProduct;
    setInvoiceDetails(currentInvoiceDetails);
  };

  const {
    customer_name: customer_name_error,
    order_required_by_date: order_required_by_date_error,
  } = formErrors;

  const customerOptions = customers.map((customer) => customer?.customer_name);

  if (isLoading) return <Loader fixedLoader />;

  const defaultCustomerNameValue = selectedCustomerId
    ? customers.find((customer) => customer.customer_id === selectedCustomerId)?.customer_name
    : "";
  const defaultOrderRequiredByDate = selectedOrderRequiredByDate
    ? currentDataInISOFormat(selectedOrderRequiredByDate)
    : "";

  return (
    <form
      onSubmit={handleInvoiceFormSubmit}
      ref={formRef}
      className="invoice-form"
    >
      <div className="form-input-wrp">
        <div className="form-element">
          <label htmlFor="customer_name">{CUSTOMER_NAME}</label>
          <select
            name="customer_name"
            onChange={handleChange}
            defaultValue={defaultCustomerNameValue}
          >
            <option value="">{SELECT_CUSTOMER_NAME}</option>
            {customerOptions.map((customer_name, index) => (
              <option key={customer_name + index} value={customer_name}>
                {customer_name}
              </option>
            ))}
          </select>
          {!!customer_name_error && <span>{customer_name_error}</span>}
        </div>
        <div className="form-element">
          <label htmlFor="order_required_by_date">
            {ORDER_REQUIRED_BY_DATE}
          </label>
          <input
            type="date"
            name="order_required_by_date"
            defaultValue={defaultOrderRequiredByDate}
            min={currentDataInISOFormat()}
            placeholder={SELECT_ORDER_REQUIRED_BY_DATE}
            onChange={handleChange}
          />
          {!!order_required_by_date_error && (
            <span>{order_required_by_date_error}</span>
          )}
        </div>
        <div className="form-element">
          <label htmlFor="order_status">{ORDER_STATUS}</label>
          <select
            name="order_status"
            onChange={handleChange}
            disabled={!selectedInvoiceId}
            defaultValue={selectedInvoiceId ? selectedOrderStatus : RECEIVED}
          >
            <option disabled>{SELECT_ORDER_STATUS}</option>
            <option value={RECEIVED}>{RECEIVED}</option>
            <option value={COMPLETED}>{COMPLETED}</option>
          </select>
        </div>
        <div className="add-product-wrp">
          <div className="form-element">
            <label htmlFor="product_name">{PRODUCT_NAME}</label>
            <select
              name="product_name"
              onChange={handleChange}
              ref={selectedProductNameRef}
            >
              <option value={""}>{SELECT_PRODUCT_NAME}</option>
              {productOptions.map((product_name, index) => (
                <option key={product_name + index} value={product_name}>
                  {product_name}
                </option>
              ))}
            </select>
            {!invoiceDetails?.length && <span>{PLEASE_SELECT_PRODUCT}</span>}
          </div>
          <Button label={ADD} handleClick={handleAddClick} />
        </div>
      </div>
      {!!invoiceDetails?.length && (
        <div className="form-invoice-details-wrp">
          <TableUI
            isAddInvoicePage
            rows={invoiceDetails}
            columns={Object.keys(invoiceDetails?.[0])}
            handleInputChange={handleQtyInputChange}
          />
          <div className="form-total-amount">
            <p>{TOTAL_AMOUNT}: &nbsp; </p>
            {calculateInvoiceTotal()}
          </div>
        </div>
      )}

      <div className="form-actions-wrp">
        <Button label={SAVE} type={SUBMIT} disabled={!invoiceDetails?.length} />
      </div>
    </form>
  );
};

InvoiceFormFields.propTypes = propTypes;

const mapStateToProps = ({ invoices, customers, products }) => ({
  selectedInvoice: invoices.selectedInvoice,
  customers: customers.customers,
  products: products.products,
  isLoading: customers.isLoading || products.isLoading || invoices.isLoading,
  invoice_details: invoices.invoiceDetails,
});

const mapDispatchToProps = {
  saveInvoice,
  toggleRightDrawer,
  getCustomers,
  getProducts,
  getInvoiceDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceFormFields);

import {
  GET_INVOICES_REQUEST,
  GET_INVOICES_SUCCESS,
  GET_INVOICES_FAILURE,
  SAVE_INVOICE_REQUEST,
  SAVE_INVOICE_SUCCESS,
  SAVE_INVOICE_FAILURE,
  TOGGLE_INVOICE_LOADER,
  SET_SELECTED_INVOICE,
  DELETE_INVOICE_REQUEST,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAILURE,
  GET_INVOICE_DETAILS_REQUEST,
  GET_INVOICE_DETAILS_SUCCESS ,
  GET_INVOICE_DETAILS_FAILURE
} from "invoice_manager_dashboard_ui/actionTypes";
import { toggleRightDrawer } from "invoice_manager_customer_ui/actions/rightDrawerActions";
import { toggleSnackbar } from "invoice_manager_customer_ui/actions/snackBarActions";
import { togglePopup } from "invoice_manager_customer_ui/actions/popupActions";
import {
  BASE_URL_V1,
  ERROR,
  INFO,
} from "invoice_manager_customer_ui/constants";

export const toggleInvoiceLoader = (isLoading) => (dispatch) => {
  dispatch({ type: TOGGLE_INVOICE_LOADER, payload: { isLoading } });
};

export const setSelectedInvoice = (invoiceData) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_INVOICE,
    payload: {
      invoiceData,
    },
  });
};

export const getInvoices = () => async (dispatch) => {
  dispatch({ type: GET_INVOICE_DETAILS_REQUEST });
  try {
    const response = await fetch(`${BASE_URL_V1}/invoice`);
    const transformedResponse = await response.json();
    dispatch({ type: GET_INVOICES_SUCCESS, payload: transformedResponse });
  } catch (error) {
    console.error(error);
    dispatch({ type: GET_INVOICES_FAILURE, error });
  }
};

export const getInvoiceDetails = (invoice_id) => async (dispatch) => {
  dispatch({ type: GET_INVOICES_REQUEST });
  try {
    const response = await fetch(`${BASE_URL_V1}/invoice/${invoice_id}`);
    const transformedResponse = await response.json();
    dispatch({ type: GET_INVOICE_DETAILS_SUCCESS, payload: transformedResponse });
  } catch (error) {
    console.error(error);
    dispatch({ type: GET_INVOICE_DETAILS_FAILURE, error });
  }
};


export const saveInvoice =
  (
    customer_id,
    invoice_details,
    invoice_total_amount,
    invoice_creation_timestamp,
    order_required_by_date,
    order_status,
    invoice_id = ""
  ) =>
  async (dispatch) => {
    dispatch({ type: SAVE_INVOICE_REQUEST });
    dispatch(toggleRightDrawer(false));
    dispatch(setSelectedInvoice({}));
    try {
      let requestBody = {
        customer_id,
        invoice_details,
        invoice_total_amount,
        invoice_creation_timestamp,
        order_required_by_date,
        order_status,
      };
      if (invoice_id) {
        requestBody = {
          invoice_details,
          invoice_total_amount,
          order_required_by_date,
          order_status,
        };
      }
      const saveInvoiceUrl = invoice_id
        ? `${BASE_URL_V1}/invoice/${invoice_id}`
        : `${BASE_URL_V1}/invoice`;
      const saveInvoiceMethod = invoice_id ? "PUT" : "POST";

      const response = await fetch(saveInvoiceUrl, {
        method: saveInvoiceMethod,
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, payload } = await response.json();

      dispatch({
        type: SAVE_INVOICE_SUCCESS,
        payload: {
          invoiceData: {
            invoice_id: invoice_id || payload?.invoice_id,
            customer_id,
            invoice_total_amount,
            invoice_creation_timestamp,
            order_required_by_date,
            order_status,
          },
          isEditing: !!invoice_id,
        },
      });
      dispatch(toggleSnackbar(true, message, INFO));
    } catch (error) {
      console.error(error);
      dispatch({ type: SAVE_INVOICE_FAILURE, error });
      dispatch(toggleSnackbar(true, error, ERROR));
    }
  };

export const deleteInvoice = (invoice_id) => async (dispatch) => {
  dispatch({ type: DELETE_INVOICE_REQUEST });
  dispatch(togglePopup(false));
  try {
    const response = await fetch(`${BASE_URL_V1}/invoice/${invoice_id}`, {
      method: "DELETE",
    });
    const { message } = await response.json();
    dispatch({ type: DELETE_INVOICE_SUCCESS, payload: { invoice_id } });
    dispatch(toggleSnackbar(true, message, INFO));
  } catch (error) {
    console.error(error);
    dispatch({ type: DELETE_INVOICE_FAILURE, error });
    dispatch(toggleSnackbar(true, error, ERROR));
  }
};

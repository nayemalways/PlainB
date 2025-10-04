import { FRONTEND_URL } from "../config/config.js";
import { CreateInvoiceService, PaymentFailService, PaymentCancelService, PaymentIPNService, PaymentSuccessService, InvoiceListService, InvoiceProductListService } from "../Services/InvoiceServices.js"
 

// INVOICE CONTROLLER FUNCTION
export const CreateInvoice = async (req, res, next) => {
    try {
      const result = await CreateInvoiceService(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
}

export const InvoiceList = async (req, res, next) => {
    try {
      const result = await InvoiceListService(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
}




export const InvoiceProductList = async (req, res) => {
    const result = await InvoiceProductListService(req);
    res.json(result);
}



// PAYMENT CONTROLLER FUNCTION

export const PaymentSuccess = async (req, res) => {
  const result = await PaymentSuccessService(req);
  if (result.payment_status === "success") {
    res.redirect(`${FRONTEND_URL}/payment/${result.payment_status}/${result.tran_id}`);
  } else {
    res.status(500).json(result);
  }
}


export const PaymentFail = async (req, res) => {
    const result = await PaymentFailService(req);
    if (result.payment_status === "fail") {
        res.redirect(`${FRONTEND_URL}/payment/${result.payment_status}/${result.tran_id}`);
      } else {
        res.status(500).json(result);
      }
}


export const PaymentCancel = async (req, res) => {
    const result = await PaymentCancelService(req);
    if (result.payment_status === "cancel") {
      res.redirect(`${FRONTEND_URL}/payment/${result.payment_status}/${result.tran_id}`);
    } else {
      res.status(500).json(result);
    }
}


export const PaymentIPN = async (req, res) => {
    const result = await PaymentIPNService(req);
    if(result.status === "Success")  res.redirect("/payment");
}







 


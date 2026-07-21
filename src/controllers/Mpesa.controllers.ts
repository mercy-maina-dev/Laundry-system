import { Request, Response } from "express";
import { getAccessToken, stkPush } from "../Services/Mpesa.Services";
import * as PaymentsRepository from "../repositories/payments.repositories";
import * as OrdersRepository from "../repositories/Orders.repositories";

const transactionCache = new Map<string, number>();


// TEST TOKEN

export const testMpesaToken = async (req: Request, res: Response) => {
  try {
    const token = await getAccessToken();
    return res.status(200).json({
      success: true,
      access_token: token,
      message: "Token generated successfully",
    });
  } catch (error: any) {
    console.error("Token error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get token",
      error: error.response?.data || error.message,
    });
  }
};


// INITIATE STK PUSH

export const initiateSTKPush = async (req: Request, res: Response) => {
  try {
    const { phone, amount, order_id } = req.body;

    if (!phone || !amount || !order_id) {
      return res.status(400).json({
        success: false,
        message: "phone, amount and order_id are required",
        example: {
          phone: "0712345678",
          amount: 10,
          order_id: 1
        }
      });
    }

    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least 1 KES",
      });
    }

    console.log(`🚀 Initiating STK Push for order ${order_id}...`);
    const response = await stkPush(phone, amount, order_id);

    if (response.CheckoutRequestID) {
      transactionCache.set(response.CheckoutRequestID, order_id);
      console.log(`💾 Stored mapping: ${response.CheckoutRequestID} -> Order ${order_id}`);
      
      setTimeout(() => {
        transactionCache.delete(response.CheckoutRequestID);
        console.log(`🗑️ Cleared cache for: ${response.CheckoutRequestID}`);
      }, 3600000);
    }

    return res.status(200).json({
      success: true,
      data: response,
      message: "STK Push initiated successfully. Please check your phone for the M-Pesa prompt.",
    });
  } catch (error: any) {
    console.error("STK error:", error);
    
    return res.status(500).json({
      success: false,
      message: "STK Push failed",
      error: error.response?.data || error.message,
    });
  }
};

// MPESA CALLBACK

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    console.log(" MPESA CALLBACK RECEIVED:", JSON.stringify(req.body, null, 2));

    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
      console.log(" Invalid callback structure - missing stkCallback");
      return res.status(400).json({
        message: "Invalid callback structure",
      });
    }

    const { 
      ResultCode, 
      ResultDesc, 
      CallbackMetadata, 
      CheckoutRequestID,
      MerchantRequestID 
    } = callback;

    console.log(` Processing callback for CheckoutRequestID: ${CheckoutRequestID}`);
    console.log(` ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}`);

    let order_id = transactionCache.get(CheckoutRequestID);

    if (!order_id) {
      console.log(` Order ID not found in cache for ${CheckoutRequestID}`);
      
      if (MerchantRequestID && MerchantRequestID.includes('-')) {
        const extractedOrderId = parseInt(MerchantRequestID.split('-')[1]);
        if (!isNaN(extractedOrderId)) {
          order_id = extractedOrderId;
          console.log(` Extracted order_id ${order_id} from MerchantRequestID: ${MerchantRequestID}`);
        }
      }
      
      if (!order_id) {
        console.log(`❌ Cannot process payment: No order_id mapping found`);
        return res.status(200).json({
          message: "Callback received but order_id mapping missing",
          result: ResultCode === 0 ? "success" : "failed"
        });
      }
    }

    if (ResultCode === 0) {
      console.log(` Payment successful for Order ${order_id}`);
      
      const items = CallbackMetadata?.Item || [];
      
      const amount = items.find((x: any) => x.Name === "Amount")?.Value;
      const mpesaCode = items.find((x: any) => x.Name === "MpesaReceiptNumber")?.Value;
      const phone = items.find((x: any) => x.Name === "PhoneNumber")?.Value;
      
      const paymentData = {
        order_id: order_id,
        amount: amount,
        payment_method: "M-PESA",
        payment_status: "SUCCESS",
        transaction_ref: mpesaCode,
        paid_at: new Date(),
        checkout_request_id: CheckoutRequestID,
        merchant_request_id: MerchantRequestID,
        phone_number: phone,
        result_code: 0,
        result_desc: "Success"  
      };

      try {
        await PaymentsRepository.createPayment(paymentData);
        console.log(`✅ Payment saved successfully for Order ${order_id}`);
        
        await OrdersRepository.updateOrderStatus(order_id, 'PAID');
        console.log(`✅ Order ${order_id} status updated to PAID`);
        
        transactionCache.delete(CheckoutRequestID);
        console.log(`🗑️ Cleared cache for ${CheckoutRequestID}`);
        
      } catch (dbError) {
        console.error(` Database error:`, dbError);
      }
      
    } else if (ResultCode === 1037) {
      console.log(` Payment timeout for Order ${order_id}: ${ResultDesc}`);
      
      const paymentData = {
        order_id: order_id,
        amount: 0,
        payment_method: "M-PESA",
        payment_status: "TIMEOUT",
        transaction_ref: null,
        paid_at: null,
        checkout_request_id: CheckoutRequestID,
        merchant_request_id: MerchantRequestID,
        phone_number: null,
        result_code: ResultCode,
        result_desc: ResultDesc
      };
      
      await PaymentsRepository.createPayment(paymentData);
      await OrdersRepository.updateOrderStatus(order_id, 'TIMEOUT');
      
    } else if (ResultCode === 1032) {
      console.log(` User cancelled payment for Order ${order_id}: ${ResultDesc}`);
      
      const paymentData = {
        order_id: order_id,
        amount: 0,
        payment_method: "M-PESA",
        payment_status: "CANCELLED",
        transaction_ref: null,
        paid_at: null,
        checkout_request_id: CheckoutRequestID,
        merchant_request_id: MerchantRequestID,
        phone_number: null,
        result_code: ResultCode,
        result_desc: ResultDesc
      };
      
      await PaymentsRepository.createPayment(paymentData);
      await OrdersRepository.updateOrderStatus(order_id, 'CANCELLED');
      
    } else {
      console.log(` Payment failed for Order ${order_id}: ${ResultDesc}`);
      
      const paymentData = {
        order_id: order_id,
        amount: 0,
        payment_method: "M-PESA",
        payment_status: "FAILED",
        transaction_ref: null,
        paid_at: null,
        checkout_request_id: CheckoutRequestID,
        merchant_request_id: MerchantRequestID,
        phone_number: null,
        result_code: ResultCode,
        result_desc: ResultDesc
      };
      
      await PaymentsRepository.createPayment(paymentData);
      await OrdersRepository.updateOrderStatus(order_id, 'FAILED');
    }

    return res.status(200).json({
      message: "Callback processed successfully",
      result: ResultCode === 0 ? "success" : "failed"
    });
    
  } catch (error) {
    console.error(" Callback error:", error);
    return res.status(200).json({
      message: "Callback received but processing failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// CHECK TRANSACTION STATUS

export const checkTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.params;
    
    if (!checkoutRequestID) {
      return res.status(400).json({
        success: false,
        message: "checkoutRequestID is required"
      });
    }
    
    const requestId = Array.isArray(checkoutRequestID) ? checkoutRequestID[0] : checkoutRequestID;
    const status = await queryTransactionStatus(requestId);
    
    return res.status(200).json({
      success: true,
      data: status
    });
    
  } catch (error: any) {
    console.error("Status query error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to query transaction status",
      error: error.response?.data || error.message
    });
  }
};



export const checkOrderStatus = async (req: Request, res: Response) => {
  try {
    let { order_id } = req.params;
    
    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }
    
    
    const orderIdString = Array.isArray(order_id) ? order_id[0] : order_id;
    const orderId = parseInt(orderIdString);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order_id. Must be a number."
      });
    }
    
    const order = await OrdersRepository.getOrderById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${orderId} not found`
      });
    }
    
    const payment = await PaymentsRepository.getPaymentByOrderId(orderId);
    
    return res.status(200).json({
      success: true,
      data: {
        order_id: order.order_id,
        status: order.status,
        total_price: order.total_price,
        payment: payment ? {
          status: payment.payment_status,
          transaction_ref: payment.transaction_ref,
          paid_at: payment.paid_at
        } : null
      }
    });
    
  } catch (error: any) {
    console.error("Error checking order status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check order status",
      error: error.message
    });
  }
};

// Helper function to query transaction status
const queryTransactionStatus = async (checkoutRequestID: string) => {
  const token = await getAccessToken();
  const shortcode = process.env.MPESA_SHORTCODE as string;
  const passkey = process.env.MPESA_PASSKEY as string;
  
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
    
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  
  const axios = require("axios");
  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    },
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    }
  );
  
  return response.data;
};
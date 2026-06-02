//import { Payments, UpdatePayments } from './../Types/payments.type';
import getpool from "../db/config";
import { NewPayments, Payments, UpdatePayments } from "../Types/payments.type";

// GET ALL PAYMENTS
export const getAllPayments = async () => {
  const pool = await getpool();

  const result = await pool.request()
    .query("SELECT * FROM Payments ORDER BY paid_at DESC");

  return result.recordset;
};

// CREATE PAYMENT (Updated to handle all fields)
export const createPayment = async (payment: NewPayments) => {
  const pool = await getpool();

  const result = await pool.request()
    .input("order_id", payment.order_id)
    .input("amount", payment.amount)
    .input("payment_method", payment.payment_method)
    .input("payment_status", payment.payment_status)
    .input("transaction_ref", payment.transaction_ref)
    .input("paid_at", payment.paid_at || new Date())
    .input("checkout_request_id", payment.checkout_request_id || null)
    .input("merchant_request_id", payment.merchant_request_id || null)
    .input("phone_number", payment.phone_number || null)
    .input("result_code", payment.result_code || null)
    .input("result_desc", payment.result_desc || null)
    .query(`
      INSERT INTO Payments
      (order_id, amount, payment_method, payment_status, transaction_ref, paid_at, 
       checkout_request_id, merchant_request_id, phone_number, result_code, result_desc, created_at)
      VALUES
      (@order_id, @amount, @payment_method, @payment_status, @transaction_ref, @paid_at,
       @checkout_request_id, @merchant_request_id, @phone_number, @result_code, @result_desc, GETDATE())
    `);

  return { 
    message: "Payment added successfully",
    payment_id: result.recordset?.[0]?.payment_id || null
  };
};

// GET PAYMENT BY ID
export const getPaymentById = async (id: number): Promise<Payments | null> => {
  const pool = await getpool();

  const result = await pool.request()
    .input("id", id)
    .query("SELECT * FROM Payments WHERE payment_id = @id");

  return result.recordset[0] || null;
};

// GET PAYMENT BY ORDER ID
export const getPaymentByOrderId = async (order_id: number): Promise<Payments | null> => {
  const pool = await getpool();

  const result = await pool.request()
    .input("order_id", order_id)
    .query("SELECT * FROM Payments WHERE order_id = @id ORDER BY created_at DESC");

  return result.recordset[0] || null;
};

// GET PAYMENT BY TRANSACTION REFERENCE
export const getPaymentByTransactionRef = async (transaction_ref: string): Promise<Payments | null> => {
  const pool = await getpool();

  const result = await pool.request()
    .input("transaction_ref", transaction_ref)
    .query("SELECT * FROM Payments WHERE transaction_ref = @transaction_ref");

  return result.recordset[0] || null;
};

// GET PAYMENT BY CHECKOUT REQUEST ID
export const getPaymentByCheckoutRequestId = async (checkout_request_id: string): Promise<Payments | null> => {
  const pool = await getpool();

  const result = await pool.request()
    .input("checkout_request_id", checkout_request_id)
    .query("SELECT * FROM Payments WHERE checkout_request_id = @checkout_request_id");

  return result.recordset[0] || null;
};

// UPDATE PAYMENT
export const updatePayment = async (id: number, payment: UpdatePayments) => {
  const pool = await getpool();

  const result = await pool.request()
    .input("id", id)
    .input("amount", payment.amount)
    .input("payment_method", payment.payment_method)
    .input("payment_status", payment.payment_status)
    .input("transaction_ref", payment.transaction_ref)
    .input("paid_at", payment.paid_at)
    .input("checkout_request_id", payment.checkout_request_id)
    .input("merchant_request_id", payment.merchant_request_id)
    .input("phone_number", payment.phone_number)
    .input("result_code", payment.result_code)
    .input("result_desc", payment.result_desc)
    .query(`
      UPDATE Payments
      SET 
        amount = ISNULL(@amount, amount),
        payment_method = ISNULL(@payment_method, payment_method),
        payment_status = ISNULL(@payment_status, payment_status),
        transaction_ref = ISNULL(@transaction_ref, transaction_ref),
        paid_at = ISNULL(@paid_at, paid_at),
        checkout_request_id = ISNULL(@checkout_request_id, checkout_request_id),
        merchant_request_id = ISNULL(@merchant_request_id, merchant_request_id),
        phone_number = ISNULL(@phone_number, phone_number),
        result_code = ISNULL(@result_code, result_code),
        result_desc = ISNULL(@result_desc, result_desc),
        updated_at = GETDATE()
      WHERE payment_id = @id
    `);

  if (result.rowsAffected[0] === 0) {
    return null;
  }

  return { message: "Payment updated successfully" };
};

// UPDATE PAYMENT STATUS BY CHECKOUT REQUEST ID
export const updatePaymentStatus = async (
  checkout_request_id: string, 
  status: string, 
  transaction_ref?: string,
  result_code?: number,
  result_desc?: string
) => {
  const pool = await getpool();

  let query = `
    UPDATE Payments
    SET 
      payment_status = @status,
      updated_at = GETDATE()
  `;

  if (transaction_ref) {
    query += `, transaction_ref = @transaction_ref`;
  }
  if (result_code !== undefined) {
    query += `, result_code = @result_code`;
  }
  if (result_desc) {
    query += `, result_desc = @result_desc`;
  }

  query += ` WHERE checkout_request_id = @checkout_request_id`;

  const request = pool.request()
    .input("checkout_request_id", checkout_request_id)
    .input("status", status);

  if (transaction_ref) {
    request.input("transaction_ref", transaction_ref);
  }
  if (result_code !== undefined) {
    request.input("result_code", result_code);
  }
  if (result_desc) {
    request.input("result_desc", result_desc);
  }

  const result = await request.query(query);

  return result.rowsAffected[0] > 0;
};

// DELETE PAYMENT
export const deletePayment = async (id: number) => {
  const pool = await getpool();

  const result = await pool.request()
    .input("id", id)
    .query("DELETE FROM Payments WHERE payment_id = @id");

  if (result.rowsAffected[0] === 0) {
    return null;
  }

  return { message: "Payment deleted successfully" };
};

// GET PAYMENTS BY STATUS
export const getPaymentsByStatus = async (status: string) => {
  const pool = await getpool();

  const result = await pool.request()
    .input("status", status)
    .query("SELECT * FROM Payments WHERE payment_status = @status ORDER BY created_at DESC");

  return result.recordset;
};

// GET PAYMENTS BY DATE RANGE
export const getPaymentsByDateRange = async (startDate: Date, endDate: Date) => {
  const pool = await getpool();

  const result = await pool.request()
    .input("startDate", startDate)
    .input("endDate", endDate)
    .query(`
      SELECT * FROM Payments 
      WHERE paid_at BETWEEN @startDate AND @endDate 
      ORDER BY paid_at DESC
    `);

  return result.recordset;
};
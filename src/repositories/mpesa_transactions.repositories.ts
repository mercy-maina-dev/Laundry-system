import getpool from "../db/config";

export interface MpesaTransaction {
  id?: number;
  checkout_request_id: string;
  merchant_request_id: string;
  order_id: number;
  phone_number: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  created_at?: Date;
  updated_at?: Date;
}

export const saveMpesaTransaction = async (transaction: MpesaTransaction) => {
  const pool = await getpool();
  
  const result = await pool.request()
    .input("checkout_request_id", transaction.checkout_request_id)
    .input("merchant_request_id", transaction.merchant_request_id)
    .input("order_id", transaction.order_id)
    .input("phone_number", transaction.phone_number)
    .input("amount", transaction.amount)
    .input("status", transaction.status)
    .query(`
      INSERT INTO MpesaTransactions 
      (checkout_request_id, merchant_request_id, order_id, phone_number, amount, status, created_at)
      VALUES 
      (@checkout_request_id, @merchant_request_id, @order_id, @phone_number, @amount, @status, GETDATE())
    `);
    
  return result;
};

export const updateMpesaTransactionStatus = async (
  checkout_request_id: string, 
  status: string,
  result_code?: number,
  result_desc?: string
) => {
  const pool = await getpool();
  
  let query = `
    UPDATE MpesaTransactions 
    SET status = @status, updated_at = GETDATE()
  `;
  
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
    
  if (result_code !== undefined) {
    request.input("result_code", result_code);
  }
  if (result_desc) {
    request.input("result_desc", result_desc);
  }
  
  const result = await request.query(query);
  return result;
};

export const getMpesaTransaction = async (checkout_request_id: string) => {
  const pool = await getpool();
  
  const result = await pool.request()
    .input("checkout_request_id", checkout_request_id)
    .query("SELECT * FROM MpesaTransactions WHERE checkout_request_id = @checkout_request_id");
    
  return result.recordset[0];
};
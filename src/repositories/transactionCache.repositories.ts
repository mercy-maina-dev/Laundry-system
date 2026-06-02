import getpool from "../db/config";

// Save mapping when initiating payment
export const saveTransactionMapping = async (checkout_request_id: string, order_id: number) => {
  const pool = await getpool();
  
  await pool.request()
    .input("checkout_request_id", checkout_request_id)
    .input("order_id", order_id)
    .query(`
      INSERT INTO TransactionCache (checkout_request_id, order_id)
      VALUES (@checkout_request_id, @order_id)
    `);
  
  console.log(`💾 Saved mapping: ${checkout_request_id} -> Order ${order_id}`);
};

// Get order_id when callback arrives
export const getOrderIdFromCheckoutRequest = async (checkout_request_id: string) => {
  const pool = await getpool();
  
  const result = await pool.request()
    .input("checkout_request_id", checkout_request_id)
    .query(`
      SELECT order_id FROM TransactionCache 
      WHERE checkout_request_id = @checkout_request_id
    `);
  
  return result.recordset[0]?.order_id || null;
};

// Delete mapping after successful payment (optional cleanup)
export const deleteTransactionMapping = async (checkout_request_id: string) => {
  const pool = await getpool();
  
  await pool.request()
    .input("checkout_request_id", checkout_request_id)
    .query(`DELETE FROM TransactionCache WHERE checkout_request_id = @checkout_request_id`);
};
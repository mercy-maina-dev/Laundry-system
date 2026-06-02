import getpool from "../db/config";
import { OrderStatusHistory, UpdateOrderStatusHistory } from "../Types/OrderStatusHistory.type";

export const getAllOrderStatusHistory = async (): Promise<OrderStatusHistory[]> => {
  const pool = await getpool();
  const results = await pool.request().query('SELECT * FROM OrderStatusHistory ORDER BY history_id DESC');
  return results.recordset;
}

export const createOrderStatusHistory = async (history: OrderStatusHistory) => {
  const pool = await getpool();
  const result = await pool.request()
    .input('order_id', history.order_id)
    .input('status', history.status)
    .input('changed_at', history.changed_at || new Date())
    .input('notes', history.notes || null)
    .input('changed_by', history.changed_by || null)
    .input('previous_status', history.previous_status || null)
    .input('created_at', new Date())
    .input('updated_at', null)
    .query(`INSERT INTO OrderStatusHistory (order_id, status, changed_at, notes, changed_by, previous_status, created_at, updated_at) 
            VALUES (@order_id, @status, @changed_at, @notes, @changed_by, @previous_status, @created_at, @updated_at)`);
  return { message: 'Order status history created successfully' };
}

export const getOrderStatusHistoryById = async (id: number): Promise<OrderStatusHistory | null> => {
  const pool = await getpool();
  const result = await pool.request()
    .input('id', id)
    .query('SELECT * FROM OrderStatusHistory WHERE history_id = @id');
  return result.recordset[0] || null;
}

export const getOrderStatusHistoryByOrderId = async (order_id: number): Promise<OrderStatusHistory[]> => {
  const pool = await getpool();
  const result = await pool.request()
    .input('order_id', order_id)
    .query('SELECT * FROM OrderStatusHistory WHERE order_id = @order_id ORDER BY changed_at DESC');
  return result.recordset;
}

export const updateOrderStatusHistoryById = async (id: number, history: UpdateOrderStatusHistory) => {
  const pool = await getpool();
  const result = await pool
    .request()
    .input('id', id)
    .input('notes', history.notes)
    .input('updated_at', new Date())
    .query('UPDATE OrderStatusHistory SET notes = @notes, updated_at = @updated_at WHERE history_id = @id');
  
  if (result.rowsAffected[0] === 0) {
    return null;
  }
  return { message: 'Order status history updated successfully' };
}

export const deleteOrderStatusHistoryById = async (id: number) => {
  const pool = await getpool();
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM OrderStatusHistory WHERE history_id = @id');
  
  if (result.rowsAffected[0] === 0) {
    return null;
  }
  return { message: 'Order status history deleted successfully' };
}

export const getLatestStatusByOrderId = async (order_id: number): Promise<OrderStatusHistory | null> => {
  const pool = await getpool();
  const result = await pool.request()
    .input('order_id', order_id)
    .query('SELECT TOP 1 * FROM OrderStatusHistory WHERE order_id = @order_id ORDER BY changed_at DESC');
  return result.recordset[0] || null;
}
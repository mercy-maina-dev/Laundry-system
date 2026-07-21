import { User } from './../Types/Users.type';
import { Request, Response } from "express";
import * as OrderStatusHistoryService from "../Services/OrderStatusHistory.Services";
import getpool from "../db/config"; // establish a connection pool to the database

export const getAllOrderStatusHistory = async (req: Request, res: Response) => {
  try {
    const history = await OrderStatusHistoryService.getAllOrderStatusHistory();
    return res.status(200).json({
      success: true,
      data: history,
      message: "Order status history retrieved successfully"
    });
  } catch (error: any) {
    console.error("Error getting order status history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get order status history",
      error: error.message
    });
  }
}

export const createOrderStatusHistory = async (req: Request, res: Response) => {
  try {
    const { order_id, status, changed_at, notes, changed_by, previous_status } = req.body;
    
    if (!order_id || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required"
      });
    }
    
    const result = await OrderStatusHistoryService.createOrderStatusHistory({
      order_id,
      status,
      changed_at,
      notes,
      changed_by,
      previous_status
    });
    
    return res.status(201).json({
      success: true,
      data: result,
      message: "Order status history created successfully"
    });
  } catch (error: any) {
    console.error("Error creating order status history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order status history",
      error: error.message
    });
  }
}

export const getOrderStatusHistoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const historyId = parseInt(id as string);
    
    if (isNaN(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID"
      });
    }
    
    const history = await OrderStatusHistoryService.getOrderStatusHistoryById(historyId);
    
    if (!history) {
      return res.status(404).json({
        success: false,
        message: `Order status history with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: history,
      message: "Order status history retrieved successfully"
    });
  } catch (error: any) {
    console.error("Error getting order status history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get order status history",
      error: error.message
    });
  }
}

export const getOrderStatusHistoryByOrderId = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;
    const orderId = parseInt(order_id as string);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }
    
    const history = await OrderStatusHistoryService.getOrderStatusHistoryByOrderId(orderId);
    
    return res.status(200).json({
      success: true,
      data: history,
      message: "Order status history retrieved successfully"
    });
  } catch (error: any) {
    console.error("Error getting order status history by order ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get order status history",
      error: error.message
    });
  }
}
// Update only order status - AUTO CREATES HISTORY

    export const updateOrderStatusHistoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const historyId = parseInt(id as string);
    
    if (isNaN(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID"
      });
    }
    
    const result = await OrderStatusHistoryService.updateOrderStatusHistoryById(historyId, { notes });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Order status history with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Order status history updated successfully"
    });
  } catch (error: any) {
    console.error("Error updating order status history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status history",
      error: error.message
    });
  }
};





export const deleteOrderStatusHistoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const historyId = parseInt(id as string);
    
    if (isNaN(historyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID"
      });
    }
    
    const result = await OrderStatusHistoryService.deleteOrderStatusHistoryById(historyId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Order status history with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Order status history deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting order status history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete order status history",
      error: error.message
    });
  }
}

export const getLatestStatusByOrderId = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;
    const orderId = parseInt(order_id as string);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }
    
    const status = await OrderStatusHistoryService.getLatestStatusByOrderId(orderId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: `No status history found for order ID ${order_id}`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: status,
      message: "Latest status retrieved successfully"
    });
  } catch (error: any) {
    console.error("Error getting latest status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get latest status",
      error: error.message
    });
  }
}
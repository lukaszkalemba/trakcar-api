import { Request, Response } from 'express';
import Order from 'models/Order';

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Public
export const getOrders = async (_: Request, res: Response): Promise<any> => {
  try {
    const orders = await Order.find();

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

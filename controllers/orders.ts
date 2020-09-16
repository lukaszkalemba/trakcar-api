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

// @desc    Add new order
// @route   POST /api/v1/orders
// @access  Public
export const addOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const order = await Order.create(req.body);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(
        ({ message }: any): string => message
      );

      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

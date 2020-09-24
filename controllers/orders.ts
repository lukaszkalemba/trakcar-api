import { Request, Response } from 'express';
import Order from 'models/Order';
import Position from 'models/Position';
import handleOrderError from 'helpers/handleOrderError';

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Public
export const orders_get_all = async (
  _: Request,
  res: Response
): Promise<Response> => {
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

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Public
export const orders_create_order = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { positionId } = req.body;

    const order = new Order(req.body);
    await order.validate();

    const orders = await Order.find({ positionId });
    const position = await Position.findById(positionId);

    const orderError = handleOrderError(req, res, orders, position);

    if (orderError) {
      return orderError;
    }

    await order.save();

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

// @desc    Update an order
// @route   PUT /api/v1/orders/:id
// @access  Public
export const orders_update_order = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'No order found',
      });
    }

    const updatedOrder = new Order(req.body);
    await updatedOrder.validate();

    const {
      positionId,
      date,
      startTime,
      endTime,
      name,
      carBrand,
      carModel,
      principalName,
      cost,
      color,
      description,
    } = updatedOrder;

    let orders = await Order.find({ positionId });
    orders = orders.filter(({ id }) => id !== order.id);

    const position = await Position.findById(positionId);

    const orderError = handleOrderError(req, res, orders, position);

    if (orderError) {
      return orderError;
    }

    order.positionId = positionId;
    order.date = date;
    order.startTime = startTime;
    order.endTime = endTime;
    order.name = name;
    order.carBrand = carBrand;
    order.carModel = carModel;
    order.principalName = principalName;
    order.cost = cost;
    order.color = color;
    order.description = description;

    await order.save();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);

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

// @desc    Delete an order
// @route   DELETE /api/v1/orders/:id
// @access  Public
export const orders_delete_order = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'No order found',
      });
    }

    await order.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

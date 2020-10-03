import { Request, Response } from 'express';
import Order, { IOrderSchema } from 'models/Order';
import Position from 'models/Position';
import Organization, { IOrganizationSchema } from 'models/Organization';
import handleOrderError from 'helpers/handleOrderError';

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private
export const orders_get_all = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const organization = await Organization.findOne({ members: req.user.id });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    const orders: Array<IOrderSchema> = [];

    for await (const position of (organization as IOrganizationSchema)
      .positions) {
      const positionOrders = await Order.find({
        positionId: position.toString(),
      });

      orders.push(...positionOrders);
    }

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
// @access  Private
export const orders_create_order = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { positionId } = req.body;

    const order = new Order(req.body);
    await order.validate();

    const position = await Position.findById(positionId);

    if (!position) {
      return res.status(400).json({
        success: false,
        error: 'There is no such position',
      });
    }

    const orders = await Order.find({ positionId });

    const orderError = handleOrderError(req, res, orders, position);

    if (orderError) {
      return orderError;
    }

    position.orders.push(order.id);

    await position.save();
    await order.save();

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      interface ErrorValue {
        message: string;
      }

      const messages = Object.values(err.errors).map(
        (val: ErrorValue | unknown) => (val as ErrorValue).message
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
// @access  Private
export const orders_update_order = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const organization = await Organization.findOne({ members: req.user.id });

    let order: IOrderSchema | null = null;

    for await (const position of (organization as IOrganizationSchema)
      .positions) {
      order = await Order.findOne({
        _id: req.params.id,
        positionId: position.toString(),
      });
    }

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
    orders = orders.filter(({ id }) => id !== (order as IOrderSchema).id);

    const position = await Position.findById(positionId);

    if (!position) {
      return res.status(400).json({
        success: false,
        error: 'There is no such position',
      });
    }

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
      interface ErrorValue {
        message: string;
      }

      const messages = Object.values(err.errors).map(
        (val: ErrorValue | unknown) => (val as ErrorValue).message
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

// @desc    Delete an order
// @route   DELETE /api/v1/orders/:id
// @access  Private
export const orders_delete_order = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const organization = await Organization.findOne({
      members: req.user.id,
    });

    let order: IOrderSchema | null = null;

    for await (const position of (organization as IOrganizationSchema)
      .positions) {
      order = await Order.findOne({
        _id: req.params.id,
        positionId: position.toString(),
      });
    }

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

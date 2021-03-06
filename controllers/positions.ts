import { Request, Response } from 'express';
import Position from 'models/Position';
import User from 'models/User';
import Organization from 'models/Organization';
import Order from 'models/Order';
import handlePostionTimeError from 'helpers/handlePostionTimeError';

// @desc    Get all positions of the organization
// @route   GET /api/v1/positions
// @access  Private
export const positions_get_all = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (!user.organization) {
      return res.status(404).json({
        success: false,
        error: 'You are not a member of any organization',
      });
    }

    const positions = await Position.find({
      organization: user.organization,
    });

    return res.status(200).json({
      success: true,
      count: positions.length,
      data: positions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Create new position
// @route   POST /api/v1/positions
// @access  Private
export const positions_create_position = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const { positionName, startTime, endTime } = req.body;

    const positions = await Position.find({
      positionName,
      organization: user.organization as string,
    });

    if (positions.length) {
      return res.status(400).json({
        success: false,
        error: 'There is a position with this name already',
      });
    }

    const position = new Position({
      positionName,
      startTime,
      endTime,
      organization: user.organization,
    });

    await position.validate();

    const timeError = handlePostionTimeError(req, res);

    if (timeError) {
      return timeError;
    }

    const organization = await Organization.findById(user.organization);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    organization.positions.push(position.id);

    await organization.save();
    await position.save();

    return res.status(201).json({
      success: true,
      data: position,
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

// @desc    Update a position
// @route   PUT /api/v1/positions/:id
// @access  Private
export const positions_update_position = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'No position found',
      });
    }

    if (user.organization?.toString() !== position.organization.toString()) {
      return res.status(403).json({
        success: false,
        error: 'This position is not assigned to your organization',
      });
    }

    const { positionName, startTime, endTime } = req.body;

    const positions = await Position.find({
      positionName,
      organization: user.organization as string,
    });

    if (positions.length) {
      positions.forEach(({ id }): Response | void => {
        if (id !== position.id) {
          return res.status(400).json({
            success: false,
            error: 'There is a position with this name already',
          });
        }
      });
    }

    const comparedStartTime = parseInt(startTime.substring(0, 2), 10);
    const comparedEndTime = parseInt(endTime.substring(0, 2), 10);

    for await (const orderId of position.orders) {
      const order = await Order.findById(orderId);

      if (order) {
        const comparedOrderStartTime = parseInt(
          order.startTime.substring(0, 2),
          10
        );

        const comparedOrderEndTime = parseInt(
          order.endTime.substring(0, 2),
          10
        );

        if (comparedOrderStartTime < comparedStartTime) {
          await order.remove();
        }

        if (comparedOrderEndTime > comparedEndTime) {
          await order.remove();
        }
      }
    }

    const updatedPosition = new Position({
      positionName,
      startTime,
      endTime,
      organization: user.organization,
    });

    await updatedPosition.validate();

    const timeError = handlePostionTimeError(req, res);

    if (timeError) {
      return timeError;
    }

    position.positionName = updatedPosition.positionName;
    position.startTime = updatedPosition.startTime;
    position.endTime = updatedPosition.endTime;

    await position.save();

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

// @desc    Delete a position
// @route   DELETE /api/v1/positions
// @access  Private
export const positions_delete_position = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'No position found',
      });
    }

    if (user.organization?.toString() !== position.organization.toString()) {
      return res.status(403).json({
        success: false,
        error: 'This position is not assigned to your organization',
      });
    }

    for await (const order of position.orders) {
      await Order.findByIdAndDelete(order);
    }

    await position.remove();

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

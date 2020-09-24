import { Request, Response } from 'express';
import Position from 'models/Position';
import handlePostionTimeError from 'helpers/handlePostionTimeError';

// @desc    Get all positions
// @route   GET /api/v1/positions
// @access  Public
export const positions_get_all = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const positions = await Position.find();

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
// @access  Public
export const positions_create_position = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.body;

    const positions = await Position.find({ name });

    if (positions.length) {
      return res.status(400).json({
        success: false,
        error: 'There is a position with this name already',
      });
    }

    const timeError = handlePostionTimeError(req, res);

    if (timeError) {
      return timeError;
    }

    const position = await Position.create(req.body);

    return res.status(201).json({
      success: true,
      data: position,
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

// @desc    Update a position
// @route   PUT /api/v1/positions/:id
// @access  Public
export const positions_update_position = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'No position found',
      });
    }

    const timeError = handlePostionTimeError(req, res);

    if (timeError) {
      return timeError;
    }

    const { name, startTime, endTime } = req.body;

    position.name = name;
    position.startTime = startTime;
    position.endTime = endTime;

    await position.save();

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

// @desc    Delete a position
// @route   DELETE /api/v1/positions
// @access  Public
export const positions_delete_position = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'No position found',
      });
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

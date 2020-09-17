import { Request, Response } from 'express';
import Position from 'models/Position';

// @desc    Get all positions
// @route   GET /api/v1/positions
// @access  Public
export const getPositions = async (_: Request, res: Response): Promise<any> => {
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

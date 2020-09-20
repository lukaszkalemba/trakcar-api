import { Request, Response, NextFunction } from 'express';
import Position from 'models/Position';

const validatePosition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name, startTime, endTime } = req.body;

  const positions = await Position.find({ name });

  if (positions.length) {
    return res.status(400).json({
      success: false,
      error: 'There is a position with this name already',
    });
  }

  const timeRegEx = /^([0-1][0-9]|2[0-3]):00$/;

  const isStartTimeValid = startTime.match(timeRegEx);
  const isEndTimeValid = endTime.match(timeRegEx);

  const isEndTimeLater = endTime > startTime;

  if (!isStartTimeValid || !isEndTimeValid || !isEndTimeLater) {
    return res.status(400).json({
      success: false,
      error: 'Invalid time range',
    });
  }

  return next();
};

export default validatePosition;

import { Request, Response } from 'express';

const handlePostionTimeError = (
  req: Request,
  res: Response
): Response | void => {
  const { startTime, endTime } = req.body;

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
};

export default handlePostionTimeError;

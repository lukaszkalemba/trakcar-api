import { Request, Response, NextFunction } from 'express';
import { isWithinInterval, addHours, subHours } from 'date-fns';
import Position from 'models/Position';
import Order from 'models/Order';

const validateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { positionId, orderDate, startTime, endTime } = req.body;

  const position = await Position.findById(positionId);

  if (!position) {
    return res.status(400).json({
      success: false,
      error: 'There is no such position',
    });
  }

  const timeRegEx = /^([0-1][0-9]|2[0-3]):00$/;

  const isStartTimeValid = startTime.match(timeRegEx);
  const isEndTimeValid = endTime.match(timeRegEx);

  const isEndTimeLater = endTime > startTime;

  const isWithinPositionRange =
    startTime >= position.startTime && endTime <= position.endTime;

  if (
    !isStartTimeValid ||
    !isEndTimeValid ||
    !isEndTimeLater ||
    !isWithinPositionRange
  ) {
    return res.status(400).json({
      success: false,
      error: 'Invalid time',
    });
  }

  const dateRegEx = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;

  const isOrderDateValid = orderDate.match(dateRegEx);

  if (!isOrderDateValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid date',
    });
  }

  const orders = await Order.find({ positionId });

  const startTimeDate = new Date(`${orderDate}, ${startTime}`);
  const endTimeDate = new Date(`${orderDate}, ${endTime}`);

  for (let i = 0; i < orders.length; i += 1) {
    const orderStartTimeDate = new Date(
      `${orders[i].orderDate}, ${orders[i].startTime}`
    );
    const orderEndTimeDate = new Date(
      `${orders[i].orderDate}, ${orders[i].endTime}`
    );

    const isStartTimeWithinInterval = isWithinInterval(startTimeDate, {
      start: orderStartTimeDate,
      end: subHours(orderEndTimeDate, 1),
    });

    const isEndTimeWithinInterval = isWithinInterval(endTimeDate, {
      start: addHours(orderStartTimeDate, 1),
      end: orderEndTimeDate,
    });

    if (isStartTimeWithinInterval || isEndTimeWithinInterval) {
      return res.status(400).json({
        success: false,
        error: 'There is an order in this time range already',
      });
    }
  }

  return next();
};

export default validateOrder;

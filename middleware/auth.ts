import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token, authorization denied',
    });
  }

  try {
    jwt.verify(token, <string>process.env.JWT_SECRET);

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token is not valid',
    });
  }
};

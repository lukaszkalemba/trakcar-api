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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = (decoded as any).user;

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token is not valid',
    });
  }
};

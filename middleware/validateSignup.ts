import { Request, Response, NextFunction } from 'express';
import User from 'models/User';

const validateSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      success: false,
      error: 'User already exists',
    });
  }

  return next();
};

export default validateSignup;

import { Request, Response } from 'express';
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from 'models/User';

dotenv.config({ path: 'config/config.env' });

// @desc    Sign up a user
// @route   POST /api/v1/auth/signup
// @access  Public
export const users_signup_user = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    user = new User({
      name,
      email,
      password,
      avatar,
    });

    await user.validate();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '7 days' },
      (err, token) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message,
          });
        }

        return res.status(201).json({
          success: true,
          data: token,
        });
      }
    );
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

// @desc    Login user
// @route   POST /api/v1/auth/signin
// @access  Public
export const users_login_user = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    const validationUser = new User({
      name: 'validation user',
      email,
      password,
    });

    await validationUser.validate();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Credentials',
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '7 days' },
      (err, token) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message,
          });
        }

        return res.status(200).json({
          success: true,
          data: token,
        });
      }
    );
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

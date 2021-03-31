import User, { IUser } from '../models/user';
import Payload from '@/types/Payload';
import Request from '@/types/Request';
import { Response } from 'express';
import { validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
export class AuthController {
  constructor() {}

  async finduser(req: Request, res: Response): Promise<Response> {
    try {
      const user: IUser = await User.findById(req.userId).select('-password');
      return res.json(user);
    } catch (err) {
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send('Server Error');
    }
  }

  async findToken(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user: IUser = await User.findOne({ email });
      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [{ message: 'Invalid Credentials' }],
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              message: 'Invalid Credentials',
            },
          ],
        });
      }
      const payload: Payload = {
        userId: user.id,
      };
      jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: config.get('jwtExpiration'),
      });
    } catch (err) {
      console.log(err.message);
      return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send('Interal_error');
    }
  }
}

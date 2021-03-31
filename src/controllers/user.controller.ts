import { user } from '@/Dto/user.dto';
import User from '../models/user';
import { IUser } from '../models/user';
import HttpStatusCodes from 'http-status-codes';
//import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import Payload from '@/types/Payload';
import jwt from 'jsonwebtoken';
import config from 'config';

export class UserController {
  async createUser(
    input: user.ICreateUserRequest
  ): Promise<user.ICreateUserResponse> {
    const { email, password } = input;
    try {
      let userModel: IUser = await User.findOne({ email });
      if (userModel) {
        return {
          exception: {
            statusCode: HttpStatusCodes.BAD_REQUEST,
            message: 'User already exists',
          },
        };
      }
      //   const options: gravatar.Options = {
      //     s: '200',
      //     r: 'pg',
      //     d: 'mm',
      //   };
      //const avatar = gravatar.url(email, options);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const userFields = {
        email,
        password: hashed,
        //  avatar,
      };

      const newUser = new User(userFields);
      await newUser.save();

      const payload: Payload = {
        userId: newUser.id,
      };

      const token = jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: config.get('jwtExpiration'),
      });

      return {
        exception: {
          statusCode: HttpStatusCodes.OK,
          message: 'Success',
        },
        token: token,
      };
    } catch (err) {
      console.log(err.message);
      return {
        exception: {
          statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal_error',
        },
      };
    }
  }
}

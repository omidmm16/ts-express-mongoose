import { Router, Response } from 'express';
import Request from '@/types/Request';
import { check, validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import { UserController } from '../../controllers/user.controller';
const router = Router();

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const userController = new UserController();
    return userController
      .createUser({ email, password })
      .then((userResponse) => {
        return res.status(userResponse.exception.statusCode).json({
          ...userResponse,
        });
      });
  }
);

export default router;

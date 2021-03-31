import { Router, Response } from 'express';

import auth from '../../middlewares/auth';
import Payload from '../../types/Payload';
import Request from '../../types/Request';
import HttpStatusCodes from 'http-status-codes';
import { AuthController } from '../../controllers/auth.controller';
import { check } from 'express-validator';
const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  const auth = new AuthController();
  return auth.finduser(req, res);
});

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('passwod', 'password is required').exists(),
  ],
  async (req: Request, res: Response) => {
    const auth = new AuthController();
    return auth.findToken(req, res);
  }
);
export default router;

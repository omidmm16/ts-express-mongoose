import { Router, Response } from 'express';
import Request from '@/types/Request';
import { ProfileController } from '../../controllers/profile.controller';
import auth from '../../middlewares/auth';
import { check, validationResult } from 'express-validator';
import HttpStatusCodes from 'http-status-codes';
import { profile } from '@/Dto/profile.dto';
import Profile from '../../models/profile';

const router = Router();

router.get('/me', auth, async (req: Request, res: Response) => {
  const profile = new ProfileController();
  return profile.findMe(req).then((profileRes) => {
    return res.status(profileRes.exception.statusCode).json({
      ...profileRes,
    });
  });
});

router.post(
  '/',
  [
    auth,
    check('firstName', 'FirstName is required').not().isEmpty(),
    check('lastName', 'LastName is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const profileController = new ProfileController();
    let proFields: profile.ProfileRequest;
    proFields = req.body;
    return profileController
      .modifyProfile(proFields, req.userId)
      .then((profileRes) => {
        return res
          .status(profileRes.exception.statusCode)
          .json({ ...profileRes });
      });
  }
);
router.get('/', async (req: Request, res: Response) => {
  const profileController = new ProfileController();
  return profileController.getAllProfile().then((profileRes) => {
    return res.status(profileRes.exception.statusCode).json({ ...profileRes });
  });
});

router.get('/user/:userid', async (req: Request, res: Response) => {
  const profileController = new ProfileController();
  const userId = req.params.userid;
  console.log(userId);
  return profileController.getProfile(userId).then((profileRes) => {
    return res.status(profileRes.exception.statusCode).json({ ...profileRes });
  });
});

router.delete('/', auth, async (req: Request, res: Response) => {
  const profileController = new ProfileController();
  return profileController.removeProfile(req.userId).then((profileRes) => {
    return res.status(profileRes.statusCode).json({ ...profileRes });
  });
});

export default router;

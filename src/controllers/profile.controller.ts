import { profile } from '@/Dto/profile.dto';
import Profile, { IProfile } from '../models/profile';
import Exception from '@/types/Exception';
import Request from '@/types/Request';
import HttpStatusCodes from 'http-status-codes';
export class ProfileController {
  async removeProfile(userId: string): Promise<Exception> {
    try {
      await Profile.findOneAndRemove({ user: userId });
      return {
        statusCode: HttpStatusCodes.OK,
        message: 'Succes',
      };
    } catch (err) {
      console.error(err.message);
      return {
        statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal_Error',
      };
    }
  }
  async getProfile(userId: string): Promise<profile.ProfileResponse> {
    try {
      const profile: IProfile = await Profile.findOne({
        user: userId,
      }).populate('user', ['avatar', 'email']);
      if (!profile) {
        return {
          exception: {
            statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Profile not found',
          },
        };
      }
      return {
        exception: {
          statusCode: HttpStatusCodes.OK,
          message: 'Success',
        },
        profile: profile,
      };
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return {
          exception: {
            statusCode: HttpStatusCodes.BAD_REQUEST,
            message: 'profile not found',
          },
        };
      }
      return {
        exception: {
          statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal_error',
        },
      };
    }
  }
  async getAllProfile(): Promise<profile.getProfiles> {
    try {
      const profiles = await Profile.find().populate('user', [
        'avatar',
        'email',
      ]);
      return {
        profiles: profiles,
        exception: {
          statusCode: HttpStatusCodes.OK,
          message: 'Success',
        },
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

  constructor() {}

  async findMe(req: Request): Promise<profile.ProfileResponse> {
    try {
      const profile: IProfile = await Profile.findOne({
        user: req.userId,
      }).populate('user', ['avatar', 'email']);
      if (!profile) {
        return {
          exception: {
            statusCode: HttpStatusCodes.BAD_REQUEST,
            message: 'There is no profile for this User',
          },
        };
      }
      return {
        exception: {
          statusCode: HttpStatusCodes.OK,
          message: 'Success',
        },
        profile: profile,
      };
    } catch (err) {
      console.error(err);
      return {
        exception: {
          statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: `Internal_Error`,
        },
      };
    }
  }

  async modifyProfile(
    profileInput: profile.ProfileRequest,
    userId: string
  ): Promise<profile.ProfileResponse> {
    const profileFields = {
      user: userId,
      firstName: profileInput.firstName,
      lastName: profileInput.lastName,
      username: profileInput.username,
    };
    try {
      let profile: IProfile = await Profile.findOne({ user: userId });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: userId },
          { $set: profileFields },
          { new: true }
        );
        return {
          exception: {
            statusCode: HttpStatusCodes.OK,
            message: 'Success',
          },
          profile: profile,
        };
      }
      profile = new Profile(profileFields);
      await profile.save();
      return {
        exception: {
          statusCode: HttpStatusCodes.OK,
          message: 'Success',
        },
      };
    } catch (err) {
      console.error(err.message);
      return {
        exception: {
          statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Internal_error',
        },
      };
    }
  }
}

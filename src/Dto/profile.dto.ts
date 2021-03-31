import { IProfile } from '@/models/profile';
import Exception from '@/types/Exception';

export namespace profile {
  export interface ProfileRequest {
    firstName: string;
    lastName: string;
    username: string;
  }

  export interface ProfileResponse {
    profile?: IProfile;
    exception?: Exception;
  }

  export interface getProfiles {
    profiles?: Array<IProfile>;
    exception?: Exception;
  }
}

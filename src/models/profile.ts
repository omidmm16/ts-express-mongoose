import { Model, model, Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IProfile extends Document {
  firstName: string;
  lastName: string;
  username: string;
  user: IUser['_id'];
}

const profileSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Profile: Model<IProfile> = model('Profile', profileSchema);
export default Profile;

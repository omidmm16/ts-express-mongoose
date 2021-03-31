import { model, Schema, Document, Model } from 'mongoose';
export interface IUser extends Document {
  email: String;
  password: string;
  avatar: string;
}
const usersSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = model('User', usersSchema);

export default User;

import { Document, Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Enter a name'],
    minlength: [6, 'Name must be at least 6 characters'],
  },
  email: {
    type: String,
    required: [true, 'Enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  avatar: {
    type: String,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

interface IUserSchema extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  organization?: string;
  date?: Date;
}

export default model<IUserSchema>('User', UserSchema);

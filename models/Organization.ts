import { Document, Schema, model } from 'mongoose';

const OrganizationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Enter an organization name'],
  },
  accessCode: {
    type: String,
    required: [true, 'Enter an access code of the organization'],
    match: [/[0-9]{4}/, 'Enter valid access code'],
    maxlength: [4, 'Enter valid access code'],
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  positions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Position',
    },
  ],
});

export interface IOrganizationSchema extends Document {
  name: string;
  accessCode: string;
  admin: string;
  members: [{ id: string }];
  positions: [{ id: string }];
}

export default model<IOrganizationSchema>('Organization', OrganizationSchema);

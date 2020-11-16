import { Document, Schema, model } from 'mongoose';

const PositionSchema = new Schema({
  positionName: {
    type: String,
    required: [true, 'Enter a position name'],
  },
  startTime: {
    type: String,
    required: [true, 'Enter the time the work starts on the position'],
  },
  endTime: {
    type: String,
    required: [true, 'Enter the time the work ends on the position'],
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});

export interface IPositionSchema extends Document {
  positionName: string;
  startTime: string;
  endTime: string;
  organization: string;
  orders: [{ id: string }];
}

export default model<IPositionSchema>('Position', PositionSchema);

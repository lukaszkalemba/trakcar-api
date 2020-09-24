import { Document, Schema, model } from 'mongoose';

const PositionSchema = new Schema({
  name: {
    type: String,
    unique: true,
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
});

export interface IPositionSchema extends Document {
  name: string;
  startTime: string;
  endTime: string;
}

export default model<IPositionSchema>('Position', PositionSchema);

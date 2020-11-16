import { Document, Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  positionId: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
  },
  date: {
    type: String,
    required: [true, 'Enter the date of order'],
  },
  startTime: {
    type: String,
    required: [true, 'Enter the time of starting work'],
  },
  endTime: {
    type: String,
    required: [true, 'Enter the time of completion of work'],
  },
  orderName: {
    type: String,
    required: [true, 'Enter the name of the order'],
  },
  carBrand: {
    type: String,
    required: [true, 'Enter the vehicle brand'],
  },
  carModel: {
    type: String,
    required: [true, 'Enter the vehicle model'],
  },
  principalName: {
    type: String,
    required: [true, "Enter client's name"],
  },
  cost: {
    type: Number,
    required: [true, 'Enter the price'],
  },
  color: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    default: 0,
    required: [true, 'Enter a distinctive color'],
  },
  description: {
    type: String,
  },
});

enum Color {
  Red = 0,
  Orange = 1,
  Green = 2,
  Violet = 3,
  Blue = 4,
}

export interface IOrderSchema extends Document {
  positionId: string;
  date: string;
  startTime: string;
  endTime: string;
  orderName: string;
  carBrand: string;
  carModel: string;
  principalName: string;
  cost: number;
  color: Color;
  description?: string;
}

export default model<IOrderSchema>('Order', OrderSchema);

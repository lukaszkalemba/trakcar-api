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
    type: String,
    required: [true, 'Enter a distinctive color'],
  },
  description: {
    type: String,
  },
});

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
  color: 'red' | 'orange' | 'green' | 'violet' | 'blue';
  description?: string;
}

export default model<IOrderSchema>('Order', OrderSchema);

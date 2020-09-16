import express, { Application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import connectDB from './config/db';
import orders from './routes/api/orders';

dotenv.config({ path: './config/config.env' });

connectDB();

const app: Application = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/orders', orders);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    colors.yellow.bold(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
);

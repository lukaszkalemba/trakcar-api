import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import connectDB from 'config/db';
import users from 'routes/api/users';
import organizations from 'routes/api/organizations';
import positions from 'routes/api/positions';
import orders from 'routes/api/orders';

dotenv.config({ path: 'config/config.env' });

connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', users);
app.use('/api/v1/organizations', organizations);
app.use('/api/v1/positions', positions);
app.use('/api/v1/orders', orders);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    colors.yellow.bold(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
);

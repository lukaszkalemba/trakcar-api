import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/.env` });

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log(colors.cyan.bold(`MongoDB Connected: ${conn.connection.host}`));
  } catch (err) {
    console.log(colors.red(`Error: ${err.message}`));
    process.exit(1);
  }
};

export default connectDB;

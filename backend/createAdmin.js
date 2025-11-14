import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI missing');
}

mongoose.set('strictQuery', true);

const createAdmin = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    admin = new User({
      name: 'Super Admin',
      email,
      password,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin created successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Error while creating admin:', err);
    process.exit(1);
  }
};

createAdmin();

const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
require('dotenv').config();

const seedUser = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'user@example.com' });
    
    if (existingUser) {
      console.log('User already exists');
      console.log('Email: user@example.com');
      console.log('Password: user123');
      process.exit(0);
    }

    // Create regular user
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      isActive: true
    });

    await regularUser.save();

    console.log('User created successfully!');
    console.log('Email: user@example.com');
    console.log('Password: user123');
    console.log('Role: user');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

// Run the seeder
seedUser();
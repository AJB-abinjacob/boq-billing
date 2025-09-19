const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boq-billing', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    // Clear existing users (optional - remove if you want to keep existing users)
    await User.deleteMany({});
    console.log('Existing users cleared');

    // Create Admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    // Create Regular user
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      isActive: true
    });

    // Create Manager user
    const managerUser = new User({
      name: 'Manager User',
      email: 'manager@example.com',
      password: 'manager123',
      role: 'manager',
      isActive: true
    });

    // Save all users
    await adminUser.save();
    await regularUser.save();
    await managerUser.save();

    console.log('Users created successfully:');
    console.log('- Admin: admin@example.com / admin123');
    console.log('- User: user@example.com / user123');
    console.log('- Manager: manager@example.com / manager123');

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
createUsers();
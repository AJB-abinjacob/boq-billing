const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB directly
mongoose.connect('mongodb://localhost:27017/boq-billing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDemoUsers = async () => {
  try {
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log('✅ Admin user created: admin@example.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create regular user
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      const regularUser = new User({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        isActive: true
      });
      await regularUser.save();
      console.log('✅ Regular user created: user@example.com / user123');
    } else {
      console.log('✅ Regular user already exists');
    }

    console.log('🎉 Demo users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedDemoUsers();
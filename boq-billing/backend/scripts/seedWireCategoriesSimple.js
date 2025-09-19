const mongoose = require('mongoose');
const Category = require('../models/Category');

// Use existing admin user ID (first user from the database)
const ADMIN_USER_ID = '68cd386ff225c6fd40615b12';

const seedWireCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/boq-billing', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing wire-related categories
    await Category.deleteMany({
      name: { $in: ['Electrical Wires & Cables', 'PVC Insulated Wires', 'XLPE Insulated Wires', 'Flexible Wires', 'Armoured Cables', 'Unarmoured Cables', 'Control Cables', 'Instrumentation Cables'] }
    });
    console.log('Cleared existing wire categories');

    // Create main electrical wire category
    const mainWireCategory = new Category({
      name: 'Electrical Wires & Cables',
      description: 'Complete range of electrical wires and cables for various applications',
      isActive: true,
      parentCategory: null,
      createdBy: ADMIN_USER_ID
    });
    await mainWireCategory.save();
    console.log('Created main electrical wire category');

    // Create subcategories under the main category
    const subCategories = [
      {
        name: 'PVC Insulated Wires',
        description: 'PVC insulated copper wires for domestic and industrial use',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      },
      {
        name: 'XLPE Insulated Wires',
        description: 'Cross-linked polyethylene insulated wires for high temperature applications',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      },
      {
        name: 'Flexible Wires',
        description: 'Multi-strand flexible copper wires for movable applications',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      },
      {
        name: 'Armoured Cables',
        description: 'Steel wire armoured cables for underground and outdoor use',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      },
      {
        name: 'Unarmoured Cables',
        description: 'Unarmoured power cables for indoor and controlled environments',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      },
      {
        name: 'Control Cables',
        description: 'Multi-core control cables for automation and control systems',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      },
      {
        name: 'Instrumentation Cables',
        description: 'Shielded instrumentation cables for signal transmission',
        isActive: true,
        parentCategory: mainWireCategory._id,
        createdBy: ADMIN_USER_ID
      }
    ];

    // Create subcategories
    for (const subCat of subCategories) {
      const newSubCat = new Category(subCat);
      await newSubCat.save();
      console.log(`Created subcategory: ${subCat.name}`);
    }

    console.log('Wire categories seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding wire categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedWireCategories();
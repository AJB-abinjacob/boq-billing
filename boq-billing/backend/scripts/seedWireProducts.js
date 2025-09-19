const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Use existing admin user ID (first user from the database)
const ADMIN_USER_ID = '68cd386ff225c6fd40615b12';

// Wire products data with different sizes and prices
const wireProducts = [
  // PVC Insulated Wires - 1.5 sq mm
  {
    name: 'PVC Insulated Wire - 1.5 sq mm',
    description: 'Single core PVC insulated copper wire, 1.5 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 28.50,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'PVC Insulated Wires',
    isActive: true
  },
  // PVC Insulated Wires - 2.5 sq mm
  {
    name: 'PVC Insulated Wire - 2.5 sq mm',
    description: 'Single core PVC insulated copper wire, 2.5 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 42.75,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'PVC Insulated Wires',
    isActive: true
  },
  // PVC Insulated Wires - 4 sq mm
  {
    name: 'PVC Insulated Wire - 4.0 sq mm',
    description: 'Single core PVC insulated copper wire, 4.0 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 68.90,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'PVC Insulated Wires',
    isActive: true
  },
  // PVC Insulated Wires - 6 sq mm
  {
    name: 'PVC Insulated Wire - 6.0 sq mm',
    description: 'Single core PVC insulated copper wire, 6.0 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 98.50,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'PVC Insulated Wires',
    isActive: true
  },
  // Flexible Wires - 1.5 sq mm
  {
    name: 'Flexible Wire - 1.5 sq mm',
    description: 'Multi-strand flexible copper wire, 1.5 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 32.25,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'Flexible Wires',
    isActive: true
  },
  // Flexible Wires - 2.5 sq mm
  {
    name: 'Flexible Wire - 2.5 sq mm',
    description: 'Multi-strand flexible copper wire, 2.5 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 48.90,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'Flexible Wires',
    isActive: true
  },
  // Flexible Wires - 4 sq mm
  {
    name: 'Flexible Wire - 4.0 sq mm',
    description: 'Multi-strand flexible copper wire, 4.0 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 78.50,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'Flexible Wires',
    isActive: true
  },
  // Flexible Wires - 6 sq mm
  {
    name: 'Flexible Wire - 6.0 sq mm',
    description: 'Multi-strand flexible copper wire, 6.0 sq mm, 1100V grade, ISI marked',
    unit: 'Meter',
    rate: 112.75,
    gstPercentage: 18,
    hsnCode: '85444910',
    categoryName: 'Flexible Wires',
    isActive: true
  }
];

const seedWireProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/boq-billing', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing wire products
    await Product.deleteMany({
      categoryName: { $in: ['PVC Insulated Wires', 'Flexible Wires'] }
    });
    console.log('Cleared existing wire products');

    // Get category IDs for the wire categories
    const categories = await Category.find({
      name: { $in: ['PVC Insulated Wires', 'Flexible Wires'] }
    });

    console.log(`Found ${categories.length} wire categories`);

    // Create a map of category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Create products
    for (const productData of wireProducts) {
      const categoryId = categoryMap[productData.categoryName];
      if (categoryId) {
        const product = new Product({
          ...productData,
          category: categoryId,
          createdBy: ADMIN_USER_ID
        });
        await product.save();
        console.log(`Created product: ${productData.name} - ₹${productData.rate}/meter`);
      } else {
        console.log(`Category not found: ${productData.categoryName}`);
      }
    }

    console.log('Wire products seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding wire products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedWireProducts();
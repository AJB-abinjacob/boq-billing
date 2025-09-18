const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      min: [0, 'Rate cannot be negative']
    },
    gstPercentage: {
      type: Number,
      default: 0,
      min: [0, 'GST percentage cannot be negative'],
      max: [100, 'GST percentage cannot exceed 100']
    },
    hsnCode: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound indexes for faster queries
productSchema.index({ companyId: 1, name: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text index for search

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
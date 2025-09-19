const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  categoryName: {
    type: String,
    required: [true, 'Category name is required']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [0, 'Rate must be positive']
  },
  gstPercentage: {
    type: Number,
    default: 0,
    min: [0, 'GST percentage cannot be negative'],
    max: [100, 'GST percentage cannot exceed 100%']
  },
  hsnCode: {
    type: String,
    trim: true,
    maxlength: [20, 'HSN code cannot exceed 20 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Temporarily optional since authentication is disabled
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ name: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ categoryName: 1, isActive: 1 });

// Pre-save middleware to update categoryName
productSchema.pre('save', async function(next) {
  if (this.isModified('category')) {
    try {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.category);
      if (category) {
        this.categoryName = category.name;
      }
    } catch (error) {
      console.error('Error updating categoryName:', error);
    }
  }
  next();
});

// Static method to get products by category
productSchema.statics.getByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true }).sort({ name: 1 });
};

// Virtual for product pricing with GST
productSchema.virtual('priceWithGST').get(function() {
  return this.rate * (1 + this.gstPercentage / 100);
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
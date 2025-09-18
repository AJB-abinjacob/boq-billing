const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for child categories
categorySchema.virtual('childCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Create compound index for faster queries
categorySchema.index({ companyId: 1, name: 1 });
categorySchema.index({ parentCategory: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
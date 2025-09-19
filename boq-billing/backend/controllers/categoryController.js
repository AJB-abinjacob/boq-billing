const Category = require('../models/Category');

/**
 * Get all categories
 * @route GET /api/categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name')
      .sort({ name: 1 });
    
    // Build hierarchical structure
    const categoryMap = {};
    const rootCategories = [];
    
    categories.forEach(category => {
      categoryMap[category._id] = { ...category.toObject(), children: [] };
    });
    
    categories.forEach(category => {
      if (category.parentCategory) {
        const parentId = category.parentCategory._id.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[category._id]);
        }
      } else {
        rootCategories.push(categoryMap[category._id]);
      }
    });
    
    res.json({
      success: true,
      data: rootCategories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

/**
 * Get category by ID
 * @route GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name description');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

/**
 * Create a new category
 * @route POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, isActive } = req.body;
    
    // Check if category name already exists
    const existingCategory = await Category.findOne({ name, isActive: true });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: null // Temporarily set to null since authentication is disabled
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

/**
 * Update a category
 * @route PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, isActive } = req.body;
    
    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name, 
        _id: { $ne: req.params.id },
        isActive: true 
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }
    
    // Update category
    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.parentCategory = parentCategory !== undefined ? parentCategory : category.parentCategory;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    
    await category.save();
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

/**
 * Delete a category
 * @route DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const Product = require('../models/Product');
    const hasProducts = await Product.exists({ category: req.params.id });
    
    if (hasProducts) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that contains products'
      });
    }
    
    // Check if category has subcategories
    const hasSubcategories = await Category.exists({ parentCategory: req.params.id });
    
    if (hasSubcategories) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that contains subcategories'
      });
    }
    
    // Soft delete by setting isActive to false
    category.isActive = false;
    await category.save();
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
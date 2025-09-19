const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * Get all products with optional filtering
 * @route GET /api/products
 */
const getAllProducts = async (req, res) => {
  try {
    const { category, search, isActive } = req.query;
    const filter = {};

    // Build filter object
    if (category) {
      filter.category = category;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    filter.isActive = filter.isActive !== undefined ? filter.isActive : true;

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('category', 'name description')
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

/**
 * Get product by ID
 * @route GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

/**
 * Create a new product
 * @route POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, category, unit, rate, gstPercentage, hsnCode, isActive } = req.body;

    // Validate required fields
    if (!name || !category || !unit || rate === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, unit, and rate are required'
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    // Check if product name already exists in the same category
    const existingProduct = await Product.findOne({ 
      name: name.trim(), 
      category: category,
      isActive: true 
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists in this category'
      });
    }

    const product = new Product({
      name: name.trim(),
      description: description ? description.trim() : '',
      category: category,
      categoryName: categoryExists.name,
      unit: unit.trim(),
      rate: parseFloat(rate),
      gstPercentage: gstPercentage ? parseFloat(gstPercentage) : 0,
      hsnCode: hsnCode ? hsnCode.trim() : '',
      isActive: isActive !== undefined ? isActive : true,
      createdBy: null // Temporarily set to null since authentication is disabled
    });

    await product.save();

    // Populate the created product
    await product.populate('category', 'name description');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

/**
 * Update a product
 * @route PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { name, description, category, unit, rate, gstPercentage, hsnCode, isActive } = req.body;

    // Find the product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If category is being changed, validate it
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }
      product.category = category;
      product.categoryName = categoryExists.name;
    }

    // Check for duplicate name if name is being changed
    if (name && name.trim() !== product.name) {
      const existingProduct = await Product.findOne({ 
        name: name.trim(), 
        category: product.category,
        _id: { $ne: req.params.id },
        isActive: true 
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this name already exists in this category'
        });
      }
      product.name = name.trim();
    }

    // Update other fields
    if (description !== undefined) {
      product.description = description ? description.trim() : '';
    }
    if (unit !== undefined) {
      product.unit = unit.trim();
    }
    if (rate !== undefined) {
      product.rate = parseFloat(rate);
    }
    if (gstPercentage !== undefined) {
      product.gstPercentage = parseFloat(gstPercentage);
    }
    if (hsnCode !== undefined) {
      product.hsnCode = hsnCode ? hsnCode.trim() : '';
    }
    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    product.updatedBy = null; // Temporarily set to null since authentication is disabled
    await product.save();

    // Populate the updated product
    await product.populate('category', 'name description');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

/**
 * Delete a product
 * @route DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is used in any bills (soft delete approach)
    // For now, we'll just set isActive to false
    product.isActive = false;
    product.updatedBy = null; // Temporarily set to null since authentication is disabled
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

/**
 * Get products by category
 * @route GET /api/products/category/:categoryId
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { isActive } = req.query;

    // Validate category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const filter = { category: categoryId };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true;
    }

    const products = await Product.find(filter)
      .populate('category', 'name description')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: products,
      count: products.length,
      category: category.name
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
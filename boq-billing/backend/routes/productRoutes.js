const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Import controllers
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');

// Routes (authentication temporarily disabled for development)
router.get('/', /* authenticate, */ getAllProducts);
router.get('/:id', /* authenticate, */ getProductById);
router.post('/', /* authenticate, authorize(['admin']), */ createProduct);
router.put('/:id', /* authenticate, authorize(['admin']), */ updateProduct);
router.delete('/:id', /* authenticate, authorize(['admin']), */ deleteProduct);
router.get('/category/:categoryId', /* authenticate, */ getProductsByCategory);

module.exports = router;
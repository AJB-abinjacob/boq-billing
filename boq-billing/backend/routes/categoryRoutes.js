const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Import controllers
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Routes (authentication temporarily disabled for development)
router.get('/', /* authenticate, */ getAllCategories);
router.get('/:id', /* authenticate, */ getCategoryById);
router.post('/', /* authenticate, authorize(['admin']), */ createCategory);
router.put('/:id', /* authenticate, authorize(['admin']), */ updateCategory);
router.delete('/:id', /* authenticate, authorize(['admin']), */ deleteCategory);

module.exports = router;
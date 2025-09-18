const express = require('express');
const router = express.Router();

// Import controllers (placeholder implementation)
const productController = {
  getAllProducts: (req, res) => {
    res.json({ message: 'Get all products', data: [] });
  },
  getProductById: (req, res) => {
    res.json({ message: 'Get product by ID', id: req.params.id });
  },
  createProduct: (req, res) => {
    res.json({ message: 'Create product', data: req.body });
  },
  updateProduct: (req, res) => {
    res.json({ message: 'Update product', id: req.params.id, data: req.body });
  },
  deleteProduct: (req, res) => {
    res.json({ message: 'Delete product', id: req.params.id });
  }
};

// Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
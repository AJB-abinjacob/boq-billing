const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllPricing,
  getPricingById,
  createPricing,
  updatePricing,
  deletePricing,
  calculatePrice,
  getPricingHistory
} = require('../controllers/pricingController');

// Public routes
router.post('/calculate', calculatePrice);

// Protected routes - require authentication
router.get('/', authenticate, getAllPricing);
router.get('/:id', authenticate, getPricingById);
router.get('/history/:productId', authenticate, getPricingHistory);

// Admin only routes
router.post('/', authenticate, authorize(['admin', 'manager']), createPricing);
router.put('/:id', authenticate, authorize(['admin', 'manager']), updatePricing);
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deletePricing);

module.exports = router;
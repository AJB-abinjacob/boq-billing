const Pricing = require('../models/Pricing');
const Product = require('../models/Product');

/**
 * Get all pricing with optional filtering
 * @route GET /api/pricing
 */
const getAllPricing = async (req, res) => {
  try {
    const { product, category, wireSize, wireType, customerType, isActive } = req.query;
    const filter = {};

    // Build filter object
    if (product) {
      filter.product = product;
    }
    if (customerType) {
      filter.customerType = customerType;
    }
    if (wireSize) {
      filter.wireSize = parseFloat(wireSize);
    }
    if (wireType) {
      filter.wireType = wireType;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    filter.isActive = filter.isActive !== undefined ? filter.isActive : true;

    // Filter by effective date
    const now = new Date();
    filter.effectiveFrom = { $lte: now };
    filter.$or = [
      { effectiveTo: { $exists: false } },
      { effectiveTo: { $gte: now } }
    ];

    const pricing = await Pricing.find(filter)
      .populate('product', 'name description category unit')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ productName: 1, variant: 1, effectiveFrom: -1 });

    res.json({
      success: true,
      data: pricing,
      count: pricing.length
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing',
      error: error.message
    });
  }
};

/**
 * Get pricing by ID
 * @route GET /api/pricing/:id
 */
const getPricingById = async (req, res) => {
  try {
    const pricing = await Pricing.findById(req.params.id)
      .populate('product', 'name description category unit')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Error fetching pricing by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing',
      error: error.message
    });
  }
};

/**
 * Create new pricing
 * @route POST /api/pricing
 */
const createPricing = async (req, res) => {
  try {
    const {
      product,
      variant,
      specification,
      baseRate,
      gstPercentage,
      volumePricing,
      effectiveFrom,
      effectiveTo,
      customerType,
      wireSize,
      wireType,
      insulation,
      conductor,
      costPrice,
      markupPercentage,
      isActive
    } = req.body;

    // Validate required fields
    if (!product || baseRate === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product and base rate are required'
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Check for duplicate pricing (same product + variant + customer type + effective period)
    const existingPricing = await Pricing.findOne({
      product: product,
      variant: variant || '',
      customerType: customerType || 'all',
      effectiveFrom: { $lte: effectiveTo || new Date('2099-12-31') },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: effectiveFrom || new Date() } }
      ],
      isActive: true
    });

    if (existingPricing) {
      return res.status(400).json({
        success: false,
        message: 'Active pricing already exists for this product variant and customer type in the given time period'
      });
    }

    // Validate volume pricing tiers
    if (volumePricing && volumePricing.length > 0) {
      for (let i = 0; i < volumePricing.length; i++) {
        const tier = volumePricing[i];
        if (!tier.minQuantity || tier.rate === undefined) {
          return res.status(400).json({
            success: false,
            message: `Volume pricing tier ${i + 1}: minQuantity and rate are required`
          });
        }
        if (tier.maxQuantity && tier.maxQuantity <= tier.minQuantity) {
          return res.status(400).json({
            success: false,
            message: `Volume pricing tier ${i + 1}: maxQuantity must be greater than minQuantity`
          });
        }
      }
    }

    const pricing = new Pricing({
      product: product,
      productName: productExists.name,
      variant: variant ? variant.trim() : '',
      specification: specification ? specification.trim() : '',
      unit: productExists.unit,
      baseRate: parseFloat(baseRate),
      gstPercentage: gstPercentage ? parseFloat(gstPercentage) : 0,
      volumePricing: volumePricing || [],
      effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date(),
      effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
      customerType: customerType || 'all',
      wireSize: wireSize ? parseFloat(wireSize) : undefined,
      wireType: wireType,
      insulation: insulation,
      conductor: conductor || 'copper',
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      markupPercentage: markupPercentage ? parseFloat(markupPercentage) : undefined,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });

    await pricing.save();

    const populatedPricing = await Pricing.findById(pricing._id)
      .populate('product', 'name description category unit')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Pricing created successfully',
      data: populatedPricing
    });
  } catch (error) {
    console.error('Error creating pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating pricing',
      error: error.message
    });
  }
};

/**
 * Update pricing
 * @route PUT /api/pricing/:id
 */
const updatePricing = async (req, res) => {
  try {
    const {
      variant,
      specification,
      baseRate,
      gstPercentage,
      volumePricing,
      effectiveFrom,
      effectiveTo,
      customerType,
      wireSize,
      wireType,
      insulation,
      conductor,
      costPrice,
      markupPercentage,
      isActive
    } = req.body;

    // Find the pricing
    const pricing = await Pricing.findById(req.params.id);
    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    // Check for overlapping pricing if dates are being changed
    if (effectiveFrom || effectiveTo) {
      const existingPricing = await Pricing.findOne({
        _id: { $ne: req.params.id },
        product: pricing.product,
        variant: pricing.variant,
        customerType: customerType || pricing.customerType,
        effectiveFrom: { $lte: effectiveTo || pricing.effectiveTo || new Date('2099-12-31') },
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: { $gte: effectiveFrom || pricing.effectiveFrom } }
        ],
        isActive: true
      });

      if (existingPricing) {
        return res.status(400).json({
          success: false,
          message: 'Overlapping pricing exists for this product variant and customer type'
        });
      }
    }

    // Update fields
    if (variant !== undefined) {
      pricing.variant = variant ? variant.trim() : '';
    }
    if (specification !== undefined) {
      pricing.specification = specification ? specification.trim() : '';
    }
    if (baseRate !== undefined) {
      pricing.baseRate = parseFloat(baseRate);
    }
    if (gstPercentage !== undefined) {
      pricing.gstPercentage = parseFloat(gstPercentage);
    }
    if (volumePricing !== undefined) {
      pricing.volumePricing = volumePricing;
    }
    if (effectiveFrom !== undefined) {
      pricing.effectiveFrom = new Date(effectiveFrom);
    }
    if (effectiveTo !== undefined) {
      pricing.effectiveTo = effectiveTo ? new Date(effectiveTo) : undefined;
    }
    if (customerType !== undefined) {
      pricing.customerType = customerType;
    }
    if (wireSize !== undefined) {
      pricing.wireSize = wireSize ? parseFloat(wireSize) : undefined;
    }
    if (wireType !== undefined) {
      pricing.wireType = wireType;
    }
    if (insulation !== undefined) {
      pricing.insulation = insulation;
    }
    if (conductor !== undefined) {
      pricing.conductor = conductor;
    }
    if (costPrice !== undefined) {
      pricing.costPrice = costPrice ? parseFloat(costPrice) : undefined;
    }
    if (markupPercentage !== undefined) {
      pricing.markupPercentage = markupPercentage ? parseFloat(markupPercentage) : undefined;
    }
    if (isActive !== undefined) {
      pricing.isActive = isActive;
    }

    pricing.updatedBy = req.user.id;
    await pricing.save();

    const populatedPricing = await Pricing.findById(pricing._id)
      .populate('product', 'name description category unit')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Pricing updated successfully',
      data: populatedPricing
    });
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating pricing',
      error: error.message
    });
  }
};

/**
 * Delete pricing
 * @route DELETE /api/pricing/:id
 */
const deletePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findById(req.params.id);

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    // Check if pricing is used in any active bills
    // For now, we'll just set isActive to false (soft delete)
    pricing.isActive = false;
    pricing.updatedBy = req.user.id;
    await pricing.save();

    res.json({
      success: true,
      message: 'Pricing deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting pricing',
      error: error.message
    });
  }
};

/**
 * Calculate price for a product with given quantity and customer type
 * @route POST /api/pricing/calculate
 */
const calculatePrice = async (req, res) => {
  try {
    const { productId, quantity, customerType, variant } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    // Find active pricing for the product
    const now = new Date();
    const pricing = await Pricing.findOne({
      product: productId,
      variant: variant || '',
      $or: [
        { customerType: 'all' },
        { customerType: customerType || 'all' }
      ],
      effectiveFrom: { $lte: now },
      $or: [
        { effectiveTo: { $exists: false } },
        { effectiveTo: { $gte: now } }
      ],
      isActive: true
    }).sort({ effectiveFrom: -1 });

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'No active pricing found for this product'
      });
    }

    const priceCalculation = pricing.calculatePrice(parseFloat(quantity));

    res.json({
      success: true,
      data: {
        pricing: pricing,
        calculation: priceCalculation
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating price',
      error: error.message
    });
  }
};

/**
 * Get pricing history for a product
 * @route GET /api/pricing/history/:productId
 */
const getPricingHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 50 } = req.query;

    const pricingHistory = await Pricing.find({
      product: productId
    })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ effectiveFrom: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: pricingHistory,
      count: pricingHistory.length
    });
  } catch (error) {
    console.error('Error fetching pricing history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing history',
      error: error.message
    });
  }
};

module.exports = {
  getAllPricing,
  getPricingById,
  createPricing,
  updatePricing,
  deletePricing,
  calculatePrice,
  getPricingHistory
};
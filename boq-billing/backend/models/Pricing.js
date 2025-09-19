const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  variant: {
    type: String,
    trim: true,
    maxlength: [100, 'Variant cannot exceed 100 characters']
  },
  specification: {
    type: String,
    trim: true,
    maxlength: [200, 'Specification cannot exceed 200 characters']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    maxlength: [50, 'Unit cannot exceed 50 characters']
  },
  baseRate: {
    type: Number,
    required: [true, 'Base rate is required'],
    min: [0, 'Base rate must be positive']
  },
  gstPercentage: {
    type: Number,
    default: 0,
    min: [0, 'GST percentage cannot be negative'],
    max: [100, 'GST percentage cannot exceed 100%']
  },
  
  // Volume-based pricing tiers
  volumePricing: [{
    minQuantity: {
      type: Number,
      required: true,
      min: [1, 'Minimum quantity must be at least 1']
    },
    maxQuantity: {
      type: Number,
      min: [1, 'Maximum quantity must be at least 1']
    },
    rate: {
      type: Number,
      required: true,
      min: [0, 'Rate must be positive']
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100%']
    }
  }],
  
  // Time-based pricing
  effectiveFrom: {
    type: Date,
    required: [true, 'Effective from date is required'],
    default: Date.now
  },
  effectiveTo: {
    type: Date
  },
  
  // Customer-specific pricing
  customerType: {
    type: String,
    enum: ['all', 'retail', 'wholesale', 'contractor', 'dealer'],
    default: 'all'
  },
  
  // Wire-specific fields
  wireSize: {
    type: Number, // in sq mm (1.5, 2.5, 4, 6, 10, etc.)
    min: [0.1, 'Wire size must be positive']
  },
  wireType: {
    type: String,
    enum: ['single_core', 'multi_core', 'armored', 'flexible', 'house_wire'],
    trim: true
  },
  insulation: {
    type: String,
    enum: ['pvc', 'xlpe', 'rubber', 'thermoplastic'],
    trim: true
  },
  conductor: {
    type: String,
    enum: ['copper', 'aluminum', 'silver'],
    default: 'copper'
  },
  
  // Pricing metadata
  costPrice: {
    type: Number,
    min: [0, 'Cost price must be positive']
  },
  markupPercentage: {
    type: Number,
    min: [0, 'Markup percentage cannot be negative']
  },
  
  // Status and tracking
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Reference fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
pricingSchema.index({ product: 1, isActive: 1 });
pricingSchema.index({ product: 1, variant: 1, isActive: 1 });
pricingSchema.index({ effectiveFrom: 1, effectiveTo: 1 });
pricingSchema.index({ customerType: 1, isActive: 1 });
pricingSchema.index({ wireSize: 1, wireType: 1, isActive: 1 });

// Pre-save middleware to update productName
pricingSchema.pre('save', async function(next) {
  if (this.isModified('product')) {
    try {
      const Product = mongoose.model('Product');
      const product = await Product.findById(this.product);
      if (product) {
        this.productName = product.name;
        this.unit = product.unit;
      }
    } catch (error) {
      console.error('Error updating productName:', error);
    }
  }
  next();
});

// Method to calculate price based on quantity
pricingSchema.methods.calculatePrice = function(quantity) {
  let rate = this.baseRate;
  
  // Check volume pricing tiers
  for (const tier of this.volumePricing) {
    if (quantity >= tier.minQuantity && 
        (!tier.maxQuantity || quantity <= tier.maxQuantity)) {
      rate = tier.rate;
      break;
    }
  }
  
  const totalAmount = rate * quantity;
  const gstAmount = (totalAmount * this.gstPercentage) / 100;
  const grandTotal = totalAmount + gstAmount;
  
  return {
    rate,
    quantity,
    totalAmount,
    gstAmount,
    grandTotal,
    gstPercentage: this.gstPercentage
  };
};

// Static method to get active pricing for a product
pricingSchema.statics.getActivePricing = function(productId, customerType = 'all') {
  const now = new Date();
  return this.find({
    product: productId,
    isActive: true,
    effectiveFrom: { $lte: now },
    $or: [
      { effectiveTo: { $exists: false } },
      { effectiveTo: { $gte: now } }
    ],
    $or: [
      { customerType: 'all' },
      { customerType: customerType }
    ]
  }).sort({ effectiveFrom: -1 });
};

// Virtual for price with GST
pricingSchema.virtual('priceWithGST').get(function() {
  return this.baseRate * (1 + this.gstPercentage / 100);
});

// Ensure virtual fields are serialized
pricingSchema.set('toJSON', { virtuals: true });
pricingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Pricing', pricingSchema);
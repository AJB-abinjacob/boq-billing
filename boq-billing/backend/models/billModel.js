const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  quantity: {
    type: Number,
    required: true,
    min: [0.01, 'Quantity must be greater than 0']
  },
  unit: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Rate cannot be negative']
  },
  amount: {
    type: Number,
    required: true
  },
  gstPercentage: {
    type: Number,
    default: 0
  },
  gstAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BillTemplate'
    },
    customerInfo: {
      name: String,
      address: String,
      email: String,
      phone: String,
      gstin: String
    },
    billDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    items: [billItemSchema],
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    subtotal: {
      type: Number,
      required: true
    },
    totalGST: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ['draft', 'finalized', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled'],
      default: 'draft'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid'],
      default: 'unpaid'
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    isDraft: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound indexes for faster queries
billSchema.index({ companyId: 1, billNumber: 1 });
billSchema.index({ status: 1 });
billSchema.index({ billDate: 1 });
billSchema.index({ 'customerInfo.name': 'text' }); // Text index for search

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Payment amount must be greater than 0']
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'check', 'credit_card', 'upi', 'other'],
      default: 'bank_transfer'
    },
    referenceNumber: {
      type: String,
      trim: true
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create compound indexes for faster queries
paymentSchema.index({ billId: 1 });
paymentSchema.index({ companyId: 1 });
paymentSchema.index({ paymentDate: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
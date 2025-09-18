const mongoose = require('mongoose');

const fieldDefinitionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Field label is required'],
    trim: true
  },
  key: {
    type: String,
    required: [true, 'Field key is required'],
    trim: true
  },
  dataType: {
    type: String,
    enum: ['text', 'number', 'date', 'dropdown', 'formula'],
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  options: {
    type: [String],
    default: []
  },
  formula: {
    type: String,
    default: null
  }
});

const billTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required']
    },
    fields: [fieldDefinitionSchema],
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for faster queries
billTemplateSchema.index({ companyId: 1, name: 1 });

const BillTemplate = mongoose.model('BillTemplate', billTemplateSchema);

module.exports = BillTemplate;
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    logo: {
      type: String,
      default: null
    },
    branding: {
      primaryColor: {
        type: String,
        default: '#3B82F6' // Default blue color
      },
      secondaryColor: {
        type: String,
        default: '#1E3A8A'
      },
      fontFamily: {
        type: String,
        default: 'Arial, sans-serif'
      }
    },
    pdfLayout: {
      headerTemplate: {
        type: String,
        default: 'default'
      },
      footerTemplate: {
        type: String,
        default: 'default'
      },
      pageSize: {
        type: String,
        default: 'A4'
      },
      orientation: {
        type: String,
        enum: ['portrait', 'landscape'],
        default: 'portrait'
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    contactInfo: {
      email: String,
      phone: String,
      website: String
    },
    taxInfo: {
      gstin: String,
      pan: String
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

// Create index for faster queries
companySchema.index({ name: 1 });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
const Company = require('../models/companyModel');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Public
const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Public
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    Object.assign(company, req.body);
    const updatedCompany = await company.save();
    
    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Public
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    await company.deleteOne();
    
    res.json({ message: 'Company removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
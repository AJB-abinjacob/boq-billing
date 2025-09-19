import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaCalculator } from 'react-icons/fa';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import PricingForm from '../../components/PricingForm';

const PricingList = () => {
  const [pricing, setPricing] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pricingToDelete, setPricingToDelete] = useState(null);

  useEffect(() => {
    fetchPricing();
    fetchProducts();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pricing');
      setPricing(response.data.data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Error fetching pricing data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error fetching products');
    }
  };

  const handleCreate = () => {
    setEditingPricing(null);
    setShowForm(true);
  };

  const handleEdit = (pricing) => {
    setEditingPricing(pricing);
    setShowForm(true);
  };

  const handleDelete = (pricing) => {
    setPricingToDelete(pricing);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/pricing/${pricingToDelete._id}`);
      toast.success('Pricing deleted successfully');
      fetchPricing();
    } catch (error) {
      console.error('Error deleting pricing:', error);
      toast.error('Error deleting pricing');
    } finally {
      setDeleteModal(false);
      setPricingToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPricing) {
        await api.put(`/pricing/${editingPricing._id}`, formData);
        toast.success('Pricing updated successfully');
      } else {
        await api.post('/pricing', formData);
        toast.success('Pricing created successfully');
      }
      setShowForm(false);
      fetchPricing();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Error saving pricing');
    }
  };

  const filteredPricing = pricing.filter(price => {
    const matchesSearch = price.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.specification?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = !productFilter || price.product._id === productFilter;
    const matchesCustomerType = !customerTypeFilter || price.customerType === customerTypeFilter;

    return matchesSearch && matchesProduct && matchesCustomerType;
  });

  const getProductName = (pricing) => {
    const product = products.find(p => p._id === pricing.product);
    return product ? product.name : pricing.productName;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pricing Management</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Pricing
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search pricing..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={customerTypeFilter}
              onChange={(e) => setCustomerTypeFilter(e.target.value)}
            >
              <option value="">All Customer Types</option>
              <option value="all">All Customers</option>
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effective From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPricing.map((price) => (
                <tr key={price._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProductName(price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {price.variant || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {price.specification || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{price.baseRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {price.gstPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {price.customerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(price.effectiveFrom).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      price.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {price.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(price)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(price)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPricing.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No pricing found matching your criteria
          </div>
        )}
      </div>

      {/* Pricing Form Modal */}
      {showForm && (
        <PricingForm
          pricing={editingPricing}
          products={products}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <ConfirmModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Pricing"
          message={`Are you sure you want to delete this pricing for ${pricingToDelete?.productName}?`}
        />
      )}
    </div>
  );
};

export default PricingList;
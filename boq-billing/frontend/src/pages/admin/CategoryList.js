import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CategoryService from '../../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddNew = () => {
    setCurrentCategory(null);
    setFormData({
      name: '',
      description: '',
      parentCategory: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategory: category.parentCategory || '',
      isActive: category.isActive
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentCategory) {
        // Update existing category
        await CategoryService.updateCategory(currentCategory._id, formData);
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        await CategoryService.createCategory(formData);
        toast.success('Category created successfully!');
      }
      
      setIsModalOpen(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory(id);
        toast.success('Category deleted successfully!');
        fetchCategories(); // Refresh the list
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  const renderCategoryRow = (category, level = 0) => {
    const isExpanded = expandedCategories[category._id];
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <React.Fragment key={category._id}>
        <tr className={level > 0 ? 'bg-gray-50' : 'bg-white'}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              {hasChildren && (
                <button 
                  onClick={() => toggleExpand(category._id)}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  <FiChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} />
                </button>
              )}
              <div style={{ marginLeft: `${level * 20}px` }} className="text-sm font-medium text-gray-900">
                {category.name}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{category.description}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.isActive ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => handleEdit(category)}
              className="text-primary-600 hover:text-primary-900 mr-4"
            >
              <FiEdit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(category._id)}
              className="text-red-600 hover:text-red-900"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </td>
        </tr>
        {isExpanded && hasChildren && category.children.map(child => 
          renderCategoryRow(child, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <Button onClick={handleAddNew} className="flex items-center">
          <FiPlus className="mr-2" /> Add Category
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories
                .filter(category => !category.parentCategory)
                .map(category => renderCategoryRow(category))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal would be implemented here in a real application */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleFormChange}
                ></textarea>
              </div>
              <div>
                <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">
                  Parent Category
                </label>
                <select
                  id="parentCategory"
                  name="parentCategory"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.parentCategory}
                  onChange={handleFormChange}
                >
                  <option value="">None (Top Level)</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
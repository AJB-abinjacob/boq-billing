import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiChevronRight } from 'react-icons/fi';
import Button from '../../components/Button';
import Card from '../../components/Card';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data
    setCategories([
      { 
        id: 1, 
        name: 'Civil Works', 
        description: 'All civil construction related items',
        isActive: true,
        parentCategory: null,
        children: [
          { 
            id: 3, 
            name: 'Concrete Works', 
            description: 'Concrete related items',
            isActive: true,
            parentCategory: 1
          },
          { 
            id: 4, 
            name: 'Masonry Works', 
            description: 'Brick and block work',
            isActive: true,
            parentCategory: 1
          }
        ]
      },
      { 
        id: 2, 
        name: 'Electrical Works', 
        description: 'All electrical items',
        isActive: true,
        parentCategory: null,
        children: []
      }
    ]);
  }, []);

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // In a real app, this would call the API
      setCategories(prevCategories => 
        prevCategories.filter(category => category.id !== id)
          .map(category => ({
            ...category,
            children: category.children ? 
              category.children.filter(child => child.id !== id) : 
              []
          }))
      );
    }
  };

  const handleAddNew = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const renderCategoryRow = (category, level = 0) => {
    const isExpanded = expandedCategories[category.id];
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <React.Fragment key={category.id}>
        <tr className={level > 0 ? 'bg-gray-50' : 'bg-white'}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              {hasChildren && (
                <button 
                  onClick={() => toggleExpand(category.id)}
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
              onClick={() => handleDelete(category.id)}
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  defaultValue={currentCategory?.name || ''}
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
                  defaultValue={currentCategory?.description || ''}
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
                  defaultValue={currentCategory?.parentCategory || ''}
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
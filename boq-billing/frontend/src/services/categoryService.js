import API from './api';

/**
 * Category service for handling category-related operations
 */
const CategoryService = {
  /**
   * Get all categories
   * @returns {Promise} Promise with categories data
   */
  getAllCategories: async () => {
    try {
      const response = await API.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise} Promise with category data
   */
  getCategoryById: async (id) => {
    try {
      const response = await API.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise} Promise with created category data
   */
  createCategory: async (categoryData) => {
    try {
      const response = await API.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Promise with updated category data
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await API.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise} Promise with deletion result
   */
  deleteCategory: async (id) => {
    try {
      const response = await API.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default CategoryService;
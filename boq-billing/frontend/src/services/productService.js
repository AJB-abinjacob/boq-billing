import API from './api';

/**
 * Product service for handling product-related operations
 */
const ProductService = {
  /**
   * Get all products with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} Promise with products data
   */
  getAllProducts: async (params = {}) => {
    try {
      const response = await API.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise} Promise with product data
   */
  getProductById: async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise} Promise with created product data
   */
  createProduct: async (productData) => {
    try {
      const response = await API.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise} Promise with updated product data
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await API.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise} Promise with deletion result
   */
  deleteProduct: async (id) => {
    try {
      const response = await API.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get products by category
   * @param {string} categoryId - Category ID
   * @returns {Promise} Promise with products data
   */
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await API.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default ProductService;
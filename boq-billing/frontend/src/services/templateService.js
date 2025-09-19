import API from './api';

/**
 * Template service for handling template-related operations
 */
const TemplateService = {
  /**
   * Get all templates
   * @returns {Promise} Promise with templates data
   */
  getAllTemplates: async () => {
    try {
      const response = await API.get('/templates');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Promise} Promise with template data
   */
  getTemplateById: async (id) => {
    try {
      const response = await API.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Create a new template
   * @param {Object} templateData - Template data
   * @returns {Promise} Promise with created template data
   */
  createTemplate: async (templateData) => {
    try {
      const response = await API.post('/templates', templateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update an existing template
   * @param {string} id - Template ID
   * @param {Object} templateData - Updated template data
   * @returns {Promise} Promise with updated template data
   */
  updateTemplate: async (id, templateData) => {
    try {
      const response = await API.put(`/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a template
   * @param {string} id - Template ID
   * @returns {Promise} Promise with deletion result
   */
  deleteTemplate: async (id) => {
    try {
      const response = await API.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default TemplateService;
import API from './api';

/**
 * Bill service for handling bill-related operations
 */
const BillService = {
  /**
   * Get all bills with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} Promise with bills data
   */
  getAllBills: async (params = {}) => {
    try {
      const response = await API.get('/bills', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Get bill by ID
   * @param {string} id - Bill ID
   * @returns {Promise} Promise with bill data
   */
  getBillById: async (id) => {
    try {
      const response = await API.get(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Create a new bill
   * @param {Object} billData - Bill data
   * @returns {Promise} Promise with created bill data
   */
  createBill: async (billData) => {
    try {
      const response = await API.post('/bills', billData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update an existing bill
   * @param {string} id - Bill ID
   * @param {Object} billData - Updated bill data
   * @returns {Promise} Promise with updated bill data
   */
  updateBill: async (id, billData) => {
    try {
      const response = await API.put(`/bills/${id}`, billData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Delete a bill
   * @param {string} id - Bill ID
   * @returns {Promise} Promise with deletion result
   */
  deleteBill: async (id) => {
    try {
      const response = await API.delete(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  /**
   * Update bill status
   * @param {string} id - Bill ID
   * @param {string} status - New status
   * @returns {Promise} Promise with updated bill data
   */
  updateBillStatus: async (id, status) => {
    try {
      const response = await API.patch(`/bills/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default BillService;
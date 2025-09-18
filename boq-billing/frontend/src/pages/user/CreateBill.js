import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Card from '../../components/Card';
import Button from '../../components/Button';

const CreateBill = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Calculate totals
  const subtotal = billItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const totalGst = billItems.reduce((sum, item) => {
    const itemTotal = item.quantity * item.rate;
    const gstAmount = (itemTotal * item.gstPercentage) / 100;
    return sum + gstAmount;
  }, 0);
  const grandTotal = subtotal + totalGst;

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data
    const mockCategories = [
      { id: 3, name: 'Concrete Works' },
      { id: 4, name: 'Masonry Works' }
    ];
    
    const mockProducts = [
      { 
        id: 1, 
        name: 'Portland Cement', 
        description: '53 Grade OPC',
        categoryId: 3,
        unit: 'Bag',
        rate: 350,
        gstPercentage: 18,
        hsnCode: '2523'
      },
      { 
        id: 2, 
        name: 'Sand', 
        description: 'River Sand',
        categoryId: 3,
        unit: 'CFT',
        rate: 45,
        gstPercentage: 5,
        hsnCode: '2505'
      },
      { 
        id: 3, 
        name: 'Bricks', 
        description: 'Red Clay Bricks',
        categoryId: 4,
        unit: 'Nos',
        rate: 8,
        gstPercentage: 5,
        hsnCode: '6904'
      }
    ];
    
    setCategories(mockCategories);
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.categoryId.toString() === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const handleAddItem = (product) => {
    const existingItemIndex = billItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // If product already exists in bill, increment quantity
      const updatedItems = [...billItems];
      updatedItems[existingItemIndex].quantity += 1;
      setBillItems(updatedItems);
    } else {
      // Add new product to bill
      setBillItems([
        ...billItems,
        {
          productId: product.id,
          name: product.name,
          description: product.description,
          unit: product.unit,
          rate: product.rate,
          gstPercentage: product.gstPercentage,
          hsnCode: product.hsnCode,
          quantity: 1
        }
      ]);
    }
  };

  const handleRemoveItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value, 10) || 0;
    if (quantity >= 0) {
      const updatedItems = [...billItems];
      updatedItems[index].quantity = quantity;
      setBillItems(updatedItems);
    }
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would submit to the API
    console.log({
      customerInfo,
      items: billItems,
      subtotal,
      totalGst,
      grandTotal
    });
    
    // Navigate to bills list after creation
    navigate('/bills');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Bill</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <Card title="Customer Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                ></textarea>
              </div>
            </div>
          </Card>
          
          <Card title="Add Products">
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Filter by Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="overflow-y-auto max-h-60">
              <ul className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <li key={product.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">₹{product.rate} / {product.unit}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddItem(product)}
                      className="flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        
        <Card title="Bill Items">
          {billItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items added to the bill yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      HSN
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GST %
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billItems.map((item, index) => {
                    const itemTotal = item.quantity * item.rate;
                    const gstAmount = (itemTotal * item.gstPercentage) / 100;
                    const totalAmount = itemTotal + gstAmount;
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.hsnCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            className="w-16 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.rate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.gstPercentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="6" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Subtotal:
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      GST:
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      ₹{totalGst.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Grand Total:
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      ₹{grandTotal.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/bills')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={billItems.length === 0 || !customerInfo.name}
          >
            Create Bill
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBill;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiDownload, FiSearch, FiFilter, FiFileText } from 'react-icons/fi';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { exportBillsAsCSV } from '../../utils/pdfExport';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // In production, this would use the actual API
        // const response = await BillService.getAllBills({ status: statusFilter });
        // setBills(response.data);
        
        // For demo purposes, we'll use mock data
        const mockBills = [
          {
            id: 'BILL-001',
            customerName: 'Rahul Sharma',
            date: '2023-06-15',
            amount: 12500,
            status: 'Paid'
          },
          {
            id: 'BILL-002',
            customerName: 'Priya Patel',
            date: '2023-06-18',
            amount: 8750,
            status: 'Pending'
          },
          {
            id: 'BILL-003',
            customerName: 'Amit Kumar',
            date: '2023-06-20',
            amount: 15000,
            status: 'Paid'
          },
          {
            id: 'BILL-004',
            customerName: 'Sneha Gupta',
            date: '2023-06-22',
            amount: 9200,
            status: 'Pending'
          },
          {
            id: 'BILL-005',
            customerName: 'Vikram Singh',
            date: '2023-06-25',
            amount: 18500,
            status: 'Paid'
          },
          {
            id: 'BILL-006',
            customerName: 'Neha Verma',
            date: '2023-06-28',
            amount: 7800,
            status: 'Pending'
          }
        ];
        
        setBills(mockBills);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
        // In a real app, you would show an error message to the user
      }
    };
    
    fetchBills();
  }, []);

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bill.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bills</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => exportBillsAsCSV(bills)}
          >
            <FiFileText className="mr-2" /> Export CSV
          </Button>
          <Link to="/bills/create">
            <Button className="flex items-center">
              Create New Bill
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <div className="relative rounded-md shadow-sm flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative rounded-md shadow-sm sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bill.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{bill.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/bills/${bill.id}`} 
                      className="text-primary-600 hover:text-primary-900 mr-3"
                      title="View Bill"
                    >
                      <FiEye className="h-5 w-5 inline" />
                    </Link>
                    <button
                      className="text-primary-600 hover:text-primary-900"
                      title="Download PDF"
                    >
                      <FiDownload className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBills.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">No bills found matching your search criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BillList;
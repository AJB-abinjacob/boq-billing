import React, { useState, useEffect } from 'react';
import { FiFileText, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalBills: 0,
    pendingBills: 0,
    paidBills: 0,
    totalRevenue: 0
  });

  const [recentBills, setRecentBills] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data
    setStats({
      totalBills: 48,
      pendingBills: 12,
      paidBills: 36,
      totalRevenue: 245000
    });

    setRecentBills([
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
      }
    ]);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link to="/bills/create">
          <Button className="flex items-center">
            Create New Bill
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Bills" 
          value={stats.totalBills} 
          icon={FiFileText} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Pending Bills" 
          value={stats.pendingBills} 
          icon={FiClock} 
          color="bg-yellow-500"
        />
        <StatCard 
          title="Paid Bills" 
          value={stats.paidBills} 
          icon={FiCheckCircle} 
          color="bg-green-500"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={FiDollarSign} 
          color="bg-purple-500"
        />
      </div>

      <Card title="Recent Bills">
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
              {recentBills.map((bill) => (
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
                    <Link to={`/bills/${bill.id}`} className="text-primary-600 hover:text-primary-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link to="/bills" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
            View All Bills →
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;
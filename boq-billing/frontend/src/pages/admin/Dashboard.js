import React, { useState, useEffect } from 'react';
import { FiUsers, FiPackage, FiFileText, FiDollarSign } from 'react-icons/fi';
import Card from '../../components/Card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    products: 0,
    bills: 0,
    revenue: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll use mock data
    setStats({
      companies: 5,
      products: 120,
      bills: 48,
      revenue: 24500
    });
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Companies" 
          value={stats.companies} 
          icon={FiUsers} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Products" 
          value={stats.products} 
          icon={FiPackage} 
          color="bg-green-500"
        />
        <StatCard 
          title="Total Bills" 
          value={stats.bills} 
          icon={FiFileText} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString()}`} 
          icon={FiDollarSign} 
          color="bg-yellow-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Recent Activity">
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm text-gray-600">New company registered: <span className="font-medium">ABC Construction</span></p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-600">New bill created: <span className="font-medium">Bill #1234</span></p>
              <p className="text-xs text-gray-400">5 hours ago</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="text-sm text-gray-600">Payment received: <span className="font-medium">₹5,000</span></p>
              <p className="text-xs text-gray-400">Yesterday</p>
            </div>
          </div>
        </Card>
        
        <Card title="System Status">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Database</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">API Services</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">PDF Generation</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Email Service</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Operational</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
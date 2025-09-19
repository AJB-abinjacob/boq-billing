import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import CompanyList from './pages/admin/CompanyList';
import CategoryList from './pages/admin/CategoryList';
import ProductList from './pages/admin/ProductList';
import TemplateList from './pages/admin/TemplateList';
import PricingList from './pages/admin/PricingList';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import BillList from './pages/user/BillList';
import CreateBill from './pages/user/CreateBill';
import ViewBill from './pages/user/ViewBill';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes - Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="bills" element={<BillList />} />
            <Route path="bills/create" element={<CreateBill />} />
            <Route path="bills/:id" element={<ViewBill />} />
          </Route>
        </Route>
        
        {/* Admin Routes - Protected and Admin Only */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="pricing" element={<PricingList />} />
            <Route path="templates" element={<TemplateList />} />
          </Route>
        </Route>
        
        {/* Redirect to login for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
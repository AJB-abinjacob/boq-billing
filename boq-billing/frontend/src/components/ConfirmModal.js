import React from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to perform this action?', 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' 
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: 'border-yellow-400 bg-yellow-50',
    danger: 'border-red-400 bg-red-50',
    info: 'border-blue-400 bg-blue-50'
  };

  const iconColors = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600'
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className={`border-l-4 p-4 mb-4 ${typeStyles[type]}`}>
          <div className="flex">
            <FiAlertCircle className={`h-5 w-5 ${iconColors[type]} mr-2 flex-shrink-0`} />
            <div className="ml-3">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
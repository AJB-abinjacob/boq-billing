import React from 'react';

/**
 * A responsive container component that adapts to different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.maxWidth - Maximum width of the container (default: '7xl')
 * @returns {JSX.Element} Responsive container component
 */
const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '7xl' 
}) => {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-${maxWidth} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
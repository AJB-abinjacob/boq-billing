import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiPrinter } from 'react-icons/fi';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { exportBillAsPDF } from '../../utils/pdfExport';
import BillService from '../../services/billService';

const ViewBill = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        // In production, this would use the actual API
        // const response = await BillService.getBillById(id);
        // setBill(response.data);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setBill({
            id: id,
            billNumber: id,
            date: '2023-06-15',
            dueDate: '2023-06-30',
            customerName: 'Rahul Sharma',
            customerEmail: 'rahul.sharma@example.com',
            customerPhone: '+91 9876543210',
            customerAddress: '123 Main Street, Mumbai, Maharashtra 400001',
            status: 'Paid',
            items: [
              {
                id: 1,
                name: 'Cement (OPC 53 Grade)',
                description: 'Premium quality cement for construction',
                quantity: 10,
                unit: 'Bags',
                rate: 350,
                gst: 18,
                amount: 3500,
                gstAmount: 630,
                total: 4130
              },
              {
                id: 2,
                name: 'Steel Reinforcement Bars',
                description: 'High tensile strength TMT bars',
                quantity: 5,
                unit: 'Quintal',
                rate: 6000,
                gst: 18,
                amount: 30000,
                gstAmount: 5400,
                total: 35400
              },
              {
                id: 3,
                name: 'Bricks (Red Clay)',
                description: 'Standard size red clay bricks',
                quantity: 1000,
                unit: 'Pieces',
                rate: 8,
                gst: 5,
                amount: 8000,
                gstAmount: 400,
                total: 8400
              }
            ],
            subtotal: 41500,
            gstTotal: 6430,
            grandTotal: 47930,
            notes: 'Payment due within 15 days. Late payments will incur a 2% interest charge per month.'
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch bill details:", error);
        setLoading(false);
        // In a real app, you would show an error message to the user
      }
    };
    
    if (id) {
      fetchBillDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900">Bill not found</h2>
        <p className="mt-2 text-gray-600">The bill you're looking for doesn't exist or has been removed.</p>
        <Link to="/bills">
          <Button className="mt-4" variant="outline">
            Back to Bills
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/bills" className="mr-4">
            <Button variant="outline" size="sm">
              <FiArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Bill #{bill.billNumber}</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => window.print()}
          >
            <FiPrinter className="mr-2" /> Print
          </Button>
          <Button 
            className="flex items-center"
            onClick={() => exportBillAsPDF(bill)}
          >
            <FiDownload className="mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="print:shadow-none">
        <Card>
          <div className="p-6">
            {/* Bill Header */}
            <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">BOQ Billing</h2>
                <p className="text-gray-600">123 Business Park, Suite 101</p>
                <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                <p className="text-gray-600">GSTIN: 29ABCDE1234F1Z5</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <h3 className="text-lg font-semibold text-gray-900">Bill #{bill.billNumber}</h3>
                <p className="text-gray-600">Date: {formatDate(bill.date)}</p>
                <p className="text-gray-600">Due Date: {formatDate(bill.dueDate)}</p>
                <span className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {bill.status}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="py-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              <p className="text-gray-800 font-medium">{bill.customerName}</p>
              <p className="text-gray-600">{bill.customerAddress}</p>
              <p className="text-gray-600">Email: {bill.customerEmail}</p>
              <p className="text-gray-600">Phone: {bill.customerPhone}</p>
            </div>

            {/* Bill Items */}
            <div className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST %
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bill.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.rate.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.gst}%
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.gstAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="py-6 border-t border-gray-200">
              <div className="flex flex-col items-end">
                <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-medium">₹{bill.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="text-gray-900 font-medium">₹{bill.gstTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Grand Total:</span>
                    <span className="text-primary-600 font-bold">₹{bill.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {bill.notes && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-600">{bill.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p>Thank you for your business!</p>
              <p className="mt-1">For any queries, please contact support@boqbilling.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewBill;
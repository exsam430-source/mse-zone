// pages/UserReturns.jsx
import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../../Components/Frontend/Title';

const UserReturns = () => {
  const { backendURL, token, currency } = useContext(ShopContext);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReturns();
  }, [token]);

  const fetchReturns = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/api/return/user-returns`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setReturns(response.data.returns);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'completed':
        return '🎉';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 pb-10 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <Title text1={'MY'} text2={'RETURNS'} />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {returns.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg mb-4">No return requests found</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              View Orders
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {returns.map((returnItem) => (
              <div
                key={returnItem._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image & Details */}
                  <div className="flex gap-4 flex-1">
                    <img
                      src={
                        returnItem.productDetails?.image
                          ? `${backendURL}/${returnItem.productDetails.image}`
                          : '/placeholder.png'
                      }
                      alt={returnItem.productDetails?.name || 'Product'}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {returnItem.productDetails?.name || 'Product Name'}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                        <span>
                          {currency}{returnItem.productDetails?.price || '0'}
                        </span>
                        <span>Qty: {returnItem.productDetails?.quantity || '1'}</span>
                        {returnItem.productDetails?.size && <span>Size: {returnItem.productDetails.size}</span>}
                        {returnItem.productDetails?.color && <span>Color: {returnItem.productDetails.color}</span>}
                      </div>
                      <p className="text-sm text-gray-500">
                        Requested: {new Date(returnItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Return Info */}
                  <div className="lg:w-1/3 space-y-3">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getStatusIcon(returnItem.status)}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          returnItem.status
                        )}`}
                      >
                        {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                      </span>
                    </div>

                    {/* Reason */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Reason</p>
                      <p className="text-sm text-gray-800 capitalize">
                        {returnItem.reason ? returnItem.reason.replace(/_/g, ' ') : 'No reason provided'}
                      </p>
                    </div>

                    {/* Return Method */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Return Method</p>
                      <p className="text-sm text-gray-800 capitalize">
                        {returnItem.returnMethod === 'pickup' ? 'We Pick Up' : 'Customer Send'}
                      </p>
                    </div>

                    {/* Admin Note */}
                    {returnItem.adminNote && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                          Admin Note
                        </p>
                        <p className="text-sm text-gray-800">{returnItem.adminNote}</p>
                      </div>
                    )}

                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Description</p>
                  <p className="text-sm text-gray-700">{returnItem.description}</p>
                </div>

                {/* Proof Images */}
                {returnItem.proofImages && returnItem.proofImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                      Proof Images
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {returnItem.proofImages.map((image, index) => (
                        <img
                          key={index}
                          src={`${backendURL}/${image}`}
                          alt={`proof-${index}`}
                          className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                          onClick={() => window.open(`${backendURL}/${image}`, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReturns;
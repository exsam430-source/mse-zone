// pages/ReturnRequest.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../../Components/Frontend/Title';

const ReturnRequest = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { backendURL, token, currency } = useContext(ShopContext);

  const [order, setOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [returnMethod, setReturnMethod] = useState('pickup');
  const [proofImages, setProofImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/order/${orderId}`, {
          headers: { token }
        });

        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to load order details');
      }
    };

    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token, backendURL]);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + proofImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file size (max 5MB per file)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    setProofImages([...proofImages, ...validFiles]);
    
    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  // Remove image
  const removeImage = (index) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previewImages[index]);
    
    setProofImages(proofImages.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Submit return request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    if (!reason || !description) {
      toast.error('Please provide reason and description');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('productId', selectedProduct._id || selectedProduct.productId);
      formData.append('reason', reason);
      formData.append('description', description);
      formData.append('returnMethod', returnMethod);
      
      const productDetails = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: selectedProduct.quantity,
        size: selectedProduct.size || '',
        color: selectedProduct.color || '',
        volume: selectedProduct.volume || '',
        image: Array.isArray(selectedProduct.images) 
          ? selectedProduct.images[0] 
          : selectedProduct.image || selectedProduct.images
      };
      
      formData.append('productDetails', JSON.stringify(productDetails));

      // Append all proof images
      proofImages.forEach((image) => {
        formData.append('proofImages', image);
      });

      const response = await axios.post(
        `${backendURL}/api/return/create`,
        formData,
        {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Return request submitted successfully');
        navigate('/returns');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 pb-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <Title text1={'RETURN'} text2={'REQUEST'} />
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          {/* Select Product */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Product to Return</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => {
                const imagesArray = item?.images
                  ? Array.isArray(item.images)
                    ? item.images
                    : [item.images]
                  : [];
                const firstImage = imagesArray[0] || null;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedProduct(item)}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedProduct === item
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {firstImage && (
                      <img
                        src={`${backendURL}/${firstImage}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <div className="flex gap-3 text-sm text-gray-600 mt-1">
                        <span>{currency}{item.price}</span>
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedProduct === item ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {selectedProduct === item && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Return <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason</option>
              <option value="defective">Defective Product</option>
              <option value="wrong_item">Wrong Item Received</option>
              <option value="not_as_described">Not as Described</option>
              <option value="damaged">Damaged in Shipping</option>
              <option value="changed_mind">Changed Mind</option>
              <option value="size_issue">Size Issue</option>
              <option value="color_issue">Color Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Please provide more details about the issue..."
              required
            ></textarea>
          </div>

          {/* Proof Images */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Proof Images (Max 5, 5MB each)
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={proofImages.length >= 5}
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPG, PNG, GIF, WebP. Max 5MB per image.
            </p>
            {previewImages.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`proof-${index}`}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-sm font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Return Method */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Return Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setReturnMethod('pickup')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  returnMethod === 'pickup'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">🚚 We Pick Up</p>
                    <p className="text-sm text-gray-600 mt-1">
                      We'll arrange pickup from your address
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      returnMethod === 'pickup' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {returnMethod === 'pickup' && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              <div
                onClick={() => setReturnMethod('customer_send')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  returnMethod === 'customer_send'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">📦 I'll Send</p>
                    <p className="text-sm text-gray-600 mt-1">
                      I'll send the package myself
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      returnMethod === 'customer_send' ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {returnMethod === 'customer_send' && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Return Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequest;
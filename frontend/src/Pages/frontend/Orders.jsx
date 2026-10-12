import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { useNavigate } from "react-router-dom";
import Title from '../../Components/Frontend/Title';
import axios from 'axios';
import { applyNewsletterDiscount } from "../../utils/discount";


const Orders = () => {
  const { currency, backendURL, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])
  const { newsletterDiscount } = useContext(ShopContext);
  const navigate = useNavigate();

  const loadOrderData = async () => {
    try {
      if (!token) return null;
      const response = await axios.post(backendURL + '/api/order/userOrders', {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16 pb-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {orderData.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">
            No orders found. Your order history will appear here.
          </div>
        ) : (
          orderData.map((item, index) => {
            const imagesArray = item?.images
              ? Array.isArray(item.images)
                ? item.images
                : [item.images]
              : [];
            const firstImage = imagesArray[0] || null;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:shadow-md transition-all duration-300"
              >
                {/* Product Details */}
                <div className="flex items-start gap-5 w-full md:w-3/4">
                  {firstImage && (
                    <img
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      src={`${backendURL}/${firstImage}`}
                      alt={item.name || 'product'}
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold text-gray-800">{item.name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span>
                        {currency}{(applyNewsletterDiscount(item.price, newsletterDiscount) * item.quantity).toFixed(2)}
                      </span>
                      <span>{item.quantity && `Qty: ${item.quantity}`}</span>
                      <span> {item.size && `Size: ${item.size}`}</span>
                      <span> {item.color && `Color: ${item.color} `}</span>
                      <span>{item.volume && `Volume: ${item.volume}`}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Date: <span className="text-gray-700 font-medium">{new Date(item.date).toDateString()}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment: <span className="text-gray-700 font-medium">{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>

                {/* Status + Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto mt-4 md:mt-0 gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${item.status === 'Delivered'
                        ? 'bg-green-500'
                        : item.status === 'Processing'
                          ? 'bg-yellow-400'
                          : 'bg-gray-400'
                        }`}
                    ></span>
                    <p className="text-sm font-medium text-gray-700 capitalize">
                      {item.status}
                    </p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className="border border-gray-300 px-5 py-2 text-sm rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() => {
                      // Check if order is eligible for return (e.g., within 7 days)
                      const orderDate = new Date(item.date);
                      const today = new Date();
                      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

                      if (daysDiff > 7) {
                        toast.error('Return period has expired (7 days)');
                        return;
                      }

                      if (item.status === 'Cancelled') {
                        toast.error('Cannot return cancelled orders');
                        return;
                      }

                      navigate(`/return/${item.orderId}`);
                    }}
                    className="border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-50 active:bg-red-100 transition-all duration-200"
                  >
                    Return
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;

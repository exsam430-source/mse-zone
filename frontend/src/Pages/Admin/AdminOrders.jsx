import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../../App';
import { toast } from 'react-toastify';
import {
  MdLocalShipping,
  MdSearch,
  MdFilterList,
  MdExpandMore,
  MdPerson,
  MdPhone,
  MdLocationOn,
  MdPayment,
  MdCalendarToday,
} from 'react-icons/md';

const AdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success)
        setOrders(response.data.orders.reverse());
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Status updated');
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-100 text-blue-700 border-blue-200',
      Packing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      'Out for delivery': 'bg-orange-100 text-orange-700 border-orange-200',
      Deliverd: 'bg-green-100 text-green-700 border-green-200',
      'Oreder Cancelld by Owner': 'bg-red-100 text-red-700 border-red-200',
      'Sorry! But we got Out of stock': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusDot = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-500',
      Packing: 'bg-yellow-500',
      Shipped: 'bg-purple-500',
      'Out for delivery': 'bg-orange-500',
      Deliverd: 'bg-green-500',
      'Oreder Cancelld by Owner': 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.address?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slideDown">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-300/40">
            <MdLocalShipping className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 text-sm">
              {orders.length} orders total
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or order ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <MdLocalShipping className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Order Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order._id ? null : order._id
                  )
                }
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                      <img
                        src={
                          order.items?.[0]?.images?.[0]
                            ? `${backendUrl}/${order.items[0].images[0]}`
                            : ''
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MdCalendarToday className="text-[10px]" />
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span>{order.items.length} items</span>
                        <span className="flex items-center gap-1">
                          <MdPayment className="text-[10px]" />
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {currency}
                        {order.amount.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          order.payment ? 'text-green-600' : 'text-amber-600'
                        }`}
                      >
                        {order.payment ? '✓ Paid' : '○ Pending'}
                      </p>
                    </div>

                    <MdExpandMore
                      className={`text-2xl text-gray-400 transition-transform duration-300 ${
                        expandedOrder === order._id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedOrder === order._id
                    ? 'max-h-[1000px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-xl p-3 text-sm"
                          >
                            <p className="font-medium text-gray-800">
                              {item.name}{' '}
                              <span className="text-gray-500">
                                x{item.quantity}
                              </span>
                            </p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {item.size && (
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded border">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded border">
                                  Color: {item.color}
                                </span>
                              )}
                              {item.volume && (
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded border">
                                  Vol: {item.volume}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Shipping Address
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-700">
                          <MdPerson className="text-gray-400" />
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p className="flex items-center gap-2 text-gray-700">
                          <MdLocationOn className="text-gray-400" />
                          {order.address?.street}, {order.address?.city},{' '}
                          {order.address?.state}
                        </p>
                        <p className="flex items-center gap-2 text-gray-700">
                          <MdPhone className="text-gray-400" />
                          {order.address?.phone}
                        </p>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Update Status
                      </h4>
                      <div className="relative">
                        <div
                          className={`w-3 h-3 rounded-full absolute left-4 top-1/2 -translate-y-1/2 ${getStatusDot(
                            order.status
                          )}`}
                        />
                        <select
                          onChange={(event) =>
                            statusHandler(event, order._id)
                          }
                          value={order.status}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-sm cursor-pointer"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for delivery">
                            Out for delivery
                          </option>
                          <option value="Deliverd">Delivered</option>
                          <option value="Oreder Cancelld by Owner">
                            Cancelled
                          </option>
                          <option value="Sorry! But we got Out of stock">
                            Out of Stock
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminOrders;
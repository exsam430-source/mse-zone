import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  MdAssignmentReturn,
  MdSearch,
  MdCheckCircle,
  MdCancel,
  MdDone,
  MdExpandMore,
} from 'react-icons/md';

const AdminReturns = ({ token }) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedReturn, setExpandedReturn] = useState(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await axios.post(
        `${backendURL}/api/return/all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) setReturns(response.data.returns);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (returnId, status) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/return/update-status`,
        { returnId, status, adminNote },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Status updated');
        fetchReturns();
        setSelectedReturn(null);
        setAdminNote('');
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const filteredReturns = returns.filter((r) =>
    filter === 'all' ? true : r.status === filter
  );

  const statusConfig = {
    pending: {
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: '⏳',
    },
    approved: {
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: '✅',
    },
    rejected: {
      color: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500',
      icon: '❌',
    },
    completed: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      icon: '🎉',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading returns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slideDown">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-300/40">
            <MdAssignmentReturn className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Returns</h1>
            <p className="text-gray-500 text-sm">
              {returns.length} return requests
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 p-1 bg-gray-100 rounded-xl inline-flex">
        {['all', 'pending', 'approved', 'rejected', 'completed'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? '📋 All' : `${statusConfig[status]?.icon || ''} ${status.charAt(0).toUpperCase() + status.slice(1)}`}
              <span className="ml-1.5 text-xs opacity-70">
                (
                {status === 'all'
                  ? returns.length
                  : returns.filter((r) => r.status === status).length}
                )
              </span>
            </button>
          )
        )}
      </div>

      {/* Returns List */}
      {filteredReturns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <MdAssignmentReturn className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No returns found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReturns.map((ret) => {
            const config = statusConfig[ret.status] || statusConfig.pending;
            const isExpanded = expandedReturn === ret._id;

            return (
              <div
                key={ret._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Header Row */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedReturn(isExpanded ? null : ret._id)
                  }
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={
                            ret.productDetails?.image
                              ? `${backendURL}/${ret.productDetails.image}`
                              : ''
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800 text-sm">
                            {ret.productDetails?.name || 'Product'}
                          </p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${config.color}`}
                          >
                            {ret.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {ret.userId?.name || 'Unknown'} •{' '}
                            {ret.userId?.email}
                          </span>
                          <span>
                            {new Date(ret.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-500 capitalize">
                        {ret.reason?.replace(/_/g, ' ')}
                      </span>
                      <MdExpandMore
                        className={`text-2xl text-gray-400 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      {/* Customer */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                          Customer
                        </h4>
                        <div className="flex items-center gap-3">
                          {ret.userId?.avatar ? (
                            <img
                              src={`${backendURL}${ret.userId.avatar}`}
                              className="w-10 h-10 rounded-full object-cover"
                              alt=""
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                              {ret.userId?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {ret.userId?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {ret.userId?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Product */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                          Product
                        </h4>
                        <p className="font-medium text-gray-800 text-sm">
                          {ret.productDetails?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ${ret.productDetails?.price} • Qty:{' '}
                          {ret.productDetails?.quantity}
                        </p>
                      </div>

                      {/* Return Info */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                          Return Info
                        </h4>
                        <p className="text-sm capitalize text-gray-800">
                          {ret.reason?.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          Method:{' '}
                          {ret.returnMethod === 'pickup'
                            ? 'We Pick Up'
                            : 'Customer Send'}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Description
                      </h4>
                      <p className="text-sm text-gray-700">
                        {ret.description}
                      </p>
                    </div>

                    {/* Proof Images */}
                    {ret.proofImages?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Proof Images
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {ret.proofImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={`${backendURL}/${img}`}
                              className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                              onClick={() =>
                                window.open(
                                  `${backendURL}/${img}`,
                                  '_blank'
                                )
                              }
                              alt=""
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Actions */}
                    {ret.status === 'pending' && (
                      <div className="pt-4 border-t border-gray-200">
                        <textarea
                          value={
                            selectedReturn === ret._id ? adminNote : ''
                          }
                          onChange={(e) => {
                            setSelectedReturn(ret._id);
                            setAdminNote(e.target.value);
                          }}
                          placeholder="Add admin note (optional)..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm"
                          rows={2}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              updateStatus(ret._id, 'approved')
                            }
                            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                          >
                            <MdCheckCircle /> Approve
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(ret._id, 'rejected')
                            }
                            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                          >
                            <MdCancel /> Reject
                          </button>
                        </div>
                      </div>
                    )}

                    {ret.status === 'approved' && (
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() =>
                            updateStatus(ret._id, 'completed')
                          }
                          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                          <MdDone /> Mark Complete
                        </button>
                      </div>
                    )}

                    {ret.adminNote && (
                      <div className="mt-4 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <h4 className="text-xs font-semibold text-indigo-600 uppercase mb-1">
                          Admin Note
                        </h4>
                        <p className="text-sm text-gray-700">
                          {ret.adminNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

export default AdminReturns;
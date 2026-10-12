import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../../App';
import { toast } from 'react-toastify';
import {
  MdSearch,
  MdDelete,
  MdInventory,
  MdFilterList,
} from 'react-icons/md';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) setList(response.data.products);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message || 'Product removed');
        setDeleteConfirm(null);
        fetchList();
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filtered = list.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-slideDown">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-300/40">
            <MdInventory className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-500 text-sm">
              {list.length} products total
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm hover:shadow-md transition-all text-sm"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <MdInventory className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            No products found
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item, index) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={`${backendUrl}/${item.images[0]}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {item.bestseller && (
                    <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg">
                      ⭐ Best Seller
                    </span>
                  )}
                  {item.productType && (
                    <span className="bg-indigo-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {item.productType}
                    </span>
                  )}
                </div>

                {/* Stock badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg ${
                      item.stock === 0
                        ? 'bg-red-500 text-white'
                        : item.stock < 10
                        ? 'bg-amber-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {item.stock === 0
                      ? 'Out of Stock'
                      : `${item.stock || '∞'} in stock`}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <button
                      onClick={() => setDeleteConfirm(item._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <MdDelete className="text-sm" />
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm truncate mb-1">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-indigo-600">
                    {currency}
                    {item.price}
                  </p>
                  {item.brand && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.brand}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-full font-medium">
                    {item.category}
                  </span>
                  {item.subCategory && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.subCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete className="text-red-500 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-500 text-center text-sm mb-6">
              This action cannot be undone. The product and its images will be
              permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(deleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default List;
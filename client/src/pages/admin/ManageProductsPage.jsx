import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiPlus, 
  HiPencilSquare, 
  HiTrash, 
  HiMagnifyingGlass, 
  HiPhoto,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { getAdminProducts, deleteProduct, getImageUrl } from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProducts({ search: searchTerm });
      if (res?.success && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteProduct(id);
      if (res?.success) {
        toast.success('Product deleted successfully');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, update, manage stock levels, and delete products
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <HiMagnifyingGlass className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter products by title..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <Loading text="Loading catalog items..." />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <HiPhoto className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-xs">{p.name}</p>
                          <p className="text-xs text-gray-400">ID: {p._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {p.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold text-xs ${p.stock <= 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <HiPencilSquare className="w-5 h-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <HiExclamationTriangle className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg">Delete this product?</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone. Are you sure you wish to proceed?</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiPhoto } from 'react-icons/hi2';
import { getProduct, createProduct, updateProduct, getImageUrl } from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const AddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics',
    image: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const loadProduct = async () => {
        try {
          const res = await getProduct(id);
          if (res?.success && res.product) {
            setFormData({
              name: res.product.name || '',
              description: res.product.description || '',
              price: res.product.price ?? '',
              stock: res.product.stock ?? '',
              category: res.product.category || 'Electronics',
              image: res.product.image || '',
            });
            if (res.product.image) {
              setImagePreview(getImageUrl(res.product.image));
            }
          }
        } catch (err) {
          toast.error('Failed to load product details');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || formData.stock === '') {
      toast.error('Please fill in product name, price, and stock.');
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('name', formData.name.trim());
      form.append('description', formData.description.trim());
      form.append('price', Number(formData.price));
      form.append('stock', Number(formData.stock));
      form.append('category', formData.category.trim());

      if (imageFile) {
        form.append('image', imageFile);
      } else if (formData.image) {
        form.append('image', formData.image);
      }

      if (isEditing) {
        await updateProduct(id, form);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(form);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading product form..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 shadow-xs transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditing ? 'Update existing item specifications' : 'Publish a new item to your store'}
          </p>
        </div>
      </div>

      {/* Product Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product overview, features, and specs..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Price, Stock, Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="49.99"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          {/* Image Upload or URL */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Product Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <HiPhoto className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Or paste image URL directly..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Product' : 'Create Product'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEditProductPage;

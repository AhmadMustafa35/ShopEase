import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiTrash, HiMinus, HiPlus, HiPhoto } from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const [updating, setUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!item || !item.product) return null;

  const product = item.product;
  const quantity = item.quantity;
  const stock = product.stock ?? 999;
  const itemTotal = (Number(product.price || 0) * quantity).toFixed(2);

  const handleDecrease = async () => {
    if (quantity > 1 && !updating) {
      setUpdating(true);
      await updateQuantity(item._id, quantity - 1);
      setUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (quantity < stock && !updating) {
      setUpdating(true);
      await updateQuantity(item._id, quantity + 1);
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!updating) {
      setUpdating(true);
      await removeItem(item._id);
      setUpdating(false);
    }
  };

  return (
    <div className={`p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity duration-150 ${updating ? 'opacity-50' : 'opacity-100'}`}>
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link 
          to={`/products/${product._id}`} 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center group"
        >
          {!imageError && product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <HiPhoto className="w-8 h-8 text-gray-300" />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          {product.category && (
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-0.5">
              {product.category}
            </span>
          )}
          <Link
            to={`/products/${product._id}`}
            className="text-sm sm:text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>${Number(product.price).toFixed(2)} each</span>
            {stock <= 5 && stock > 0 && (
              <span className="text-xs text-amber-600 font-medium">({stock} remaining)</span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Selector, Price & Remove Button */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1 || updating}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <HiMinus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-10 text-center font-semibold text-sm text-gray-900 select-none">
            {quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= stock || updating}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <HiPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[80px]">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ${itemTotal}
          </span>
        </div>

        {/* Delete Item Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={updating}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
          aria-label="Remove item"
        >
          <HiTrash className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};

export default CartItem;

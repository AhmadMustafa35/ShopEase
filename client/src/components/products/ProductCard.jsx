import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiShoppingCart, 
  HiPhoto, 
  HiStar, 
  HiHeart, 
  HiCheck, 
  HiSparkles 
} from 'react-icons/hi2';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../services/api';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('shopease_wishlist') || '[]');
      if (Array.isArray(savedWishlist) && product?._id) {
        setIsWishlisted(savedWishlist.includes(product._id));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [product?._id]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  // Consistent mock rating & reviews based on product ID for visual appeal
  const ratingSeed = product._id ? product._id.charCodeAt(product._id.length - 1) : 5;
  const rating = (4.5 + (ratingSeed % 5) * 0.1).toFixed(1);
  const reviewCount = 18 + (ratingSeed * 7) % 180;
  
  // Calculate discount price for visual delight
  const originalPrice = (Number(product.price) * 1.22).toFixed(2);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('shopease_wishlist') || '[]');
      let updated;
      if (savedWishlist.includes(product._id)) {
        updated = savedWishlist.filter((id) => id !== product._id);
        setIsWishlisted(false);
      } else {
        updated = [...savedWishlist, product._id];
        setIsWishlisted(true);
      }
      localStorage.setItem('shopease_wishlist', JSON.stringify(updated));
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    await addToCart(product, 1);
    setAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  // ===============================
  // LIST VIEW LAYOUT
  // ===============================
  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-gray-150 p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-stretch">
        {/* Thumbnail */}
        <Link 
          to={`/products/${product._id}`} 
          className="relative w-full sm:w-56 sm:h-56 aspect-square rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100"
        >
          {!imageError && product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <HiPhoto className="w-12 h-12 stroke-1" />
              <span className="text-xs text-gray-400 mt-1">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {isOutOfStock ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                Only {product.stock} left
              </span>
            ) : null}
          </div>
        </Link>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
              )}
              <div className="flex items-center text-amber-500 text-xs gap-1 font-semibold">
                <HiStar className="w-3.5 h-3.5 fill-current" />
                <span>{rating}</span>
                <span className="text-gray-400 font-normal">({reviewCount})</span>
              </div>
            </div>

            <Link to={`/products/${product._id}`}>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {product.description || 'No description provided for this product.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 flex-wrap gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-400 hover:text-rose-500 hover:border-gray-300'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <HiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : justAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : adding
                    ? 'bg-indigo-700 text-white cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md hover:shadow-indigo-100'
                }`}
              >
                {adding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : justAdded ? (
                  <>
                    <HiCheck className="w-4 h-4 stroke-2" />
                    <span>Added!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <HiShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // GRID VIEW LAYOUT (DEFAULT)
  // ===============================
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.12)] hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full transform hover:-translate-y-1">
      
      {/* Clickable Card Upper Section */}
      <Link to={`/products/${product._id}`} className="block flex-1">
        
        {/* Product Image Area */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50 to-gray-100/60 overflow-hidden flex items-center justify-center">
          {!imageError && product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 p-6 text-center">
              <HiPhoto className="w-12 h-12 stroke-1" />
              <span className="text-xs text-gray-400 mt-1 font-medium">No Image</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOutOfStock ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                Only {product.stock} left
              </span>
            ) : Number(product.price) > 50 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-sm">
                <HiSparkles className="w-3 h-3 text-amber-300" />
                Featured
              </span>
            ) : null}
          </div>

          {/* Wishlist Button (Top Right) */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 shadow-sm'
                : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white shadow-sm'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {/* Category & Star Rating */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {product.category ? (
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50/90 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
              ) : <span />}

              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <HiStar className="w-3.5 h-3.5 fill-current" />
                <span>{rating}</span>
                <span className="text-gray-400 text-[11px] font-normal">({reviewCount})</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 
              title={product.name}
              className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5rem] leading-snug"
            >
              {product.name}
            </h3>
          </div>

          {/* Price & Stock Row */}
          <div className="mt-4 pt-3 border-t border-gray-100/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900 tracking-tight">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice}
              </span>
            </div>

            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              {!isOutOfStock && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              {isOutOfStock ? (
                <span className="text-rose-500 font-semibold">Unavailable</span>
              ) : (
                'In Stock'
              )}
            </span>
          </div>
        </div>
      </Link>

      {/* Add To Cart CTA Button */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 select-none ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : justAdded
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
              : adding
              ? 'bg-indigo-700 text-white cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md hover:shadow-indigo-200 active:scale-[0.98]'
          }`}
          aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
        >
          {adding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : justAdded ? (
            <>
              <HiCheck className="w-4 h-4 stroke-2" />
              <span>Added to Cart!</span>
            </>
          ) : isOutOfStock ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <HiShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ProductCard;

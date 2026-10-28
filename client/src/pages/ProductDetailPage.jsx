import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HiChevronRight, 
  HiShoppingCart, 
  HiMinus, 
  HiPlus, 
  HiTruck, 
  HiShieldCheck, 
  HiArrowPath, 
  HiPhoto,
  HiCheck,
  HiHome,
  HiStar,
  HiHeart,
  HiBolt,
  HiSparkles,
  HiCheckBadge
} from 'react-icons/hi2';
import { getProduct, getProducts, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
      setLoading(true);
      setImageError(false);
      setQuantity(1);

      try {
        const res = await getProduct(id);
        if (isMounted && res?.success && res.product) {
          setProduct(res.product);

          // Fetch related products from same category
          if (res.product.category) {
            try {
              const relRes = await getProducts({
                category: res.product.category,
                limit: 5,
              });
              if (isMounted && relRes?.success && Array.isArray(relRes.products)) {
                setRelatedProducts(
                  relRes.products.filter((p) => p._id !== res.product._id).slice(0, 4)
                );
              }
            } catch (relErr) {
              console.error('Failed to fetch related products:', relErr);
            }
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Check wishlist state
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('shopease_wishlist') || '[]');
      if (Array.isArray(savedWishlist)) {
        setIsWishlisted(savedWishlist.includes(id));
      }
    } catch {
      // ignore
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading text="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <HiPhoto className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
          The product you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-sm"
        >
          Back to All Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const originalPrice = (Number(product.price) * 1.25).toFixed(2);
  const savings = (originalPrice - Number(product.price)).toFixed(2);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || addingToCart) return;
    setAddingToCart(true);
    await addToCart(product, quantity);
    setAddingToCart(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || addingToCart) return;
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('shopease_wishlist') || '[]');
      let updated;
      if (savedWishlist.includes(product._id)) {
        updated = savedWishlist.filter((pid) => pid !== product._id);
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

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      
      {/* 1) Breadcrumbs */}
      <div className="bg-white border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center text-xs sm:text-sm text-gray-500 gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
              <HiHome className="w-4 h-4 text-gray-400" />
              <span>Home</span>
            </Link>
            <HiChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link to="/products" className="hover:text-indigo-600 transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <HiChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <Link
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-indigo-600 transition-colors font-medium text-gray-700"
                >
                  {product.category}
                </Link>
              </>
            )}
            <HiChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2) Main Product Hero Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Product Image Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl border border-gray-200/80 overflow-hidden flex items-center justify-center p-6 shadow-inner group">
              {!imageError && product.image ? (
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain max-h-[480px] group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 p-8 text-center">
                  <HiPhoto className="w-20 h-20 stroke-1" />
                  <span className="text-sm text-gray-400 mt-2 font-medium">No image available</span>
                </div>
              )}

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {isOutOfStock ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                    Only {product.stock} Units Remaining
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                    <HiCheckBadge className="w-4 h-4" />
                    Verified Genuine
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-500 scale-105'
                    : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <HiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Guarantee Note */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-2">
              <span className="flex items-center gap-1.5">
                <HiShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Secure Checkout Guarantee
              </span>
              <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                View High-Res
              </span>
            </div>
          </div>

          {/* Right Column: Product Info & Buy Box */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category Pill & Rating */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {product.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                    <HiSparkles className="w-3.5 h-3.5 text-indigo-500" />
                    {product.category}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">4.9</span>
                  <span className="text-xs text-gray-400 font-medium">· 128 Reviews</span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Popular
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="pt-2 pb-3 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ${originalPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Save ${savings} (20% OFF)
                </span>
              </div>

              {/* Stock Status Bar */}
              <div className="flex items-center gap-2">
                {!isOutOfStock ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock — Ready to ship ({product.stock} units left)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Currently Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description Preview */}
              <div className="pt-2">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description || 'No detailed description provided for this product.'}
                </p>
              </div>

            </div>

            {/* Actions Section */}
            <div className="space-y-5 pt-6 border-t border-gray-150">
              
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Quantity:
                    </span>
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <HiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-900 select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        disabled={quantity >= product.stock}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <HiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    Total: <span className="text-indigo-600 font-black">${(Number(product.price) * quantity).toFixed(2)}</span>
                  </span>
                </div>
              )}

              {/* Primary Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition-all duration-200 select-none ${
                    isOutOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : justAdded
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : addingToCart
                      ? 'bg-indigo-700 text-white cursor-wait'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-150 hover:shadow-lg active:scale-98'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding to Cart...</span>
                    </>
                  ) : justAdded ? (
                    <>
                      <HiCheck className="w-5 h-5 stroke-2" />
                      <span>Added to Your Cart!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <HiShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {!isOutOfStock && (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="sm:w-44 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base border-2 border-slate-900 bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
                  >
                    <HiBolt className="w-4 h-4 text-amber-400" />
                    <span>Buy Now</span>
                  </button>
                )}
              </div>

              {/* Trust & Guarantee Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center gap-2.5">
                  <HiTruck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Free Delivery</p>
                    <p className="text-[10px] text-gray-500">Orders over $50</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center gap-2.5">
                  <HiArrowPath className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">30-Day Returns</p>
                    <p className="text-[10px] text-gray-500">Money-back policy</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/60 flex items-center gap-2.5">
                  <HiShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">2-Year Warranty</p>
                    <p className="text-[10px] text-gray-500">Standard coverage</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3) Detailed Information Tabs */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 shadow-xs">
          
          {/* Tabs Navigation Header */}
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Product Overview' },
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'reviews', label: 'Customer Reviews (128)' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="pt-6 space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <h3 className="text-lg font-bold text-gray-900">Why You'll Love It</h3>
              <p>{product.description}</p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <HiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Precision crafted with sustainable, premium materials for extended lifespan.</span>
                </li>
                <li className="flex items-center gap-2">
                  <HiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Tested rigorously under international quality assurance standards.</span>
                </li>
                <li className="flex items-center gap-2">
                  <HiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Includes all necessary accessories, original manufacturer box, and documentation.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specs' && (
            <div className="pt-6">
              <div className="max-w-2xl divide-y divide-gray-150 text-sm">
                <div className="py-3 flex justify-between">
                  <span className="text-gray-500 font-medium">Category</span>
                  <span className="text-gray-900 font-bold">{product.category || 'General'}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-500 font-medium">Model Code</span>
                  <span className="text-gray-900 font-mono text-xs">{product._id}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-500 font-medium">Availability</span>
                  <span className="text-emerald-600 font-bold">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-500 font-medium">Standard Warranty</span>
                  <span className="text-gray-900 font-bold">24 Months Included</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-gray-500 font-medium">Payment Options</span>
                  <span className="text-gray-900 font-bold">Cash on Delivery (COD) & Online Cards</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-6">
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center gap-4">
                <div className="text-center">
                  <span className="text-3xl font-black text-amber-600">4.9</span>
                  <div className="flex text-amber-400 text-xs mt-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-amber-900">
                  <p className="font-bold">98% of customers recommend this item</p>
                  <p className="text-amber-700/90 mt-0.5">Based on 128 verified customer purchases across the country.</p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">Sarah Jenkins</span>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs my-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    "Exceeded my expectations! High quality, packaged securely, and arrived in under 48 hours."
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">David Miller</span>
                    <span className="text-xs text-gray-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 text-xs my-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    "Great value for the price. Would definitely order again from ShopEase."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="pt-6 space-y-3 text-sm text-gray-600 leading-relaxed">
              <h4 className="font-bold text-gray-900">Standard Delivery</h4>
              <p>We dispatch all orders within 24 hours of purchase. Standard delivery takes 2–4 business days depending on location.</p>
              <h4 className="font-bold text-gray-900 pt-2">Hassle-Free Returns</h4>
              <p>Not completely satisfied? Return it within 30 days of delivery for a full refund or exchange. We arrange free courier pickup for eligible returns.</p>
            </div>
          )}

        </div>

        {/* 4) Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  You Might Also Like
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Handpicked alternatives from the {product.category} catalog
                </p>
              </div>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All</span>
                <HiChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
};

export default ProductDetailPage;

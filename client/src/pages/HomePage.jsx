import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiArrowRight, 
  HiShoppingBag, 
  HiTruck, 
  HiShieldCheck, 
  HiArrowPath, 
  HiPhone, 
  HiSparkles,
  HiDevicePhoneMobile,
  HiTag,
  HiHomeModern,
  HiBookOpen
} from 'react-icons/hi2';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.allSettled([
          getProducts({ limit: 8, sort: 'newest' }),
          getCategories(),
        ]);

        if (isMounted) {
          if (productsRes.status === 'fulfilled' && productsRes.value?.success) {
            setFeaturedProducts(productsRes.value.products || []);
          }
          if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.success) {
            setCategories(categoriesRes.value.categories || []);
          }
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Thank you for subscribing! Your 10% off code is SHOPEASE10.');
    setNewsletterEmail('');
  };

  // Preset images for categories to make category cards look gorgeous
  const categoryImages = {
    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
    Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    Clothing: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    Footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    Accessories: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
    Home: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    Beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    'Beauty & Personal Care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    Sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    'Sports & Outdoors': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80',
  };

  const defaultCategoryList = categories.length > 0 ? categories : ['Electronics', 'Clothing', 'Home & Kitchen', 'Books'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1) Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800 text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text */}
          <div className="max-w-2xl text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide text-indigo-100">
              <HiSparkles className="w-4 h-4 text-amber-400" />
              <span>Next-Gen Online Shopping Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Welcome to <span className="text-white underline decoration-amber-400 decoration-wavy decoration-2">ShopEase</span>
            </h1>

            <p className="text-lg sm:text-xl text-indigo-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover amazing products at unbeatable prices. From trending electronics to everyday essentials, delivered right to your doorstep.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-white text-indigo-700 hover:bg-gray-100 font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <HiArrowRight className="w-5 h-5 text-indigo-700" />
              </Link>

              <Link
                to="/products?sort=price_asc"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-semibold text-base border border-white/20 transition-all duration-200"
              >
                <span>View Deals</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Graphic Card */}
          <div className="relative w-full max-w-md lg:max-w-lg">
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase tracking-widest text-indigo-200 font-semibold">Special Highlight</span>
                <span className="px-2.5 py-0.5 bg-amber-400 text-gray-900 rounded-full text-xs font-bold">SALE 20% OFF</span>
              </div>
              
              <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden bg-white/5 relative">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Premium Wireless Headphones"
                  className="w-full h-56 object-cover rounded-2xl"
                />
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-white">Smart Active Noise Cancelling Headphones</h3>
                <p className="text-xs text-indigo-200 mt-1">Immersive crystal clear audio with up to 40h battery</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">$149.99</span>
                    <span className="text-sm text-indigo-200 line-through ml-2">$189.99</span>
                  </div>
                  <Link
                    to="/products"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-xs rounded-xl transition-colors"
                  >
                    Explore Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Features Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <HiTruck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Free Fast Shipping</h3>
              <p className="text-xs text-gray-500 mt-0.5">Free delivery for all orders over $50</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Secure Checkout</h3>
              <p className="text-xs text-gray-500 mt-0.5">100% verified protected payment</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <HiArrowPath className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">30-Day Easy Returns</h3>
              <p className="text-xs text-gray-500 mt-0.5">Hassle-free replacement or refund</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <HiPhone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">24/7 Dedicated Support</h3>
              <p className="text-xs text-gray-500 mt-0.5">Friendly expert customer assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3) Shop By Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">Browse collections curated just for you</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <span>View All</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {defaultCategoryList.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 block"
            >
              <img
                src={categoryImages[category] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80'}
                alt={category}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-white font-bold text-lg sm:text-xl group-hover:text-indigo-300 transition-colors">
                  {category}
                </span>
                <span className="text-xs text-gray-300 flex items-center gap-1 mt-0.5 opacity-90 group-hover:opacity-100">
                  Shop Collection <HiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4) Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">Handpicked favorites fresh from our catalog</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <span>View All Products</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse space-y-4">
                <div className="aspect-square bg-gray-200 rounded-md" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <HiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No products available right now</h3>
            <p className="text-sm text-gray-500 mt-1">Please check back soon for our latest arrivals!</p>
          </div>
        )}
      </section>

      {/* 5) Newsletter / Discount CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-indigo-900 text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto text-center space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-800 text-indigo-200 text-xs font-semibold tracking-wider uppercase">
              Exclusive Member Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get 10% off your first order
            </h2>
            <p className="text-sm sm:text-base text-indigo-200 max-w-lg mx-auto">
              Subscribe to our weekly newsletter for VIP drops, flash sales, and early access to discounts.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/20 transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold text-sm shadow-md transition-colors flex-shrink-0"
              >
                Claim 10% Off
              </button>
            </form>
            <p className="text-xs text-indigo-300 pt-1">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

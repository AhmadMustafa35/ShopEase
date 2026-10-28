import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  HiShoppingBag, 
  HiChevronLeft, 
  HiChevronRight, 
  HiExclamationCircle, 
  HiTruck, 
  HiShieldCheck, 
  HiArrowPath, 
  HiSparkles,
  HiHome,
  HiChevronDoubleLeft,
  HiChevronDoubleRight
} from 'react-icons/hi2';
import { getProducts } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('shopease_view_mode') || 'grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters state from query parameters
  const currentFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('shopease_view_mode', mode);
    } catch {
      // ignore
    }
  };

  const fetchProductsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageParam = Number(searchParams.get('page')) || 1;
      const searchParam = searchParams.get('search') || '';
      const categoryParam = searchParams.get('category') || '';
      const sortParam = searchParams.get('sort') || 'newest';

      const res = await getProducts({
        page: pageParam,
        limit: 12,
        search: searchParam,
        category: categoryParam,
        sort: sortParam,
      });

      if (res?.success) {
        setProducts(res.products || []);
        setCurrentPage(res.page || pageParam);
        setTotalPages(res.pages || 1);
        setTotalProducts(res.total || (res.products ? res.products.length : 0));
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Unable to load products. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // Handle filter bar updates
  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.sort && newFilters.sort !== 'newest') params.set('sort', newFilters.sort);
    
    // Always reset to page 1 on new filter search
    params.set('page', '1');
    setSearchParams(params);
  };

  // Handle pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16">
      
      {/* 1) Hero Header Section */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs text-indigo-200/80 gap-1.5 mb-4">
            <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <HiHome className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Catalog</span>
            {currentFilters.category && (
              <>
                <span>/</span>
                <span className="text-amber-400 font-bold">{currentFilters.category}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
                <HiSparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Curated Quality Picks</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                {currentFilters.category ? `${currentFilters.category}` : 'Explore All Products'}
              </h1>
              <p className="text-indigo-200/90 text-sm sm:text-base mt-2 max-w-xl">
                Browse our handpicked inventory with free shipping, verified reviews, and instant dispatch.
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold text-white">
                {loading ? 'Fetching...' : `${totalProducts} Products Available`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Filters Bar with Pills and Sort */}
        <ProductFilter
          filters={currentFilters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 mb-8 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm shadow-xs">
            <HiExclamationCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* 3) Products Listing */}
        {loading ? (
          /* Skeletons */
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs animate-pulse space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs animate-pulse flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-56 h-48 bg-gray-100 rounded-xl" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : products.length > 0 ? (
          /* Products Grid or List */
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} viewMode="list" />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-24 bg-white rounded-3xl border border-gray-150 shadow-xs p-8 max-w-xl mx-auto my-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <HiShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No matching products found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              We couldn't find any products matching your filters. Try clearing your search term or picking another category.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-gray-500">
              <span>Popular searches:</span>
              {['Headphones', 'Water Bottle', 'Jeans', 'Lamp', 'Backpack'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleFilterChange({ search: item, category: '', sort: 'newest' })}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-medium transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleFilterChange({ search: '', category: '', sort: 'newest' })}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* 4) Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * 12 + 1}</span> to{' '}
              <span className="font-bold text-gray-900">{Math.min(currentPage * 12, totalProducts)}</span> of{' '}
              <span className="font-bold text-gray-900">{totalProducts}</span> products
            </p>

            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <HiChevronDoubleLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                <HiChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <HiChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <HiChevronDoubleRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 5) Confidence / Perks Bar */}
        <section className="mt-20 pt-10 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <HiTruck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Free Express Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">On all orders over $50</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Authentic Guarantee</h4>
              <p className="text-xs text-gray-500 mt-0.5">100% verified original items</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <HiArrowPath className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">30-Day Free Returns</h4>
              <p className="text-xs text-gray-500 mt-0.5">No-hassle instant refunds</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <HiSparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-gray-500 mt-0.5">Friendly customer team</p>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default ProductsPage;

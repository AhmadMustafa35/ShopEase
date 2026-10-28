import React, { useState, useEffect } from 'react';
import { 
  HiMagnifyingGlass, 
  HiXMark, 
  HiArrowsUpDown, 
  HiSquares2X2, 
  HiListBullet,
  HiSparkles
} from 'react-icons/hi2';
import { getCategories } from '../../services/api';

const ProductFilter = ({ 
  filters = {}, 
  onFilterChange, 
  viewMode = 'grid', 
  onViewModeChange 
}) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  const [selectedSort, setSelectedSort] = useState(filters.sort || 'newest');

  // Load available categories
  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (isMounted && res?.success && Array.isArray(res.categories)) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state if external filters change
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setSelectedCategory(filters.category || '');
    setSelectedSort(filters.sort || 'newest');
  }, [filters.search, filters.category, filters.sort]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({
          search: searchTerm,
          category: selectedCategory,
          sort: selectedSort,
        });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleCategoryClick = (cat) => {
    const newCategory = selectedCategory === cat ? '' : cat;
    setSelectedCategory(newCategory);
    onFilterChange({
      search: searchTerm,
      category: newCategory,
      sort: selectedSort,
    });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
    onFilterChange({
      search: searchTerm,
      category: selectedCategory,
      sort: newSort,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSort('newest');
    onFilterChange({
      search: '',
      category: '',
      sort: 'newest',
    });
  };

  const hasActiveFilters = Boolean(searchTerm || selectedCategory || (selectedSort && selectedSort !== 'newest'));

  return (
    <div className="space-y-4 mb-8">
      
      {/* 1) Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategoryClick('')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 select-none ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-102'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-xs'
          }`}
        >
          <HiSparkles className="w-3.5 h-3.5" />
          <span>All Items</span>
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-102 font-bold'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-xs'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2) Main Filter Controls Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-150 p-3 sm:p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <HiMagnifyingGlass className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, category, or brand..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <HiXMark className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Side: Sort dropdown & Grid/List view toggle */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            
            {/* Sort Selector */}
            <div className="relative flex-1 sm:flex-initial min-w-[170px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <HiArrowsUpDown className="w-4 h-4" />
              </div>
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="w-full py-2.5 pl-9 pr-8 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 font-semibold cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            {onViewModeChange && (
              <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200/80">
                <button
                  type="button"
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <HiSquares2X2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="List View"
                  aria-label="List View"
                >
                  <HiListBullet className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* 3) Active Filters Chips Bar */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-500">Active filters:</span>
              
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                  Category: {selectedCategory}
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(selectedCategory)}
                    className="hover:text-indigo-900"
                    aria-label="Remove category filter"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                  Search: "{searchTerm}"
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-indigo-900"
                    aria-label="Remove search filter"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedSort !== 'newest' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200">
                  Sorted
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSort('newest');
                      onFilterChange({ search: searchTerm, category: selectedCategory, sort: 'newest' });
                    }}
                    className="hover:text-gray-900"
                    aria-label="Reset sort"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductFilter;

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../services/api'
import { Search, Filter, Grid, List } from 'lucide-react'

const BrowseItems = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    page: 1
  })
  const [viewMode, setViewMode] = useState('grid')

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsAPI.getAll(filters).then(res => res.data),
  })

  const categories = [
    'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 
    'accessories', 'bags', 'jewelry', 'other'
  ]

  const types = [
    'casual', 'formal', 'business', 'sportswear', 'vintage',
    'designer', 'streetwear', 'bohemian', 'minimalist', 'other'
  ]

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
    'US 4', 'US 6', 'US 8', 'US 10', 'US 12', 'US 14', 'US 16',
    'EU 34', 'EU 36', 'EU 38', 'EU 40', 'EU 42', 'EU 44', 'EU 46',
    'UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18',
    'One Size', 'Custom'
  ]

  const conditions = ['excellent', 'good', 'fair', 'poor']

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      size: '',
      condition: '',
      page: 1
    })
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error loading items. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Browse Items</h1>
          <p className="text-base-content/70 mt-2">
            Discover amazing clothing items from our community
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search items..."
                className="input input-bordered w-full pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <select
            className="select select-bordered w-full"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            className="select select-bordered w-full"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Size */}
          <select
            className="select select-bordered w-full"
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
          >
            <option value="">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          {/* Condition */}
          <select
            className="select select-bordered w-full"
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
          >
            <option value="">All Conditions</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="btn btn-ghost btn-sm"
          >
            Clear Filters
          </button>
          <p className="text-sm text-base-content/70">
            {data?.data?.length || 0} items found
          </p>
        </div>
      </div>

      {/* Items Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : data?.data?.length > 0 ? (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {data.data.map((item) => (
              <ItemCard key={item._id} item={item} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination && data.pagination.total > 1 && (
            <div className="flex justify-center">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={!data.pagination.hasPrev}
                  onClick={() => handlePageChange(data.pagination.current - 1)}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {data.pagination.current} of {data.pagination.total}
                </button>
                <button
                  className="join-item btn"
                  disabled={!data.pagination.hasNext}
                  onClick={() => handlePageChange(data.pagination.current + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-base-content/30" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-base-content/70 mb-4">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={clearFilters}
            className="btn btn-primary"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

const ItemCard = ({ item, viewMode }) => {
  return (
    <Link to={`/items/${item._id}`}>
      <div className={`bg-base-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${
        viewMode === 'list' ? 'flex' : ''
      }`}>
        {/* Image */}
        <div className={`bg-base-300 ${
          viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'
        }`}>
          {item.images?.[0] ? (
            <img
              src={`/uploads/${item.images[0]}`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-base-content/30">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <h3 className="font-semibold text-base-content mb-2 line-clamp-2">
            {item.title}
          </h3>
          
          <div className="space-y-2">
            <p className="text-sm text-base-content/70 line-clamp-2">
              {item.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">{item.category}</span>
              <span className="badge badge-secondary">{item.size}</span>
              <span className="badge badge-outline">{item.condition}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">{item.pointsValue} points</span>
              <span className="text-xs text-base-content/50">
                by {item.uploader?.firstName} {item.uploader?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BrowseItems 
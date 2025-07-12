import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { itemsAPI, swapsAPI } from '../services/api'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  User, 
  Calendar,
  Award,
  RefreshCw,
  ShoppingBag
} from 'lucide-react'
import toast from 'react-hot-toast'

const ItemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showSwapModal, setShowSwapModal] = useState(false)

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsAPI.getById(id).then(res => res.data.data),
  })

  const createSwapMutation = useMutation({
    mutationFn: (swapData) => swapsAPI.create(swapData),
    onSuccess: () => {
      queryClient.invalidateQueries(['userSwaps'])
      toast.success('Swap request sent successfully!')
      setShowSwapModal(false)
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create swap request'
      toast.error(message)
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Item not found or error loading item.</p>
        <button onClick={() => navigate('/browse')} className="btn btn-primary mt-4">
          Back to Browse
        </button>
      </div>
    )
  }

  const isOwner = user?._id === item.uploader?._id

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-base-content">{item.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-base-300 rounded-lg overflow-hidden">
            {item.images?.[selectedImage] ? (
              <img
                src={`/uploads/${item.images[selectedImage]}`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-base-content/30">No image</span>
              </div>
            )}
          </div>
          
          {item.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-base-300 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={`/uploads/${image}`}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          {/* Title and Points */}
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-2">{item.title}</h2>
            <div className="flex items-center gap-2 text-primary font-bold text-xl">
              <Award className="w-5 h-5" />
              {item.pointsValue} points
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <span className={`badge ${
              item.status === 'available' ? 'badge-success' :
              item.status === 'pending' ? 'badge-warning' :
              'badge-error'
            }`}>
              {item.status}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-base-content/70">{item.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-base-content/50">Category</span>
              <p className="font-medium">{item.category}</p>
            </div>
            <div>
              <span className="text-sm text-base-content/50">Type</span>
              <p className="font-medium">{item.type}</p>
            </div>
            <div>
              <span className="text-sm text-base-content/50">Size</span>
              <p className="font-medium">{item.size}</p>
            </div>
            <div>
              <span className="text-sm text-base-content/50">Condition</span>
              <p className="font-medium">{item.condition}</p>
            </div>
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div>
              <span className="text-sm text-base-content/50">Tags</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag, index) => (
                  <span key={index} className="badge badge-outline">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Uploader Info */}
          <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span className="text-sm">
                    {item.uploader?.firstName?.charAt(0)}{item.uploader?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-medium">
                  {item.uploader?.firstName} {item.uploader?.lastName}
                </p>
                <p className="text-sm text-base-content/70">Member</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isAuthenticated && !isOwner && item.status === 'available' ? (
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="btn btn-primary flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Request Swap
                </button>
                <button className="btn btn-outline">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="btn btn-outline">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            ) : isOwner ? (
              <div className="flex gap-4">
                <button className="btn btn-outline flex-1">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Edit Item
                </button>
                <button className="btn btn-error">
                  Delete
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-base-content/70 mb-4">Please log in to request a swap</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary"
                >
                  Login to Swap
                </button>
              </div>
            )}
          </div>

          {/* Posted Date */}
          <div className="text-sm text-base-content/50 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Posted on {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <SwapModal
          item={item}
          onClose={() => setShowSwapModal(false)}
          onSubmit={createSwapMutation.mutate}
          isLoading={createSwapMutation.isPending}
        />
      )}
    </div>
  )
}

const SwapModal = ({ item, onClose, onSubmit, isLoading }) => {
  const [swapType, setSwapType] = useState('points')
  const [pointsOffered, setPointsOffered] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const swapData = {
      itemRequested: item._id,
      swapType,
      message: message.trim() || undefined
    }

    if (swapType === 'points') {
      if (!pointsOffered || pointsOffered <= 0) {
        toast.error('Please enter a valid points value')
        return
      }
      swapData.pointsOffered = parseInt(pointsOffered)
    }

    onSubmit(swapData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Request Swap</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Swap Type</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="swapType"
                  value="points"
                  checked={swapType === 'points'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="radio radio-primary mr-2"
                />
                <span className="label-text">Points</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  name="swapType"
                  value="direct"
                  checked={swapType === 'direct'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="radio radio-primary mr-2"
                />
                <span className="label-text">Direct Swap</span>
              </label>
            </div>
          </div>

          {swapType === 'points' && (
            <div>
              <label className="label">
                <span className="label-text">Points to Offer</span>
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={pointsOffered}
                onChange={(e) => setPointsOffered(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter points value"
              />
            </div>
          )}

          <div>
            <label className="label">
              <span className="label-text">Message (Optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full"
              placeholder="Add a message to the item owner..."
              rows="3"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ItemDetail 
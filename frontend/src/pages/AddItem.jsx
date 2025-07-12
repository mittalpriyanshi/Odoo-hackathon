import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { itemsAPI } from '../services/api'
import { Upload, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const AddItem = () => {
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type`)
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`)
      }
      
      return isValidType && isValidSize
    })

    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const createItemMutation = useMutation({
    mutationFn: (formData) => itemsAPI.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['items'])
      queryClient.invalidateQueries(['userItems'])
      toast.success('Item created successfully!')
      navigate('/dashboard')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create item'
      toast.error(message)
    }
  })

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      
      // Add form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== '') {
          formData.append(key, data[key])
        }
      })
      
      // Add images
      images.forEach(image => {
        formData.append('images', image)
      })

      await createItemMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-base-content">Add New Item</h1>
        <p className="text-base-content/70 mt-2">
          Share your clothing items with the community
        </p>
      </div>

      <div className="bg-base-200 rounded-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Vintage Denim Jacket"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title must be less than 100 characters'
                  }
                })}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.title.message}</span>
                </label>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Category *</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.category.message}</span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">
                <span className="label-text">Type *</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.type ? 'select-error' : ''}`}
                {...register('type', { required: 'Type is required' })}
              >
                <option value="">Select type</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.type.message}</span>
                </label>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Size *</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.size ? 'select-error' : ''}`}
                {...register('size', { required: 'Size is required' })}
              >
                <option value="">Select size</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {errors.size && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.size.message}</span>
                </label>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Condition *</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.condition ? 'select-error' : ''}`}
                {...register('condition', { required: 'Condition is required' })}
              >
                <option value="">Select condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.condition.message}</span>
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description *</span>
            </label>
            <textarea
              className={`textarea textarea-bordered w-full h-32 ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Describe your item in detail..."
              {...register('description', {
                required: 'Description is required',
                maxLength: {
                  value: 1000,
                  message: 'Description must be less than 1000 characters'
                }
              })}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description.message}</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <span className="label-text">Points Value *</span>
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                className={`input input-bordered w-full ${errors.pointsValue ? 'input-error' : ''}`}
                placeholder="Enter points value (1-1000)"
                {...register('pointsValue', {
                  required: 'Points value is required',
                  min: {
                    value: 1,
                    message: 'Points value must be at least 1'
                  },
                  max: {
                    value: 1000,
                    message: 'Points value cannot exceed 1000'
                  }
                })}
              />
              {errors.pointsValue && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.pointsValue.message}</span>
                </label>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Tags</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g., vintage, denim, casual (comma separated)"
                {...register('tags')}
              />
              <label className="label">
                <span className="label-text-alt">Optional: Add tags to help others find your item</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">
              <span className="label-text">Images *</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                <p className="text-base-content/70 mb-4">
                  Upload up to 5 images (JPEG, PNG, WebP, max 5MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div>
              <label className="label">
                <span className="label-text">Image Preview</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-error text-error-content rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <div className="loading loading-spinner loading-sm"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddItem 
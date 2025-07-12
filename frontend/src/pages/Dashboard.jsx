import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { itemsAPI, swapsAPI } from '../services/api'
import { 
  User, 
  ShoppingBag, 
  RefreshCw, 
  Plus,
  Award,
  Calendar,
  TrendingUp
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()

  const { data: userItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['userItems'],
    queryFn: () => itemsAPI.getUserItems().then(res => res.data.data),
  })

  const { data: userSwaps, isLoading: swapsLoading } = useQuery({
    queryKey: ['userSwaps'],
    queryFn: () => swapsAPI.getAll().then(res => res.data.data),
  })

  const stats = [
    {
      label: 'Total Points',
      value: user?.points || 0,
      icon: Award,
      color: 'text-primary'
    },
    {
      label: 'Items Listed',
      value: userItems?.length || 0,
      icon: ShoppingBag,
      color: 'text-secondary'
    },
    {
      label: 'Active Swaps',
      value: userSwaps?.filter(swap => ['pending', 'accepted'].includes(swap.status)).length || 0,
      icon: RefreshCw,
      color: 'text-accent'
    },
    {
      label: 'Completed Swaps',
      value: userSwaps?.filter(swap => swap.status === 'completed').length || 0,
      icon: TrendingUp,
      color: 'text-success'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/70 mt-2">
            Welcome back, {user?.firstName}! Here's what's happening with your account.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/add-item" className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">{stat.label}</p>
                <p className="text-2xl font-bold text-base-content">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-base-300 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Section */}
      <div className="bg-base-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16">
              <span className="text-xl">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-base-content/70">{user?.email}</p>
            <p className="text-sm text-base-content/50">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Items */}
        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Items</h3>
            <Link to="/browse" className="text-sm text-primary hover:text-primary-focus">
              View all
            </Link>
          </div>
          
          {itemsLoading ? (
            <div className="flex justify-center py-8">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          ) : userItems?.length > 0 ? (
            <div className="space-y-4">
              {userItems.slice(0, 5).map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                  <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-base-content/50" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-base-content/70">
                      {item.category} • {item.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.pointsValue} pts</p>
                    <p className="text-xs text-base-content/50">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
              <p className="text-base-content/70 mb-4">No items listed yet</p>
              <Link to="/add-item" className="btn btn-primary btn-sm">
                Add your first item
              </Link>
            </div>
          )}
        </div>

        {/* Recent Swaps */}
        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Swaps</h3>
            <Link to="/swaps" className="text-sm text-primary hover:text-primary-focus">
              View all
            </Link>
          </div>
          
          {swapsLoading ? (
            <div className="flex justify-center py-8">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          ) : userSwaps?.length > 0 ? (
            <div className="space-y-4">
              {userSwaps.slice(0, 5).map((swap) => (
                <div key={swap._id} className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                  <div className="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-base-content/50" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{swap.itemRequested?.title}</h4>
                    <p className="text-sm text-base-content/70">
                      {swap.swapType} • {swap.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {swap.swapType === 'points' ? `${swap.pointsOffered} pts` : 'Direct'}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
              <p className="text-base-content/70 mb-4">No swaps yet</p>
              <Link to="/browse" className="btn btn-primary btn-sm">
                Browse items to swap
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-base-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/add-item" className="btn btn-outline btn-block">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Link>
          <Link to="/browse" className="btn btn-outline btn-block">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Browse Items
          </Link>
          <Link to="/profile" className="btn btn-outline btn-block">
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Link>
          <Link to="/swaps" className="btn btn-outline btn-block">
            <RefreshCw className="w-4 h-4 mr-2" />
            View Swaps
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 
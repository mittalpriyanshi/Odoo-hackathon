import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  Search, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Shield,
  ShoppingBag
} from 'lucide-react'

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Browse Items', href: '/browse', icon: Search },
    { name: 'Add Item', href: '/add-item', icon: Plus },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: Shield }] : [])
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="min-h-screen bg-base-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-base-200 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h1 className="text-xl font-bold text-primary">ReWear</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-content'
                    : 'hover:bg-base-300'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-base-200 shadow-xl">
          <div className="flex items-center p-4 border-b border-base-300">
            <Link to="/" className="text-xl font-bold text-primary">ReWear</Link>
          </div>
          
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-300'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User info */}
          <div className="p-4 border-t border-base-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span className="text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-base-content/70 truncate">
                  {user?.points} points
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-base-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-base-200 border-b border-base-300 p-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-primary">ReWear</Link>
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 
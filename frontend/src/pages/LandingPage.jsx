import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  RefreshCw, 
  Heart, 
  Users, 
  Award,
  ArrowRight,
  ShoppingBag,
  Plus
} from 'lucide-react'


const LandingPage = () => {
  const { isAuthenticated } = useAuth()


  const features = [
    {
      icon: RefreshCw,
      title: 'Sustainable Fashion',
      description: 'Give your clothes a second life and reduce textile waste in our community.'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Connect with like-minded people who care about sustainable fashion.'
    },
    {
      icon: Users,
      title: 'Easy Exchange',
      description: 'Swap items directly or use our point-based system for seamless exchanges.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All items are reviewed and approved to ensure quality standards.'
    }
  ]

  const stats = [
    { label: 'Items Exchanged', value: '1,234+' },
    { label: 'Community Members', value: '567+' },
    { label: 'Waste Reduced', value: '2.5 tons' },
    { label: 'Happy Swappers', value: '890+' }
  ]

  const testimonials = [
    {
      name: 'Priya S.',
      text: 'ReWear made it so easy to swap my old clothes for something new. The community is amazing and I love the retro vibe!',
      location: 'Delhi'
    },
    {
      name: 'Rahul K.',
      text: 'I have saved so much money and helped the environment at the same time. Highly recommend to everyone!',
      location: 'Mumbai'
    },
    {
      name: 'Sneha M.',
      text: 'The point system is fair and the quality of items is great. I found some real gems here!',
      location: 'Bangalore'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-base-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ReWear</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/browse" className="btn btn-ghost">Browse Items</Link>
                  <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost">Login</Link>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-base-content mb-6">
              Give Your Clothes a
              <span className="text-primary"> Second Life</span>
            </h1>
            <p className="text-xl text-base-content/70 mb-8 max-w-3xl mx-auto">
              Join our community clothing exchange platform. Swap unused garments, 
              earn points, and promote sustainable fashion while reducing textile waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/browse" className="btn btn-primary btn-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Browse Items
                  </Link>
                  <Link to="/add-item" className="btn btn-secondary btn-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    List an Item
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Start Swapping
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/browse" className="btn btn-outline btn-lg">
                    Browse Items
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              We're making sustainable fashion accessible and fun for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-base-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-base-content/70">
              Together, we're making a difference in sustainable fashion.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-base-content/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-base-content/70">
              Hear from our community members about their ReWear experience.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card bg-base-100 shadow-md p-6 flex flex-col items-center">
                <div className="avatar placeholder mb-4">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span className="text-lg font-bold">{t.name.charAt(0)}</span>
                  </div>
                </div>
                <p className="text-base-content/80 italic mb-4 text-center">"{t.text}"</p>
                <div className="text-sm text-base-content/60 font-semibold">- {t.name}, {t.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Ready to Start Swapping?
          </h2>
          <p className="text-lg text-base-content/70 mb-8">
            Join thousands of people who are already making sustainable fashion choices.
          </p>
          {isAuthenticated ? (
            <Link to="/add-item" className="btn btn-primary btn-lg">
              <Plus className="w-5 h-5 mr-2" />
              List Your First Item
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">
              Join ReWear Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">ReWear</h3>
            <p className="text-base-content/70 mb-4">
              Community Clothing Exchange Platform
            </p>
            <p className="text-sm text-base-content/50">
              © 2025 ReWear. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 
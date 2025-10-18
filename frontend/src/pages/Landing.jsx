import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Upload, 
  Lightbulb, 
  TrendingUp, 
  Shield, 
  Zap,
  Database,
  PieChart
} from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    { icon: Upload, text: 'Upload Excel Files Instantly' },
    { icon: BarChart3, text: 'Generate Beautiful Charts' },
    { icon: PieChart, text: 'Multiple Chart Types' },
    { icon: Lightbulb, text: 'AI-Powered Insights' },
    { icon: TrendingUp, text: 'Real-Time Analytics' },
    { icon: Database, text: 'Secure Data Storage' },
    { icon: Shield, text: 'Enterprise-Grade Security' },
    { icon: Zap, text: 'Lightning Fast Performance' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass rounded-3xl p-12 max-w-2xl w-full text-center relative z-10 mb-16"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent mb-4">
            XCELTICS
          </h1>
          <p className="text-white/50 text-sm uppercase tracking-[0.3em] mb-6">
            Smarter Data, Smarter Decisions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed"
        >
          {/* Transform your Excel data into powerful insights with AI-driven analytics and stunning visualizations */}
        </motion.p>

        {/* Get Started Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          onClick={() => navigate('/login')}
          className="btn-primary text-lg px-12 py-4 group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center">
            Get Started
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-2 inline-block"
            >
              →
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.button>

        {/* Stats/Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-6 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-orange-400 mb-1">Fast</div>
            <div className="text-sm text-white/50">Processing</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-400 mb-1">Secure</div>
            <div className="text-sm text-white/50">Data Storage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-1">Smart</div>
            <div className="text-sm text-white/50">AI Insights</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Horizontal Scrolling Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative w-full overflow-hidden py-6"
      >
        <div className="flex animate-scroll-left space-x-8">
          {/* Duplicate features for seamless loop */}
          {[...features, ...features].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex items-center space-x-3 glass rounded-full px-6 py-4 min-w-fit whitespace-nowrap"
              >
                <Icon className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-white/90 font-medium">{feature.text}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-white/40 text-sm mt-8 text-center"
      >
        No credit card required • Start analyzing in seconds
      </motion.p>

      {/* CSS for scrolling animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-left {
            animation: scroll-left 30s linear infinite;
          }
          
          .animate-scroll-left:hover {
            animation-play-state: paused;
          }
        `
      }} />
    </div>
  )
}

export default Landing

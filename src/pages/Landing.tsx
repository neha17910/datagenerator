import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildingStore } from '../store/buildingStore';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useBuildingStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <i className="fas fa-building text-white text-lg"></i>
          </div>
          <span className="text-white font-bold text-xl">Build3D AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-white hover:text-blue-300 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-6">
              <i className="fas fa-sparkles"></i>
              <span>AI-Powered 3D Building Generation</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Design Buildings in
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"> 3D </span>
              with AI
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Transform your ideas into detailed 3D building models. Simply describe your building in natural language,
              and our AI generates a fully interactive 3D model you can customize, visualize, and export.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? '/generator' : '/register')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <i className="fas fa-rocket mr-2"></i>
                Start Building
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border border-gray-600 hover:border-gray-400 text-white font-semibold rounded-xl transition-all"
              >
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl border border-blue-500/20 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Decorative 3D building illustration */}
                <div className="relative">
                  <div className="w-48 h-64 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg shadow-2xl relative">
                    {/* Windows grid */}
                    <div className="absolute inset-4 grid grid-cols-3 grid-rows-6 gap-2">
                      {Array.from({ length: 18 }, (_, i) => (
                        <div
                          key={i}
                          className="bg-blue-300/40 rounded-sm animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    {/* Door */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-amber-800 rounded-t-lg"></div>
                  </div>
                  {/* Side building */}
                  <div className="absolute -right-16 bottom-0 w-24 h-40 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg shadow-xl">
                    <div className="absolute inset-3 grid grid-cols-2 grid-rows-4 gap-1.5">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="bg-cyan-300/30 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
                      ))}
                    </div>
                  </div>
                  {/* Ground */}
                  <div className="absolute -bottom-4 -left-8 -right-20 h-4 bg-green-800/50 rounded-full blur-sm"></div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-16 left-8 w-12 h-12 bg-cyan-500/20 rounded-full animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to design, visualize, and export professional 3D building models.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: 'fa-brain',
              title: 'AI Generation',
              description: 'Describe your building in natural language and watch AI create a detailed 3D model instantly.',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: 'fa-cube',
              title: 'Interactive 3D',
              description: 'Rotate, zoom, and explore your building from every angle with our WebGL-powered viewer.',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: 'fa-sliders',
              title: 'Full Customization',
              description: 'Adjust dimensions, materials, rooms, and features with intuitive real-time controls.',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: 'fa-download',
              title: 'Export Models',
              description: 'Export your designs in GLTF, GLB, or OBJ formats for use in other 3D applications.',
              color: 'from-orange-500 to-amber-500',
            },
            {
              icon: 'fa-save',
              title: 'Project Management',
              description: 'Save, organize, and manage all your building projects in one centralized dashboard.',
              color: 'from-indigo-500 to-blue-500',
            },
            {
              icon: 'fa-moon',
              title: 'Day/Night Mode',
              description: 'Visualize your building in different lighting conditions with day and night rendering modes.',
              color: 'from-violet-500 to-purple-500',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${feature.icon} text-white`}></i>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Start creating stunning 3D building models today. No 3D modeling experience required.
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/generator' : '/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <i className="fas fa-building text-white text-sm"></i>
            </div>
            <span className="text-white font-semibold">Build3D AI</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 Build3D AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

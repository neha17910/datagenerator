import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildingStore } from '../store/buildingStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, projects, logout } = useBuildingStore();
  const [showLogout, setShowLogout] = useState(false);

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: 'fa-cube', color: 'from-blue-500 to-cyan-500' },
    { label: 'This Month', value: Math.max(1, projects.length - 1), icon: 'fa-calendar', color: 'from-green-500 to-emerald-500' },
    { label: 'Total Floors', value: projects.reduce((sum, p) => sum + p.config.floors, 0), icon: 'fa-layer-group', color: 'from-purple-500 to-pink-500' },
    { label: 'Total Area', value: `${projects.reduce((sum, p) => sum + p.config.dimensions.width * p.config.dimensions.length * p.config.floors, 0).toFixed(0)} m²`, icon: 'fa-ruler-combined', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <header className="bg-gray-800/80 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <i className="fas fa-building text-white"></i>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Build3D AI</h1>
              <p className="text-gray-400 text-xs">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/generator')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <i className="fas fa-plus mr-2"></i>New Building
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
              >
                <i className="fas fa-user"></i>
              </button>
              {showLogout && (
                <div className="absolute right-0 top-12 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white text-sm font-medium">{user?.name}</p>
                    <p className="text-gray-400 text-xs">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 text-sm flex items-center gap-2"
                  >
                    <i className="fas fa-cog"></i>Profile
                  </button>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 text-sm flex items-center gap-2"
                  >
                    <i className="fas fa-sign-out-alt"></i>Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h2>
          <p className="text-gray-400 mt-1">Here's an overview of your building projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <i className={`fas ${stat.icon} text-white`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
              <button
                onClick={() => navigate('/projects')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View All <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  onClick={() => { useBuildingStore.getState().loadProject(project.id); navigate('/generator'); }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-building text-blue-400"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{project.name}</h4>
                      <p className="text-gray-400 text-sm">{project.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">{project.config.floors} floors</p>
                    <p className="text-gray-500 text-xs">{project.updatedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Generator */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Generate</h3>
            <p className="text-gray-400 text-sm mb-4">
              Describe a building and let AI generate it for you.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate('/generator')}>
                <p className="text-gray-300 text-sm">"Modern 3-floor house with 4 bedrooms and a garden"</p>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate('/generator')}>
                <p className="text-gray-300 text-sm">"Commercial office building with 5 floors and parking"</p>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => navigate('/generator')}>
                <p className="text-gray-300 text-sm">"Cozy 2-floor cottage with balcony and rooftop garden"</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/generator')}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-sm font-medium transition-all"
            >
              <i className="fas fa-magic mr-2"></i>Open Generator
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildingStore } from '../store/buildingStore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, projects, logout } = useBuildingStore();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const totalProjects = projects.length;
  const totalFloors = projects.reduce((sum, p) => sum + p.config.floors, 0);
  const totalArea = projects.reduce((sum, p) => sum + p.config.dimensions.width * p.config.dimensions.length * p.config.floors, 0);

  const handleSave = () => {
    setEditMode(false);
    // In a real app, this would update the user profile via API
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <header className="bg-gray-800/80 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-white font-bold text-lg">Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center">
              <i className="fas fa-user text-white text-3xl"></i>
            </div>
            <div className="flex-1 text-center md:text-left">
              {editMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save</button>
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <p className="text-gray-500 text-sm mt-1">Member since January 2024</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-cube text-blue-400"></i>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-white text-xl font-bold">{totalProjects}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-layer-group text-green-400"></i>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Floors</p>
                <p className="text-white text-xl font-bold">{totalFloors}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-ruler-combined text-purple-400"></i>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Area</p>
                <p className="text-white text-xl font-bold">{totalArea.toFixed(0)} m²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="text-gray-300 text-sm font-medium">Email Notifications</p>
                <p className="text-gray-500 text-xs">Receive updates about your projects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p className="text-gray-300 text-sm font-medium">Auto-save Projects</p>
                <p className="text-gray-500 text-xs">Automatically save changes to your projects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-gray-300 text-sm font-medium">Dark Mode</p>
                <p className="text-gray-500 text-xs">Use dark theme for the interface</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-red-900/10 border border-red-900/30 rounded-2xl p-6">
          <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
          <div className="flex gap-3">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 rounded-lg text-sm transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

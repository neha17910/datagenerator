import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildingStore } from '../store/buildingStore';

export default function Projects() {
  const navigate = useNavigate();
  const { projects, loadProject, deleteProject } = useBuildingStore();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <header className="bg-gray-800/80 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <i className="fas fa-building text-white text-sm"></i>
            </div>
            <h1 className="text-white font-bold text-lg">My Projects</h1>
          </div>
          <button
            onClick={() => navigate('/generator')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            <i className="fas fa-plus mr-2"></i>New Building
          </button>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-folder-open text-gray-500 text-3xl"></i>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Projects Yet</h3>
            <p className="text-gray-400 mb-6">Create your first 3D building project to get started.</p>
            <button
              onClick={() => navigate('/generator')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium"
            >
              <i className="fas fa-plus mr-2"></i>Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all group"
              >
                {/* Project Preview */}
                <div className="h-40 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 flex items-center justify-center relative">
                  <div className="text-center">
                    <i className="fas fa-building text-blue-400/50 text-4xl group-hover:text-blue-400/70 transition-colors"></i>
                    <p className="text-gray-400 text-xs mt-2">{project.config.floors} floors • {project.config.dimensions.width}×{project.config.dimensions.length}m</p>
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-300 text-xs capitalize">
                    {project.config.buildingType}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{project.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span><i className="fas fa-calendar mr-1"></i>{project.createdAt}</span>
                    <span><i className="fas fa-layer-group mr-1"></i>{project.config.floors} floors</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { loadProject(project.id); navigate('/generator'); }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="py-2 px-3 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

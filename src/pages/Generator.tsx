import React, { useState, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuildingStore } from '../store/buildingStore';
import { generateFromPrompt, validateConfig } from '../utils/aiSimulator';
import { getBuildingStats } from '../utils/buildingGenerator';
import BuildingScene from '../three/BuildingScene';

export default function Generator() {
  const navigate = useNavigate();
  const {
    currentConfig, setConfig, updateDimensions, updateRooms, updateFeatures,
    updateStyle, updateWindows, isGenerating, setGenerating, wireframeMode,
    dayMode, showGrid, showAxes, toggleWireframe, toggleDayMode, toggleGrid,
    toggleAxes, sidebarOpen, rightPanelOpen, toggleSidebar, toggleRightPanel,
    saveProject, user, resetConfig
  } = useBuildingStore();

  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'dimensions' | 'rooms' | 'features' | 'style'>('dimensions');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const stats = getBuildingStats(currentConfig);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    
    setGenerating(true);
    setValidationErrors([]);
    
    setTimeout(() => {
      const config = generateFromPrompt(prompt);
      const validation = validateConfig(config);
      
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        setGenerating(false);
        return;
      }
      
      setConfig(config);
      setGenerating(false);
    }, 1500);
  }, [prompt, setConfig, setGenerating]);

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveProject(saveName, saveDesc || 'A building project');
    setShowSaveModal(false);
    setSaveName('');
    setSaveDesc('');
  };

  const handleExport = (format: string) => {
    setShowExportMenu(false);
    // Simulate export
    const data = JSON.stringify(currentConfig, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `building-config.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <i className="fas fa-building text-white text-sm"></i>
          </div>
          <span className="text-white font-semibold text-sm hidden sm:block">Build3D AI</span>
          <span className="text-gray-500 hidden md:block">/</span>
          <span className="text-gray-300 text-sm hidden md:block">3D Generator</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View controls */}
          <div className="hidden md:flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={toggleDayMode}
              className={`px-2 py-1.5 rounded text-xs transition-colors ${dayMode ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Day/Night"
            >
              <i className={`fas ${dayMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button
              onClick={toggleWireframe}
              className={`px-2 py-1.5 rounded text-xs transition-colors ${wireframeMode ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Wireframe"
            >
              <i className="fas fa-border-all"></i>
            </button>
            <button
              onClick={toggleGrid}
              className={`px-2 py-1.5 rounded text-xs transition-colors ${showGrid ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Grid"
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              onClick={toggleAxes}
              className={`px-2 py-1.5 rounded text-xs transition-colors ${showAxes ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Axes"
            >
              <i className="fas fa-arrows-alt"></i>
            </button>
          </div>

          <button
            onClick={toggleSidebar}
            className={`px-2 py-1.5 rounded text-xs transition-colors ${sidebarOpen ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Toggle Controls"
          >
            <i className="fas fa-columns"></i>
          </button>
          <button
            onClick={toggleRightPanel}
            className={`px-2 py-1.5 rounded text-xs transition-colors ${rightPanelOpen ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Toggle Info Panel"
          >
            <i className="fas fa-info-circle"></i>
          </button>

          <div className="w-px h-6 bg-gray-700 mx-1"></div>

          <button
            onClick={() => setShowSaveModal(true)}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <i className="fas fa-save mr-1"></i><span className="hidden sm:inline">Save</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <i className="fas fa-download mr-1"></i><span className="hidden sm:inline">Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-8 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                {['GLTF', 'GLB', 'OBJ', 'JSON'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 text-sm flex items-center gap-2"
                  >
                    <i className="fas fa-file"></i>Export as {fmt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        {sidebarOpen && (
          <aside className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden shrink-0">
            {/* AI Prompt */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                <i className="fas fa-magic text-blue-400"></i>AI Generate
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your building... e.g., 'Modern 3-floor house with 4 bedrooms, parking and garden'"
                className="w-full h-20 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
              >
                {isGenerating ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i>Generating...</>
                ) : (
                  <><i className="fas fa-wand-magic-sparkles mr-2"></i>Generate Building</>
                )}
              </button>
              {validationErrors.length > 0 && (
                <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                  {validationErrors.map((err, i) => (
                    <p key={i} className="text-red-300 text-xs"><i className="fas fa-exclamation-triangle mr-1"></i>{err}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'dimensions', icon: 'fa-ruler', label: 'Size' },
                { id: 'rooms', icon: 'fa-door-open', label: 'Rooms' },
                { id: 'features', icon: 'fa-star', label: 'Features' },
                { id: 'style', icon: 'fa-palette', label: 'Style' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <i className={`fas ${tab.icon} block mb-0.5`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Controls Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'dimensions' && (
                <>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Building Type</label>
                    <select
                      value={currentConfig.buildingType}
                      onChange={(e) => setConfig({ buildingType: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="apartment">Apartment</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Floors: {currentConfig.floors}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentConfig.floors}
                      onChange={(e) => setConfig({ floors: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Width: {currentConfig.dimensions.width}m</label>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={currentConfig.dimensions.width}
                      onChange={(e) => updateDimensions({ width: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Length: {currentConfig.dimensions.length}m</label>
                    <input
                      type="range"
                      min="4"
                      max="50"
                      value={currentConfig.dimensions.length}
                      onChange={(e) => updateDimensions({ length: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Floor Height: {currentConfig.dimensions.floorHeight}m</label>
                    <input
                      type="range"
                      min="2.5"
                      max="5"
                      step="0.1"
                      value={currentConfig.dimensions.floorHeight}
                      onChange={(e) => updateDimensions({ floorHeight: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Windows per Floor: {currentConfig.windows.perFloor}</label>
                    <input
                      type="range"
                      min="2"
                      max="12"
                      value={currentConfig.windows.perFloor}
                      onChange={(e) => updateWindows({ perFloor: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Window Size</label>
                    <select
                      value={currentConfig.windows.size}
                      onChange={(e) => updateWindows({ size: e.target.value as any })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'rooms' && (
                <>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Bedrooms: {currentConfig.rooms.bedrooms}</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={currentConfig.rooms.bedrooms}
                      onChange={(e) => updateRooms({ bedrooms: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Bathrooms: {currentConfig.rooms.bathrooms}</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={currentConfig.rooms.bathrooms}
                      onChange={(e) => updateRooms({ bathrooms: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Kitchens: {currentConfig.rooms.kitchen}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={currentConfig.rooms.kitchen}
                      onChange={(e) => updateRooms({ kitchen: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Living Rooms: {currentConfig.rooms.livingRoom}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={currentConfig.rooms.livingRoom}
                      onChange={(e) => updateRooms({ livingRoom: parseInt(e.target.value) })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Main Doors: {currentConfig.doors.main}</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={currentConfig.doors.main}
                      onChange={(e) => setConfig({ doors: { ...currentConfig.doors, main: parseInt(e.target.value) } })}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'features' && (
                <>
                  {[
                    { key: 'balcony', label: 'Balconies', icon: 'fa-building' },
                    { key: 'parking', label: 'Parking Area', icon: 'fa-car' },
                    { key: 'garden', label: 'Garden & Trees', icon: 'fa-tree' },
                    { key: 'rooftop', label: 'Rooftop Garden', icon: 'fa-leaf' },
                    { key: 'stairs', label: 'Staircase', icon: 'fa-stairs' },
                  ].map((feature) => (
                    <label
                      key={feature.key}
                      className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <i className={`fas ${feature.icon} text-gray-400 w-5 text-center`}></i>
                        <span className="text-gray-300 text-sm">{feature.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={(currentConfig.features as any)[feature.key]}
                        onChange={(e) => updateFeatures({ [feature.key]: e.target.checked } as any)}
                        className="w-5 h-5 accent-blue-500 rounded"
                      />
                    </label>
                  ))}
                </>
              )}

              {activeTab === 'style' && (
                <>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-1 block">Wall Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentConfig.style.wallColor}
                        onChange={(e) => updateStyle({ wallColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-gray-600 cursor-pointer"
                      />
                      <span className="text-gray-400 text-sm">{currentConfig.style.wallColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-2 block">Roof Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['flat', 'gable'].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateStyle({ roofType: type })}
                          className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                            currentConfig.style.roofType === type
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-900 text-gray-400 border border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-xs font-medium mb-2 block">Window Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['modern', 'classic', 'large'].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateStyle({ windowStyle: style })}
                          className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                            currentConfig.style.windowStyle === style
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-900 text-gray-400 border border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={resetConfig}
                    className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                  >
                    <i className="fas fa-undo mr-2"></i>Reset to Default
                  </button>
                </>
              )}
            </div>
          </aside>
        )}

        {/* 3D Viewport */}
        <main className="flex-1 relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading 3D Scene...</p>
              </div>
            </div>
          }>
            <BuildingScene />
          </Suspense>

          {/* Viewport overlay info */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-gray-300 text-xs">
              <i className="fas fa-mouse mr-1"></i>Orbit: Left Click | Zoom: Scroll | Pan: Right Click
            </div>
          </div>

          {/* Loading overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">AI is generating your building...</p>
                <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Info */}
        {rightPanelOpen && (
          <aside className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden shrink-0 hidden lg:flex">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium text-sm flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-400"></i>Building Info
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Stats */}
              <div className="space-y-3">
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Statistics</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Total Area</p>
                    <p className="text-white font-semibold text-sm">{stats.totalArea}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Footprint</p>
                    <p className="text-white font-semibold text-sm">{stats.footprint}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Height</p>
                    <p className="text-white font-semibold text-sm">{stats.totalHeight}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Rooms</p>
                    <p className="text-white font-semibold text-sm">{stats.totalRooms}</p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-3">
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Configuration</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white capitalize">{currentConfig.buildingType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Floors</span>
                    <span className="text-white">{currentConfig.floors}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Dimensions</span>
                    <span className="text-white">{currentConfig.dimensions.width}×{currentConfig.dimensions.length}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Floor Height</span>
                    <span className="text-white">{currentConfig.dimensions.floorHeight}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bedrooms</span>
                    <span className="text-white">{currentConfig.rooms.bedrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bathrooms</span>
                    <span className="text-white">{currentConfig.rooms.bathrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Windows/Floor</span>
                    <span className="text-white">{currentConfig.windows.perFloor}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Active Features</h4>
                <div className="flex flex-wrap gap-1.5">
                  {stats.features.map((feature) => (
                    <span key={feature} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs capitalize">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* JSON Preview */}
              <div className="space-y-3">
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider">Config JSON</h4>
                <pre className="bg-gray-900 rounded-lg p-3 text-xs text-gray-400 overflow-x-auto max-h-48 overflow-y-auto">
                  {JSON.stringify(currentConfig, null, 2)}
                </pre>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              <i className="fas fa-save mr-2 text-blue-400"></i>Save Project
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1 block">Project Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="My Building Project"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1 block">Description</label>
                <textarea
                  value={saveDesc}
                  onChange={(e) => setSaveDesc(e.target.value)}
                  placeholder="A brief description..."
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { create } from 'zustand';

export interface BuildingConfig {
  buildingType: string;
  floors: number;
  dimensions: {
    width: number;
    length: number;
    floorHeight: number;
  };
  rooms: {
    bedrooms: number;
    bathrooms: number;
    kitchen: number;
    livingRoom: number;
  };
  features: {
    balcony: boolean;
    parking: boolean;
    garden: boolean;
    rooftop: boolean;
    stairs: boolean;
  };
  style: {
    wallColor: string;
    roofType: string;
    windowStyle: string;
    doorStyle: string;
  };
  windows: {
    perFloor: number;
    size: 'small' | 'medium' | 'large';
  };
  doors: {
    main: number;
    interior: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  config: BuildingConfig;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

interface BuildingState {
  // Auth state
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  
  // Building state
  currentConfig: BuildingConfig;
  isGenerating: boolean;
  wireframeMode: boolean;
  dayMode: boolean;
  showGrid: boolean;
  showAxes: boolean;
  
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // UI state
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  
  // Actions
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  setConfig: (config: Partial<BuildingConfig>) => void;
  updateDimensions: (dims: Partial<BuildingConfig['dimensions']>) => void;
  updateRooms: (rooms: Partial<BuildingConfig['rooms']>) => void;
  updateFeatures: (features: Partial<BuildingConfig['features']>) => void;
  updateStyle: (style: Partial<BuildingConfig['style']>) => void;
  updateWindows: (windows: Partial<BuildingConfig['windows']>) => void;
  setGenerating: (val: boolean) => void;
  toggleWireframe: () => void;
  toggleDayMode: () => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  saveProject: (name: string, description: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  resetConfig: () => void;
}

const defaultConfig: BuildingConfig = {
  buildingType: 'residential',
  floors: 3,
  dimensions: {
    width: 12,
    length: 16,
    floorHeight: 3.2,
  },
  rooms: {
    bedrooms: 4,
    bathrooms: 3,
    kitchen: 1,
    livingRoom: 1,
  },
  features: {
    balcony: true,
    parking: true,
    garden: true,
    rooftop: true,
    stairs: true,
  },
  style: {
    wallColor: '#e8e0d4',
    roofType: 'flat',
    windowStyle: 'modern',
    doorStyle: 'modern',
  },
  windows: {
    perFloor: 6,
    size: 'medium',
  },
  doors: {
    main: 1,
    interior: 4,
  },
};

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Villa',
    description: 'A modern 3-floor residential building',
    config: { ...defaultConfig, buildingType: 'residential', floors: 3 },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Office Complex',
    description: 'Commercial office building with 5 floors',
    config: {
      ...defaultConfig,
      buildingType: 'commercial',
      floors: 5,
      dimensions: { width: 20, length: 25, floorHeight: 3.5 },
      features: { ...defaultConfig.features, balcony: false, garden: false },
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Cozy Cottage',
    description: 'A small 2-floor cottage with garden',
    config: {
      ...defaultConfig,
      floors: 2,
      dimensions: { width: 8, length: 10, floorHeight: 3 },
      rooms: { bedrooms: 2, bathrooms: 1, kitchen: 1, livingRoom: 1 },
      features: { ...defaultConfig.features, parking: false, balcony: false },
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
];

export const useBuildingStore = create<BuildingState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  currentConfig: { ...defaultConfig },
  isGenerating: false,
  wireframeMode: false,
  dayMode: true,
  showGrid: true,
  showAxes: false,
  projects: sampleProjects,
  currentProject: null,
  sidebarOpen: true,
  rightPanelOpen: true,

  login: (email, _password) => {
    set({
      isAuthenticated: true,
      user: { name: email.split('@')[0], email },
    });
  },

  register: (name, email, _password) => {
    set({
      isAuthenticated: true,
      user: { name, email },
    });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, currentProject: null });
  },

  setConfig: (config) => {
    set((state) => ({
      currentConfig: { ...state.currentConfig, ...config },
    }));
  },

  updateDimensions: (dims) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        dimensions: { ...state.currentConfig.dimensions, ...dims },
      },
    }));
  },

  updateRooms: (rooms) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        rooms: { ...state.currentConfig.rooms, ...rooms },
      },
    }));
  },

  updateFeatures: (features) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        features: { ...state.currentConfig.features, ...features },
      },
    }));
  },

  updateStyle: (style) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        style: { ...state.currentConfig.style, ...style },
      },
    }));
  },

  updateWindows: (windows) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        windows: { ...state.currentConfig.windows, ...windows },
      },
    }));
  },

  setGenerating: (val) => set({ isGenerating: val }),

  toggleWireframe: () => set((state) => ({ wireframeMode: !state.wireframeMode })),
  toggleDayMode: () => set((state) => ({ dayMode: !state.dayMode })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  saveProject: (name, description) => {
    const { currentConfig, projects } = get();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      config: { ...currentConfig },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    set({ projects: [newProject, ...projects], currentProject: newProject });
  },

  loadProject: (id) => {
    const project = get().projects.find((p) => p.id === id);
    if (project) {
      set({ currentConfig: { ...project.config }, currentProject: project });
    }
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  resetConfig: () => set({ currentConfig: { ...defaultConfig } }),
}));

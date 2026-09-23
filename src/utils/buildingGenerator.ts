import * as THREE from 'three';
import { BuildingConfig } from '../store/buildingStore';

export function createBuildingGeometry(config: BuildingConfig) {
  const { dimensions, floors, rooms, features, style, windows } = config;
  const { width, length, floorHeight } = dimensions;
  
  const buildingData = {
    floors: [] as any[],
    totalHeight: floors * floorHeight,
    width,
    length,
  };

  for (let i = 0; i < floors; i++) {
    const floorData = {
      level: i,
      height: floorHeight,
      y: i * floorHeight,
      windows: [] as any[],
      doors: [] as any[],
      balconies: [] as any[],
    };

    // Windows distribution
    const windowsPerSide = Math.floor(windows.perFloor / 4);
    const windowSize = windows.size === 'large' ? 1.8 : windows.size === 'medium' ? 1.2 : 0.8;
    const windowHeight = windows.size === 'large' ? 2.0 : windows.size === 'medium' ? 1.5 : 1.0;

    // Front and back windows
    for (let w = 0; w < windowsPerSide; w++) {
      const x = -width / 2 + (width / (windowsPerSide + 1)) * (w + 1);
      floorData.windows.push({
        position: [x, i * floorHeight + floorHeight * 0.5, length / 2 + 0.01],
        size: [windowSize, windowHeight],
        rotation: [0, 0, 0],
      });
      floorData.windows.push({
        position: [x, i * floorHeight + floorHeight * 0.5, -length / 2 - 0.01],
        size: [windowSize, windowHeight],
        rotation: [0, Math.PI, 0],
      });
    }

    // Side windows
    const sideWindows = Math.max(1, Math.floor(windowsPerSide * (length / width)));
    for (let w = 0; w < sideWindows; w++) {
      const z = -length / 2 + (length / (sideWindows + 1)) * (w + 1);
      floorData.windows.push({
        position: [width / 2 + 0.01, i * floorHeight + floorHeight * 0.5, z],
        size: [windowSize, windowHeight],
        rotation: [0, Math.PI / 2, 0],
      });
      floorData.windows.push({
        position: [-width / 2 - 0.01, i * floorHeight + floorHeight * 0.5, z],
        size: [windowSize, windowHeight],
        rotation: [0, -Math.PI / 2, 0],
      });
    }

    // Main door (ground floor only)
    if (i === 0) {
      floorData.doors.push({
        position: [0, floorHeight * 0.4, length / 2 + 0.02],
        size: [1.2, 2.4],
      });
    }

    // Balconies
    if (features.balcony && i > 0) {
      const balconyPositions = [
        [-width / 4, i * floorHeight, length / 2 + 1],
        [width / 4, i * floorHeight, length / 2 + 1],
      ];
      floorData.balconies = balconyPositions.map(pos => ({
        position: pos,
        size: [2, 0.2, 1.5],
      }));
    }

    buildingData.floors.push(floorData);
  }

  return buildingData;
}

export function getBuildingStats(config: BuildingConfig) {
  const { dimensions, floors, rooms, features } = config;
  const totalArea = dimensions.width * dimensions.length * floors;
  const footprint = dimensions.width * dimensions.length;
  
  return {
    totalArea: `${totalArea.toFixed(0)} m²`,
    footprint: `${footprint.toFixed(0)} m²`,
    totalHeight: `${(floors * dimensions.floorHeight).toFixed(1)} m`,
    totalRooms: rooms.bedrooms + rooms.bathrooms + rooms.kitchen + rooms.livingRoom,
    features: Object.entries(features).filter(([_, v]) => v).map(([k]) => k),
  };
}

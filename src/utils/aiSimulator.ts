import { BuildingConfig } from '../store/buildingStore';

interface ParsedPrompt {
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  width?: number;
  length?: number;
  buildingType?: string;
  features: string[];
}

function parsePrompt(prompt: string): ParsedPrompt {
  const result: ParsedPrompt = { features: [] };
  const lower = prompt.toLowerCase();

  // Extract floors
  const floorMatch = lower.match(/(\d+)\s*(?:floor|storey|story|level)/);
  if (floorMatch) result.floors = parseInt(floorMatch[1]);

  // Extract bedrooms
  const bedroomMatch = lower.match(/(\d+)\s*(?:bedroom|bed)/);
  if (bedroomMatch) result.bedrooms = parseInt(bedroomMatch[1]);

  // Extract bathrooms
  const bathroomMatch = lower.match(/(\d+)\s*(?:bathroom|bath)/);
  if (bathroomMatch) result.bathrooms = parseInt(bathroomMatch[1]);

  // Extract dimensions
  const widthMatch = lower.match(/(\d+)\s*(?:meter|m)\s*(?:wide|width)/);
  if (widthMatch) result.width = parseInt(widthMatch[1]);
  
  const lengthMatch = lower.match(/(\d+)\s*(?:meter|m)\s*(?:long|length)/);
  if (lengthMatch) result.length = parseInt(lengthMatch[1]);

  // Building type
  if (lower.includes('office') || lower.includes('commercial') || lower.includes('business')) {
    result.buildingType = 'commercial';
  } else if (lower.includes('house') || lower.includes('home') || lower.includes('residential') || lower.includes('villa')) {
    result.buildingType = 'residential';
  } else if (lower.includes('apartment') || lower.includes('flat')) {
    result.buildingType = 'apartment';
  }

  // Features
  if (lower.includes('balcony') || lower.includes('balconies')) result.features.push('balcony');
  if (lower.includes('parking') || lower.includes('garage')) result.features.push('parking');
  if (lower.includes('garden') || lower.includes('yard') || lower.includes('lawn')) result.features.push('garden');
  if (lower.includes('rooftop') || lower.includes('roof garden')) result.features.push('rooftop');
  if (lower.includes('pool') || lower.includes('swimming')) result.features.push('pool');
  if (lower.includes('stair') || lower.includes('stairs')) result.features.push('stairs');
  if (lower.includes('large window') || lower.includes('big window')) result.features.push('largeWindows');

  return result;
}

export function generateFromPrompt(prompt: string): BuildingConfig {
  const parsed = parsePrompt(prompt);

  const config: BuildingConfig = {
    buildingType: parsed.buildingType || 'residential',
    floors: parsed.floors || 2,
    dimensions: {
      width: parsed.width || 12,
      length: parsed.length || 16,
      floorHeight: parsed.buildingType === 'commercial' ? 3.5 : 3.2,
    },
    rooms: {
      bedrooms: parsed.bedrooms || 3,
      bathrooms: parsed.bathrooms || 2,
      kitchen: 1,
      livingRoom: 1,
    },
    features: {
      balcony: parsed.features.includes('balcony'),
      parking: parsed.features.includes('parking'),
      garden: parsed.features.includes('garden'),
      rooftop: parsed.features.includes('rooftop'),
      stairs: true,
    },
    style: {
      wallColor: parsed.buildingType === 'commercial' ? '#c0c8d0' : '#e8e0d4',
      roofType: parsed.features.includes('rooftop') ? 'flat' : 'gable',
      windowStyle: parsed.features.includes('largeWindows') ? 'large' : 'modern',
      doorStyle: 'modern',
    },
    windows: {
      perFloor: Math.max(4, (parsed.bedrooms || 3) + 2),
      size: parsed.features.includes('largeWindows') ? 'large' : 'medium',
    },
    doors: {
      main: 1,
      interior: (parsed.bedrooms || 3) + 1,
    },
  };

  return config;
}

export function validateConfig(config: BuildingConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.floors < 1 || config.floors > 20) {
    errors.push('Number of floors must be between 1 and 20');
  }
  if (config.dimensions.width < 4 || config.dimensions.width > 100) {
    errors.push('Building width must be between 4 and 100 meters');
  }
  if (config.dimensions.length < 4 || config.dimensions.length > 100) {
    errors.push('Building length must be between 4 and 100 meters');
  }
  if (config.dimensions.floorHeight < 2.5 || config.dimensions.floorHeight > 6) {
    errors.push('Floor height must be between 2.5 and 6 meters');
  }
  if (config.rooms.bedrooms < 0 || config.rooms.bedrooms > 50) {
    errors.push('Number of bedrooms must be between 0 and 50');
  }
  if (config.rooms.bathrooms < 0 || config.rooms.bathrooms > 50) {
    errors.push('Number of bathrooms must be between 0 and 50');
  }
  if (config.windows.perFloor < 0 || config.windows.perFloor > 20) {
    errors.push('Windows per floor must be between 0 and 20');
  }

  return { valid: errors.length === 0, errors };
}

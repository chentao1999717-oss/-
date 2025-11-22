
export interface AnimationSettings {
  prompt: string;
  frameCount: number;
  fps: number;
  // Scale removed to enforce original consistency
}

export interface GeneratedFrame {
  id: string;
  dataUrl: string; // Base64 image data
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface PresetImage {
  id: string;
  url: string;
  label: string;
}

export const PRESET_IMAGES: PresetImage[] = [
  { id: '1', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', label: '皮卡丘' },
  { id: '2', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png', label: '皮丘' },
  { id: '3', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png', label: '雷丘' },
];

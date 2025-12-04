import { GameAssets, BackgroundSetting } from './types';

export const BUG_IMAGES = [
  'https://api.iconify.design/noto:lady-beetle.svg',
  'https://api.iconify.design/noto:honeybee.svg',
  'https://api.iconify.design/noto:butterfly.svg',
  'https://api.iconify.design/noto:ant.svg',
  'https://api.iconify.design/noto:spider.svg',
  'https://api.iconify.design/noto:beetle.svg',
  'https://api.iconify.design/noto:cricket.svg',
  'https://api.iconify.design/noto:cockroach.svg',
  'https://api.iconify.design/noto:snail.svg',
  'https://api.iconify.design/noto:mosquito.svg',
  'https://api.iconify.design/noto:worm.svg',
  'https://api.iconify.design/noto:fly.svg',
  'https://api.iconify.design/noto:scorpion.svg',
  'https://api.iconify.design/noto:microbe.svg'
];

export const FRUIT_IMAGES = [
  'https://api.iconify.design/noto:red-apple.svg',
  'https://api.iconify.design/noto:banana.svg',
  'https://api.iconify.design/noto:grapes.svg',
  'https://api.iconify.design/noto:watermelon.svg',
  'https://api.iconify.design/noto:strawberry.svg',
  'https://api.iconify.design/noto:cherries.svg',
  'https://api.iconify.design/noto:peach.svg',
  'https://api.iconify.design/noto:tangerine.svg',
  'https://api.iconify.design/noto:pineapple.svg',
  'https://api.iconify.design/noto:kiwi-fruit.svg',
  'https://api.iconify.design/noto:pear.svg',
  'https://api.iconify.design/noto:blueberries.svg',
  'https://api.iconify.design/noto:green-apple.svg',
  'https://api.iconify.design/noto:mango.svg',
  'https://api.iconify.design/noto:melon.svg',
  'https://api.iconify.design/noto:lemon.svg',
  'https://api.iconify.design/noto:coconut.svg',
  'https://api.iconify.design/noto:avocado.svg',
  'https://api.iconify.design/noto:olive.svg'
];

export const FRUIT_COLORS: Record<string, string> = {
  'red-apple': '#EF4444',
  'banana': '#FCD34D',
  'grapes': '#8B5CF6',
  'watermelon': '#EF4444',
  'strawberry': '#F43F5E',
  'cherries': '#991B1B',
  'peach': '#FDBA74',
  'tangerine': '#F97316',
  'pineapple': '#FDE047',
  'kiwi-fruit': '#84CC16',
  'pear': '#BEF264',
  'blueberries': '#3B82F6',
  'noto:red-apple': '#EF4444',
  'noto:banana': '#FCD34D',
  'noto:grapes': '#8B5CF6',
  'noto:watermelon': '#EF4444',
  'noto:strawberry': '#F43F5E',
  'noto:cherries': '#991B1B',
  'noto:peach': '#FDBA74',
  'noto:tangerine': '#F97316',
  'noto:pineapple': '#FDE047',
  'noto:kiwi-fruit': '#84CC16',
  'noto:pear': '#BEF264',
  'noto:blueberries': '#3B82F6',
  'green-apple': '#22C55E',
  'mango': '#FBBF24',
  'melon': '#F97316',
  'lemon': '#FDE047',
  'coconut': '#A16207',
  'avocado': '#4D7C0F',
  'olive': '#6B8E23',
  'noto:green-apple': '#22C55E',
  'noto:mango': '#FBBF24',
  'noto:melon': '#F97316',
  'noto:lemon': '#FACC15',
  'noto:coconut': '#A16207',
  'noto:avocado': '#4D7C0F',
  'noto:olive': '#6B8E23'
};

export const BACKGROUND_PRESETS: BackgroundSetting[] = [
  // Solid Colors (Low saturation, bird friendly)
  { type: 'color', value: '#e7e5e4', name: 'Warm Paper' }, // Stone 200
  { type: 'color', value: '#dbeafe', name: 'Soft Sky' },   // Blue 100
  { type: 'color', value: '#f0fdf4', name: 'Mint' },       // Green 50
  { type: 'color', value: '#fae8ff', name: 'Lavender' },   // Fuchsia 100
  { type: 'color', value: '#fff7ed', name: 'Pale Orange' },// Orange 50
  { type: 'color', value: '#f1f5f9', name: 'Cool Grey' },  // Slate 100
  { type: 'color', value: '#404040', name: 'Dark Grey' },  // Neutral 700 (High contrast)
  { type: 'color', value: '#1e293b', name: 'Midnight' },   // Slate 800
  { type: 'color', value: '#3f6212', name: 'Moss Green' }, // Natural Green
  { type: 'color', value: '#78350f', name: 'Bark Brown' }, // Natural Brown

  // Images (Nature & Texture)
  { type: 'image', value: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2560&auto=format&fit=crop', name: 'Forest Floor' },
  { type: 'image', value: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2560&auto=format&fit=crop', name: 'Grass Field' },
  { type: 'image', value: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2560&auto=format&fit=crop', name: 'Water Surface' },
  { type: 'image', value: 'https://images.unsplash.com/photo-1618520261314-1b12b50d5362?q=80&w=2560&auto=format&fit=crop', name: 'Wood Texture' },
  { type: 'image', value: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2560&auto=format&fit=crop', name: 'Deep Forest' },
  { type: 'image', value: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2560&auto=format&fit=crop', name: 'Pebbles' },
];

export const DEFAULT_ASSETS: GameAssets = {
  bugImages: BUG_IMAGES,
  fruitImages: FRUIT_IMAGES,
  background: BACKGROUND_PRESETS[0],
};

export const SOUND_SAMPLES = {
  PECK: 'PECK',
  SUCCESS: 'SUCCESS',
  AMBIENCE: 'AMBIENCE'
};
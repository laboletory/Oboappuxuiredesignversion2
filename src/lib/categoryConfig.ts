import { CategoryType, CategoryGroup } from '../types';

export interface CategoryConfig {
  name: string;
  color: string;
  lightColor: string;
  icon: string;
  description: string;
  group: CategoryGroup;
}

export const categoryConfig: Record<CategoryType, CategoryConfig> = {
  // Infrastructure
  water: {
    name: 'Вода',
    color: '#0284c7', // sky-600
    lightColor: '#e0f2fe', // sky-100
    icon: 'Droplets',
    description: 'Спиране на водоснабдяването и ремонти',
    group: 'infrastructure'
  },
  electricity: {
    name: 'Електричество',
    color: '#eab308', // yellow-500
    lightColor: '#fef9c3', // yellow-100
    icon: 'Zap',
    description: 'Прекъсвания на тока и електрически работи',
    group: 'infrastructure'
  },
  heating: {
    name: 'Отопление',
    color: '#dc2626', // red-600
    lightColor: '#fee2e2', // red-100
    icon: 'Flame',
    description: 'Проблеми с отоплението и газоснабдяването',
    group: 'infrastructure'
  },
  waste: {
    name: 'Отпадъци',
    color: '#16a34a', // green-600
    lightColor: '#dcfce7', // green-100
    icon: 'Trash2',
    description: 'Промени в графика за смет и рециклиране',
    group: 'infrastructure'
  },
  
  // Mobility
  traffic: {
    name: 'Трафик',
    color: '#dc2626', // red-600
    lightColor: '#fee2e2', // red-100
    icon: 'CarFront',
    description: 'Задръствания и проблеми в движението',
    group: 'mobility'
  },
  'road-block': {
    name: 'Затваряния',
    color: '#ea580c', // orange-600
    lightColor: '#ffedd5', // orange-100
    icon: 'CircleSlash',
    description: 'Затворени улици и обходи',
    group: 'mobility'
  },
  'public-transport': {
    name: 'Обществен транспорт',
    color: '#7c3aed', // violet-600
    lightColor: '#ede9fe', // violet-100
    icon: 'Bus',
    description: 'Промени в маршрути и разписания',
    group: 'mobility'
  },
  parking: {
    name: 'Паркиране',
    color: '#0891b2', // cyan-600
    lightColor: '#cffafe', // cyan-100
    icon: 'ParkingCircle',
    description: 'Паркинг зони и ограничения',
    group: 'mobility'
  },
  vehicles: {
    name: 'Автомобили',
    color: '#4f46e5', // indigo-600
    lightColor: '#e0e7ff', // indigo-100
    icon: 'Car',
    description: 'Регистрация и технически прегледи',
    group: 'mobility'
  },
  bicycles: {
    name: 'Велосипеди',
    color: '#059669', // emerald-600
    lightColor: '#d1fae5', // emerald-100
    icon: 'Bike',
    description: 'Велоалеи и споделени велосипеди',
    group: 'mobility'
  },
  
  // Environment
  weather: {
    name: 'Метео',
    color: '#0284c7', // sky-600
    lightColor: '#e0f2fe', // sky-100
    icon: 'CloudRain',
    description: 'Предупреждения за лошо време',
    group: 'environment'
  },
  'air-quality': {
    name: 'Качество на въздуха',
    color: '#65a30d', // lime-600
    lightColor: '#ecfccb', // lime-100
    icon: 'Wind',
    description: 'Замърсяване и качество на въздуха',
    group: 'environment'
  },
  
  // Society
  health: {
    name: 'Здраве',
    color: '#dc2626', // red-600
    lightColor: '#fee2e2', // red-100
    icon: 'Heart',
    description: 'Медицински услуги и здравни кампании',
    group: 'society'
  },
  culture: {
    name: 'Култура',
    color: '#c026d3', // fuchsia-600
    lightColor: '#fae8ff', // fuchsia-100
    icon: 'Theater',
    description: 'Културни събития и изложби',
    group: 'society'
  },
  art: {
    name: 'Изкуство',
    color: '#db2777', // pink-600
    lightColor: '#fce7f3', // pink-100
    icon: 'Palette',
    description: 'Художествени изложби и инсталации',
    group: 'society'
  },
  sports: {
    name: 'Спорт',
    color: '#16a34a', // green-600
    lightColor: '#dcfce7', // green-100
    icon: 'Trophy',
    description: 'Спортни събития и съоръжения',
    group: 'society'
  },
  
  // Maintenance
  'construction-and-repairs': {
    name: 'Ремонти',
    color: '#ea580c', // orange-600
    lightColor: '#ffedd5', // orange-100
    icon: 'Construction',
    description: 'Строителни работи и инфраструктурни проекти',
    group: 'maintenance'
  },
  maintenance: {
    name: 'Поддръжка',
    color: '#059669', // emerald-600
    lightColor: '#d1fae5', // emerald-100
    icon: 'Wrench',
    description: 'Планирана поддръжка и ремонти',
    group: 'maintenance'
  },
  
  // Other
  uncategorized: {
    name: 'Некатегоризирани',
    color: '#6b7280', // gray-500
    lightColor: '#f3f4f6', // gray-100
    icon: 'CircleHelp',
    description: 'Събития без категория',
    group: 'maintenance'
  }
};

export const categoryGroups: Record<CategoryGroup, { name: string; categories: CategoryType[] }> = {
  infrastructure: {
    name: 'Инфраструктура',
    categories: ['water', 'electricity', 'heating', 'waste']
  },
  mobility: {
    name: 'Мобилност',
    categories: ['traffic', 'road-block', 'public-transport', 'parking', 'vehicles', 'bicycles']
  },
  environment: {
    name: 'Околна среда',
    categories: ['weather', 'air-quality']
  },
  society: {
    name: 'Общество',
    categories: ['health', 'culture', 'art', 'sports']
  },
  maintenance: {
    name: 'Ремонти и поддръжка',
    categories: ['construction-and-repairs', 'maintenance', 'uncategorized']
  }
};

// Zone color palette
const zoneColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4'  // cyan
];

export function getZoneColor(index: number): string {
  return zoneColors[index % zoneColors.length];
}
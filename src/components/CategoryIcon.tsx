import { 
  Droplets, Zap, Flame, Bus, Construction, Wrench, 
  Trash2, CarFront, CircleSlash, ParkingCircle, Car, Bike,
  CloudRain, Wind, Heart, Theater, Palette, Trophy, CircleHelp,
  LucideIcon 
} from 'lucide-react';
import { CategoryType } from '../types';
import { categoryConfig } from '../lib/categoryConfig';

const iconMap: Record<CategoryType, LucideIcon> = {
  // Infrastructure
  water: Droplets,
  electricity: Zap,
  heating: Flame,
  waste: Trash2,
  // Mobility
  traffic: CarFront,
  'road-block': CircleSlash,
  'public-transport': Bus,
  parking: ParkingCircle,
  vehicles: Car,
  bicycles: Bike,
  // Environment
  weather: CloudRain,
  'air-quality': Wind,
  // Society
  health: Heart,
  culture: Theater,
  art: Palette,
  sports: Trophy,
  // Maintenance
  'construction-and-repairs': Construction,
  maintenance: Wrench,
  // Other
  uncategorized: CircleHelp
};

interface CategoryIconProps {
  category: CategoryType;
  size?: number;
  className?: string;
}

export function CategoryIcon({ category, size = 20, className = '' }: CategoryIconProps) {
  const Icon = iconMap[category];
  const config = categoryConfig[category];
  
  // If className includes 'p-0', don't add default padding
  const shouldAddPadding = !className.includes('p-0');
  
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg ${shouldAddPadding ? 'p-2' : ''} ${className.replace('p-0', '')}`}
      style={{ backgroundColor: className.includes('bg-transparent') ? 'transparent' : config.lightColor }}
    >
      <Icon size={size} style={{ color: config.color }} strokeWidth={2} />
    </div>
  );
}
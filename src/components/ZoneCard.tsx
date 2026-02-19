import { Zone, CategoryType } from '../types';
import { MapPin, Bell, BellOff, MoreVertical, Pencil, Trash2, 
  Droplets, Zap, Flame, Bus, Construction, Wrench,
  Trash2 as TrashIcon, CarFront, CircleSlash, ParkingCircle, Car, Bike,
  CloudRain, Wind, Heart, Theater, Palette, Trophy, Globe
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { categoryConfig } from '../lib/categoryConfig';

// Icon mapping for categories
const categoryIcons = {
  Droplets,
  Zap,
  Flame,
  Bus,
  Construction,
  Wrench,
  Trash2: TrashIcon,
  CarFront,
  CircleSlash,
  ParkingCircle,
  Car,
  Bike,
  CloudRain,
  Wind,
  Heart,
  Theater,
  Palette,
  Trophy
};

interface ZoneCardProps {
  zone: Zone;
  globalCategories: CategoryType[];
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePause?: () => void;
  onClick?: () => void;
}

export function ZoneCard({ zone, globalCategories, onEdit, onDelete, onTogglePause, onClick }: ZoneCardProps) {
  // Get effective categories for this zone
  const effectiveCategories = zone.useGlobalCategories 
    ? globalCategories 
    : (zone.customCategories || []);
  
  return (
    <div 
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: zone.color + '20' }}
        >
          <MapPin size={20} style={{ color: zone.color }} strokeWidth={2} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-medium text-foreground">{zone.label}</h3>
              <p className="text-xs text-muted-foreground">Радиус: {zone.radius}м</p>
            </div>
            
            <div className="flex items-center gap-1">
              {zone.isPaused && (
                <Badge variant="secondary" className="shrink-0">
                  <BellOff size={12} className="mr-1" />
                  На пауза
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}>
                    <Pencil size={14} className="mr-2" />
                    Редктирай зона
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onTogglePause?.();
                  }}>
                    {zone.isPaused ? (
                      <>
                        <Bell size={14} className="mr-2" />
                        Възобнови известията
                      </>
                    ) : (
                      <>
                        <BellOff size={14} className="mr-2" />
                        Спри известията
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Изтрий зона
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              {zone.useGlobalCategories && (
                <div className="flex items-center gap-1 mr-1" title="Използва глобални категории">
                  <Globe size={12} className="text-primary" />
                </div>
              )}
              {effectiveCategories.slice(0, 4).map((category) => {
                const config = categoryConfig[category];
                const IconComponent = categoryIcons[config.icon as keyof typeof categoryIcons];
                return (
                  <div
                    key={category}
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: config.lightColor }}
                    title={config.name}
                  >
                    {IconComponent && <IconComponent size={12} style={{ color: config.color }} />}
                  </div>
                );
              })}
              {effectiveCategories.length > 4 && (
                <span className="text-xs ml-0.5">+{effectiveCategories.length - 4}</span>
              )}
            </div>
          </div>
          
          {zone.activeEventsCount > 0 && !zone.isPaused && (
            <Badge variant="default" className="mt-2">
              {zone.activeEventsCount} активни {zone.activeEventsCount === 1 ? 'събитие' : 'събития'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
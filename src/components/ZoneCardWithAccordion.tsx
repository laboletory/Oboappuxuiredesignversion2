import { useState } from 'react';
import { Zone, CategoryType, Event } from '../types';
import { MapPin, Bell, BellOff, MoreVertical, Pencil, Trash2, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { CategoryIcon } from './CategoryIcon';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
import { categoryConfig } from '../lib/categoryConfig';

interface ZoneCardWithAccordionProps {
  zone: Zone;
  events: Event[];
  globalCategories: CategoryType[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePause?: () => void;
  onClick?: () => void;
  onEventClick?: (event: Event) => void;
}

export function ZoneCardWithAccordion({ 
  zone, 
  events,
  globalCategories, 
  isExpanded,
  onToggleExpand,
  onEdit, 
  onDelete, 
  onTogglePause, 
  onClick,
  onEventClick
}: ZoneCardWithAccordionProps) {
  // Get effective categories for this zone
  const effectiveCategories = zone.useGlobalCategories 
    ? globalCategories 
    : (zone.customCategories || []);

  // Filter events that affect this zone
  const zoneEvents = events.filter(e => e.affectedZones.includes(zone.id));
  const recentZoneEvents = zoneEvents.slice(0, 3); // Show max 3 events

  const handleCardClick = () => {
    onClick?.();
    onToggleExpand();
  };
  
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Zone Card */}
      <div 
        className="p-4 hover:border-primary/30 transition-colors cursor-pointer group"
        onClick={handleCardClick}
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
              <div className="flex-1">
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
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}  >
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
                      Редактирай
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

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
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
                  return (
                    <div
                      key={category}
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: config.lightColor }}
                      title={config.name}
                    >
                      <CategoryIcon category={category} size={12} />
                    </div>
                  );
                })}
                {effectiveCategories.length > 4 && (
                  <span className="text-xs ml-0.5">+{effectiveCategories.length - 4}</span>
                )}
              </div>
            </div>
            
            {zoneEvents.length > 0 && !zone.isPaused && (
              <Badge variant="default" className="mt-2">
                {zoneEvents.length} активни {zoneEvents.length === 1 ? 'събитие' : 'събития'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Accordion - Events List */}
      {isExpanded && zoneEvents.length > 0 && (
        <div className="border-t border-border bg-muted/20">
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Събития в зоната:
            </p>
            {recentZoneEvents.map((event) => (
              <button
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
                className="w-full text-left p-3 bg-card rounded-lg hover:bg-accent/50 transition-colors border border-border/50"
              >
                <div className="flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">
                    <CategoryIcon category={event.category} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-1 mb-0.5">
                      {event.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(event.startTime, { 
                        addSuffix: true,
                        locale: bg 
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {zoneEvents.length > 3 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{zoneEvents.length - 3} още {zoneEvents.length - 3 === 1 ? 'събитие' : 'събития'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty state when expanded but no events */}
      {isExpanded && zoneEvents.length === 0 && (
        <div className="border-t border-border bg-muted/20 p-6 text-center">
          <Bell size={32} className="mx-auto mb-2 text-muted-foreground opacity-20" />
          <p className="text-sm text-muted-foreground">
            Няма активни събития в тази зона
          </p>
        </div>
      )}
    </div>
  );
}
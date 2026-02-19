import { useState, useRef, useEffect } from 'react';
import { Event, Zone } from '../types';
import { categoryConfig } from '../lib/categoryConfig';
import { CategoryIcon } from './CategoryIcon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Building2, AlertTriangle, ExternalLink, X } from 'lucide-react';
import { format, formatDistanceToNow, isFuture, isPast, isToday, isTomorrow } from 'date-fns';

interface MobileEventDetailProps {
  event: Event;
  zones: Zone[];
  onClose: () => void;
}

export function MobileEventDetail({ event, zones, onClose }: MobileEventDetailProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  const config = categoryConfig[event.category];
  const affectedZones = zones.filter(z => event.affectedZones.includes(z.id));

  const getDateRangeDisplay = () => {
    const start = event.startTime;
    const end = event.endTime;

    if (isFuture(start)) {
      if (isToday(start)) {
        return `Днес в ${format(start, 'h:mm a')}`;
      }
      if (isTomorrow(start)) {
        return `Утре в ${format(start, 'h:mm a')}`;
      }
      return format(start, 'EEEE, MMMM d \'в\' h:mm a');
    }

    if (end) {
      if (isPast(end)) {
        return `Приключи на ${format(end, 'MMMM d \'в\' h:mm a')}`;
      }
      return `До ${format(end, 'MMMM d \'в\' h:mm a')}`;
    }

    return `Започна ${format(start, 'MMMM d \'в\' h:mm a')}`;
  };

  const getSeverityInfo = () => {
    const severityMap = {
      low: { 
        label: 'Ниско въздействие', 
        description: 'Леко неудобство, планирайте съответно',
        variant: 'secondary' as const,
        color: '#059669'
      },
      medium: { 
        label: 'Средно въздействие', 
        description: 'Очаквайте умерено смущение',
        variant: 'default' as const,
        color: '#eab308'
      },
      high: { 
        label: 'Високо въздействие', 
        description: 'Значително смущение, планирайте алтернативи',
        variant: 'destructive' as const,
        color: '#dc2626'
      },
      critical: { 
        label: 'Критично', 
        description: 'Сериозно смущение, може да са необходими спешни действия',
        variant: 'destructive' as const,
        color: '#991b1b'
      }
    };
    
    return severityMap[event.severity];
  };

  const severity = getSeverityInfo();

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    
    // Only allow dragging down
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If dragged more than 100px, close the panel
    if (dragY > 100) {
      onClose();
    }
    
    // Reset drag position
    setDragY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    currentY.current = e.clientY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    currentY.current = e.clientY;
    const delta = currentY.current - startY.current;
    
    // Only allow dragging down
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // If dragged more than 100px, close the panel
    if (dragY > 100) {
      onClose();
    }
    
    // Reset drag position
    setDragY(0);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragY]);

  return (
    <div
      className="bg-card border-t border-border rounded-t-2xl shadow-2xl"
      style={{
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <CategoryIcon category={event.category} size={24} />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={severity.variant}
                className="text-xs"
              >
                {severity.label}
              </Badge>
              <Badge variant="outline" style={{ borderColor: config.color, color: config.color }}>
                {config.name}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 mb-3">
          <Clock size={18} className="text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium mb-1">Времева рамка</div>
            <div className="text-xs text-muted-foreground">{getDateRangeDisplay()}</div>
            {event.endTime && !isPast(event.endTime) && (
              <div className="text-xs text-muted-foreground mt-1">
                Продължителност: {formatDistanceToNow(event.endTime)}
              </div>
            )}
          </div>
        </div>

        {/* Affected Zones */}
        {affectedZones.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 mb-3">
            <MapPin size={18} className="text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-2">Засегнати зони</div>
              <div className="space-y-2">
                {affectedZones.map(zone => (
                  <div key={zone.id} className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="text-xs font-medium">{zone.name}</span>
                    {event.distanceFromZone && (
                      <span className="text-xs text-muted-foreground">
                        • {event.distanceFromZone}м от центъра
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Source */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 mb-3">
          <Building2 size={18} className="text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium mb-1">Източник</div>
            <div className="text-xs text-muted-foreground">{event.source}</div>
          </div>
        </div>

        {/* Impact level info */}
        {event.severity !== 'low' && (
          <div 
            className="flex items-start gap-3 p-3 rounded-lg border-2 mb-4"
            style={{ 
              borderColor: severity.color + '40',
              backgroundColor: severity.color + '10'
            }}
          >
            <AlertTriangle size={18} style={{ color: severity.color }} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-1" style={{ color: severity.color }}>
                {severity.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {severity.description}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            ID: {event.id}
          </div>
          <Button size="sm">
            <ExternalLink size={14} className="mr-2" />
            Виж на картата
          </Button>
        </div>
      </div>
    </div>
  );
}
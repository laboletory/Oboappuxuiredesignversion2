import { Event, Zone } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { categoryConfig } from '../lib/categoryConfig';
import { Badge } from './ui/badge';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow, isFuture, isPast } from 'date-fns';

interface EventCardProps {
  event: Event;
  zones: Zone[];
  onClick?: () => void;
  onHover?: (eventId: string | null) => void;
}

export function EventCard({ event, zones, onClick, onHover }: EventCardProps) {
  const config = categoryConfig[event.category];
  const affectedZone = zones.find(z => event.affectedZones.includes(z.id));
  
  const getTimeDisplay = () => {
    if (isFuture(event.startTime)) {
      return `Започва ${formatDistanceToNow(event.startTime, { addSuffix: true })}`;
    }
    if (event.endTime && isPast(event.endTime)) {
      return `Приключи на ${format(event.endTime, 'MMM d, h:mm a')}`;
    }
    if (event.endTime) {
      return `До ${format(event.endTime, 'MMM d, h:mm a')}`;
    }
    return `Започна на ${format(event.startTime, 'MMM d, h:mm a')}`;
  };

  const getSeverityBadge = () => {
    const severityMap = {
      low: { label: 'Ниско', variant: 'secondary' as const },
      medium: { label: 'Средно', variant: 'default' as const },
      high: { label: 'Високо', variant: 'destructive' as const },
      critical: { label: 'Критично', variant: 'destructive' as const }
    };
    
    return severityMap[event.severity];
  };

  const severity = getSeverityBadge();

  return (
    <div 
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => onHover?.(event.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex items-start gap-3">
        <CategoryIcon category={event.category} size={20} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground line-clamp-2">{event.title}</h3>
            {event.severity !== 'low' && (
              <Badge variant={severity.variant} className="shrink-0">
                {severity.label}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {event.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {affectedZone && (
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: affectedZone.color }}
                />
                <span className="font-medium">{affectedZone.name}</span>
                {event.distanceFromZone && (
                  <span>• {event.distanceFromZone}m away</span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{getTimeDisplay()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
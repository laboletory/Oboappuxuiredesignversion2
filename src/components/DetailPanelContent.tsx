import { Event, Zone } from '../types';
import { categoryConfig } from '../lib/categoryConfig';
import { CategoryIcon } from './CategoryIcon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Building2, AlertTriangle, ExternalLink } from 'lucide-react';
import { format, formatDistanceToNow, isFuture, isPast, isToday, isTomorrow } from 'date-fns';

interface DetailPanelContentProps {
  event: Event;
  zones: Zone[];
}

export function DetailPanelContent({ event, zones }: DetailPanelContentProps) {
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

  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-3">
        <CategoryIcon category={event.category} size={24} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight mb-2">{event.title}</h3>
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
      </div>

      {/* Description */}
      <div>
        <p className="text-sm text-foreground leading-relaxed">{event.description}</p>
      </div>

      {/* Time */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
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
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
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
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
        <Building2 size={18} className="text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium mb-1">Източник</div>
          <div className="text-xs text-muted-foreground">{event.source}</div>
        </div>
      </div>

      {/* Impact level info */}
      {event.severity !== 'low' && (
        <div 
          className="flex items-start gap-3 p-3 rounded-lg border-2"
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
      <div className="pt-3 border-t space-y-3">
        <div className="text-xs text-muted-foreground">
          ID: {event.id}
        </div>
        <Button className="w-full" size="sm">
          <ExternalLink size={14} className="mr-2" />
          Виж на картата
        </Button>
      </div>
    </>
  );
}

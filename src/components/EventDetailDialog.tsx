import { Event, Zone } from '../types';
import { categoryConfig } from '../lib/categoryConfig';
import { CategoryIcon } from './CategoryIcon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Building2, AlertTriangle, ExternalLink } from 'lucide-react';
import { format, formatDistanceToNow, isFuture, isPast, isToday, isTomorrow } from 'date-fns';
import { VisuallyHidden } from './ui/visually-hidden';

interface EventDetailDialogProps {
  event: Event;
  zones: Zone[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({ event, zones, open, onOpenChange }: EventDetailDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <VisuallyHidden>
          <DialogDescription>
            Подробна информация за събитие {event.title}
          </DialogDescription>
        </VisuallyHidden>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <CategoryIcon category={event.category} size={24} />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl mb-2">{event.title}</DialogTitle>
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
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <p className="text-foreground leading-relaxed">{event.description}</p>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <Clock size={20} className="text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium mb-1">Времева рамка</div>
              <div className="text-sm text-muted-foreground">{getDateRangeDisplay()}</div>
              {event.endTime && !isPast(event.endTime) && (
                <div className="text-xs text-muted-foreground mt-1">
                  Продължителност: {formatDistanceToNow(event.endTime)}
                </div>
              )}
            </div>
          </div>

          {/* Affected Zones */}
          {affectedZones.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <MapPin size={20} className="text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium mb-2">Засегнати зони</div>
                <div className="space-y-2">
                  {affectedZones.map(zone => (
                    <div key={zone.id} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="font-medium text-sm">{zone.name}</span>
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
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <Building2 size={20} className="text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium mb-1">Източник</div>
              <div className="text-sm text-muted-foreground">{event.source}</div>
            </div>
          </div>

          {/* Impact level info */}
          {event.severity !== 'low' && (
            <div 
              className="flex items-start gap-3 p-4 rounded-lg border-2"
              style={{ 
                borderColor: severity.color + '40',
                backgroundColor: severity.color + '10'
              }}
            >
              <AlertTriangle size={20} style={{ color: severity.color }} className="mt-0.5" />
              <div>
                <div className="font-medium mb-1" style={{ color: severity.color }}>
                  {severity.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {severity.description}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            ID на събитие: {event.id}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Затвори
            </Button>
            <Button>
              <ExternalLink size={16} className="mr-2" />
              Виж на картата
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
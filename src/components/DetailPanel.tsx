import { Event, Zone } from '../types';
import { categoryConfig } from '../lib/categoryConfig';
import { CategoryIcon } from './CategoryIcon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, MapPin, Calendar, Clock, Building2 } from 'lucide-react';
import { format, isFuture, isPast } from 'date-fns';

interface DetailPanelProps {
  event: Event | null;
  zones: Zone[];
  open: boolean;
  onClose: () => void;
}

export function DetailPanel({ event, zones, open, onClose }: DetailPanelProps) {
  if (!open || !event) return null;

  const config = categoryConfig[event.category];
  const affectedZones = zones.filter(z => event.affectedZones.includes(z.id));

  const getStatusColor = () => {
    if (isFuture(event.startTime)) return '#3b82f6'; // blue - upcoming
    if (event.endTime && isPast(event.endTime)) return '#6b7280'; // gray - ended
    return '#f59e0b'; // amber - active
  };

  const getStatusLabel = () => {
    if (isFuture(event.startTime)) return 'Предстоящо';
    if (event.endTime && isPast(event.endTime)) return 'Приключило';
    return 'Активно';
  };

  return (
    <div 
      className="fixed top-0 right-0 h-full w-96 bg-card border-l border-border shadow-xl z-40 flex flex-col overflow-hidden"
      style={{ 
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div 
            className="w-3 h-3 rounded-full shrink-0 mt-1.5"
            style={{ backgroundColor: getStatusColor() }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base mb-1">Детайли за сигнала</h2>
            <span className="text-xs text-muted-foreground">{getStatusLabel()}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Event Title */}
        <div className="p-4 border-b border-border">
          <div className="flex items-start gap-3 mb-3">
            <CategoryIcon category={event.category} size={24} />
            <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
          </div>

          {/* Category Badge */}
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ 
              borderColor: config.color, 
              color: config.color,
              backgroundColor: config.lightColor
            }}
          >
            {config.name}
          </Badge>
        </div>

        {/* Metadata Section */}
        <div className="p-4 space-y-3 border-b border-border bg-muted/20">
          <div className="flex items-start gap-3 text-sm">
            <Calendar size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Публикувано</div>
              <div className="font-medium">
                {format(event.startTime, "d MMM yyyy, HH:mm")}ч
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Building2 size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Източник</div>
              <div className="font-medium">{event.source}</div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Описание
          </h4>
          <p className="text-sm leading-relaxed text-foreground">
            {event.description}
          </p>
        </div>

        {/* Time Period Section */}
        {event.endTime && (
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Период
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">От:</span>
                <span className="font-medium">
                  {format(event.startTime, "d.MM.yyyy, HH:mm")}ч
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">До:</span>
                <span className="font-medium">
                  {format(event.endTime, "d.MM.yyyy, HH:mm")}ч
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Affected Zones Section */}
        {affectedZones.length > 0 && (
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Локации
            </h4>
            <div className="space-y-3">
              {affectedZones.map(zone => (
                <div 
                  key={zone.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <MapPin size={16} className="text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="font-medium text-sm">{zone.name}</span>
                    </div>
                    {event.distanceFromZone && (
                      <div className="text-xs text-muted-foreground">
                        {event.distanceFromZone}м от центъра на зоната
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Street Segments Section (Mock data for demonstration) */}
        <div className="p-4">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Засегнати улици
          </h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="font-medium text-sm mb-2">ул. Централна</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>От / До:</span>
                  <span className="font-medium text-foreground">бул. Витоша - ул. Алабин</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Период:</span>
                  <span className="font-medium text-foreground">
                    {format(event.startTime, 'd.MM')} - {event.endTime ? format(event.endTime, 'd.MM') : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="text-xs text-muted-foreground mb-2">
          ID: {event.id}
        </div>
        <Button className="w-full" variant="outline">
          <MapPin size={16} className="mr-2" />
          Покажи на картата
        </Button>
      </div>
    </div>
  );
}
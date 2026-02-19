import { Zone, Event } from '../types';
import { categoryConfig } from '../lib/categoryConfig';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface MapViewProps {
  zones: Zone[];
  events: Event[];
  selectedZone?: Zone | null;
  onEventClick?: (event: Event) => void;
  onEventHover?: (eventId: string | null) => void;
  highlightedEventId?: string | null;
  selectedEventId?: string | null;
}

// Krasno Selo, Sofia, Bulgaria coordinates (for reference)
const DEFAULT_CENTER = { lat: 42.6977, lng: 23.2561 };

export function MapView({ zones, events, selectedZone, onEventClick, onEventHover, highlightedEventId, selectedEventId }: MapViewProps) {
  // Create positions for zones - distribute them in the viewport
  const zonePositions = useMemo(() => {
    return zones.map((zone, index) => {
      // Distribute zones in a grid pattern across the map
      const col = index % 3;
      const row = Math.floor(index / 3);
      return {
        ...zone,
        position: {
          x: 20 + col * 30, // percentage
          y: 20 + row * 30, // percentage
        },
      };
    });
  }, [zones]);

  // Create positions for events - place them near their affected zones
  const eventPositions = useMemo(() => {
    return events.map((event, index) => {
      const affectedZone = zonePositions.find(z => event.affectedZones.includes(z.id));
      if (!affectedZone) {
        return {
          ...event,
          position: { x: 50, y: 50 },
        };
      }
      
      // Offset events slightly from their zone center
      const offsetX = ((index % 3) - 1) * 5;
      const offsetY = ((Math.floor(index / 3)) - 1) * 5;
      return {
        ...event,
        position: {
          x: affectedZone.position.x + offsetX,
          y: affectedZone.position.y + offsetY,
        },
      };
    });
  }, [events, zonePositions]);

  // Calculate pixel radius from meters (approximation for visualization)
  const getPixelRadius = (radiusInMeters: number) => {
    // Scale: 1000m = ~10% of viewport
    return (radiusInMeters / 1000) * 10;
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
      {/* Map background using iframe for OpenStreetMap - visually muted */}
      <div className="w-full h-full relative">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=23.2161%2C42.6777%2C23.2961%2C42.7177&layer=mapnik&marker=42.6977%2C23.2561"
          className="w-full h-full border-0"
          title="Map of Krasno Selo, Sofia"
        />
        {/* Overlay to mute the map colors */}
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        {/* Desaturate filter for minimal look */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: 'saturate(0.3) brightness(1.1) contrast(0.85)',
            WebkitBackdropFilter: 'saturate(0.3) brightness(1.1) contrast(0.85)',
          }}
        />
      </div>
      
      {/* Overlay with zones and events */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Render zone circles */}
          {zonePositions.map((zone) => {
            const radius = getPixelRadius(zone.radius);
            const isSelected = selectedZone?.id === zone.id;
            return (
              <g key={`circle-${zone.id}`}>
                {/* Glow effect for selected zone */}
                {isSelected && (
                  <circle
                    cx={zone.position.x}
                    cy={zone.position.y}
                    r={radius + 0.5}
                    fill="none"
                    stroke={zone.color}
                    strokeWidth={0.6}
                    strokeOpacity={0.3}
                    vectorEffect="non-scaling-stroke"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={zone.position.x}
                  cy={zone.position.y}
                  r={radius}
                  fill={zone.color}
                  fillOpacity={isSelected ? 0.35 : 0.2}
                  stroke={zone.color}
                  strokeWidth={isSelected ? 0.4 : 0.25}
                  strokeOpacity={isSelected ? 0.95 : 0.7}
                  vectorEffect="non-scaling-stroke"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' : 'none',
                  }}
                />
              </g>
            );
          })}

          {/* Render event geometries */}
          {events.map((event) => {
            if (!event.geometry) return null;
            
            const config = categoryConfig[event.category];
            const isHighlighted = highlightedEventId === event.id;
            const isSelected = selectedEventId === event.id;
            const isActive = isHighlighted || isSelected;
            const shouldDesaturate = selectedEventId && !isSelected && !isHighlighted;

            const baseOpacity = shouldDesaturate ? 0.15 : 0.4;
            const strokeOpacity = shouldDesaturate ? 0.2 : (isActive ? 0.9 : 0.6);
            const strokeWidth = isActive ? 0.6 : 0.35;

            if (event.geometry.type === 'polygon') {
              const points = event.geometry.coordinates
                .map(coord => `${coord[0]},${coord[1]}`)
                .join(' ');
              
              return (
                <g key={`geometry-${event.id}`}>
                  {/* Glow effect for active geometry */}
                  {isActive && (
                    <polygon
                      points={points}
                      fill={config.color}
                      fillOpacity={0.15}
                      stroke={config.color}
                      strokeWidth={1.2}
                      strokeOpacity={0.4}
                      vectorEffect="non-scaling-stroke"
                      style={{
                        filter: 'blur(2px)',
                      }}
                    />
                  )}
                  <polygon
                    points={points}
                    fill={config.color}
                    fillOpacity={isActive ? 0.5 : baseOpacity}
                    stroke={config.color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    vectorEffect="non-scaling-stroke"
                    style={{
                      transition: 'all 0.2s ease',
                      filter: shouldDesaturate ? 'saturate(0.3)' : 'none',
                    }}
                  />
                </g>
              );
            }

            if (event.geometry.type === 'linestring') {
              const pathData = event.geometry.coordinates
                .map((coord, i) => `${i === 0 ? 'M' : 'L'} ${coord[0]} ${coord[1]}`)
                .join(' ');

              return (
                <g key={`geometry-${event.id}`}>
                  {/* Glow effect for active geometry */}
                  {isActive && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke={config.color}
                      strokeWidth={1.5}
                      strokeOpacity={0.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      style={{
                        filter: 'blur(2px)',
                      }}
                    />
                  )}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={config.color}
                    strokeWidth={isActive ? 0.8 : 0.5}
                    strokeOpacity={strokeOpacity}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      transition: 'all 0.2s ease',
                      filter: shouldDesaturate ? 'saturate(0.3)' : 'none',
                    }}
                  />
                </g>
              );
            }

            return null;
          })}
        </svg>

        {/* Render markers with proper pointer events */}
        {zonePositions.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          return (
            <div
              key={`marker-${zone.id}`}
              className="absolute rounded-full border-2 border-white pointer-events-none transition-all duration-200"
              style={{
                backgroundColor: zone.color,
                left: `${zone.position.x}%`,
                top: `${zone.position.y}%`,
                transform: 'translate(-50%, -50%)',
                width: isSelected ? '14px' : '12px',
                height: isSelected ? '14px' : '12px',
                boxShadow: isSelected 
                  ? `0 0 0 3px ${zone.color}20, 0 4px 8px rgba(0,0,0,0.3)` 
                  : '0 2px 6px rgba(0,0,0,0.25)',
                zIndex: isSelected ? 20 : 10,
              }}
            />
          );
        })}

        {eventPositions.map((event) => {
          const config = categoryConfig[event.category];
          const isHighlighted = highlightedEventId === event.id;
          const isSelected = selectedEventId === event.id;
          const isActive = isHighlighted || isSelected;
          // When hovering, remove desaturation for the hovered event
          const shouldDesaturate = selectedEventId && !isSelected && !isHighlighted;
          
          return (
            <div
              key={`event-${event.id}`}
              className="absolute rounded-full border-[3px] border-white cursor-pointer transition-all duration-200 pointer-events-auto group"
              style={{
                backgroundColor: config.color,
                left: `${event.position.x}%`,
                top: `${event.position.y}%`,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.3 : 1})`,
                width: '18px',
                height: '18px',
                boxShadow: isActive 
                  ? `0 0 0 4px ${config.color}40, 0 4px 16px rgba(0,0,0,0.45)` 
                  : '0 3px 10px rgba(0,0,0,0.35)',
                zIndex: isActive ? 40 : 30,
                opacity: shouldDesaturate ? 0.3 : 1,
                filter: shouldDesaturate ? 'saturate(0.3)' : 'none',
              }}
              onClick={() => onEventClick?.(event)}
              onMouseEnter={() => onEventHover?.(event.id)}
              onMouseLeave={() => onEventHover?.(null)}
            >
              {/* Pulse ring on hover or when highlighted */}
              <div 
                className={`absolute inset-0 rounded-full transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                style={{
                  backgroundColor: config.color,
                  filter: 'blur(4px)',
                  transform: 'scale(1.5)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Zones info overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none z-10">
        {zones.map(zone => (
          <div
            key={zone.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur-sm border border-border text-sm shadow-sm"
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: zone.color }}
            />
            <span className="font-medium">{zone.name}</span>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {zones.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center p-8 bg-card/95 backdrop-blur-sm rounded-xl border border-border">
            <MapPin size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Добавете първата си зона, за да започнете</p>
          </div>
        </div>
      )}
    </div>
  );
}
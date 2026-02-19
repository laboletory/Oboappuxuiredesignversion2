import { useState } from 'react';
import { Zone, Event, CategoryType, Notification } from '../types';
import { MapView } from './MapView';
import { ZoneCard } from './ZoneCard';
import { EventCard } from './EventCard';
import { CategoryFilter } from './CategoryFilter';
import { MobileEventDetail } from './MobileEventDetail';
import { ZoneEditor } from './ZoneEditor';
import { DetailPanel } from './DetailPanel';
import { GlobalCategoriesSettings } from './GlobalCategoriesSettings';
import { NotificationDropdown } from './NotificationDropdown';
import { AppLogo } from './AppLogo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Settings, Bell, Menu, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface MobileHomeScreenProps {
  zones: Zone[];
  events: Event[];
  notifications: Notification[];
  isDeviceSubscribed: boolean;
  globalCategories: CategoryType[];
  onGlobalCategoriesChange: (categories: CategoryType[]) => void;
  onCreateZone: (zone: Omit<Zone, 'id' | 'activeEventsCount'>) => void;
  onUpdateZone: (zoneId: string, updates: Partial<Zone>) => void;
  onDeleteZone: (zoneId: string) => void;
  onMarkNotificationAsRead: (notificationId: string) => void;
  onMarkAllNotificationsAsRead: () => void;
}

export function MobileHomeScreen({ 
  zones, 
  events,
  notifications,
  isDeviceSubscribed,
  globalCategories,
  onGlobalCategoriesChange,
  onCreateZone, onUpdateZone, 
  onDeleteZone,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead
}: MobileHomeScreenProps) {
  const [showZonesList, setShowZonesList] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [detailPanelEvent, setDetailPanelEvent] = useState<Event | null>(null);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [filterCategories, setFilterCategories] = useState<CategoryType[]>([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const handleToggleCategory = (category: CategoryType) => {
    setFilterCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredEvents = filterCategories.length > 0
    ? events.filter(e => filterCategories.includes(e.category))
    : events;

  const activeEventsCount = events.filter(e => 
    zones.some(z => e.affectedZones.includes(z.id) && !z.isPaused)
  ).length;
  
  // Calculate category counts for all events
  const categoryCounts = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<CategoryType, number>);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Mobile Header - hidden when details are open */}
      <header className={`border-b border-border bg-card px-4 py-3 shrink-0 ${selectedEvent ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between">
          <AppLogo size="sm" showText={true} variant="minimal" />
          
          <div className="flex items-center gap-2">
            {activeEventsCount > 0 && (
              <Badge variant="default" className="text-xs">
                {activeEventsCount}
              </Badge>
            )}
            <NotificationDropdown
              notifications={notifications}
              zones={zones}
              isDeviceSubscribed={isDeviceSubscribed}
              onMarkAsRead={onMarkNotificationAsRead}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onNotificationClick={(notification) => {
                // Find the event and open details
                const event = events.find(e => e.id === notification.eventId);
                if (event) {
                  setSelectedEvent(event);
                }
              }}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SlidersHorizontal size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Филтър по категория</SheetTitle>
                  <SheetDescription>
                    Избери какъв тип събития да се показват на картата
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-3 pt-3 border-t border-border/30 max-h-[calc(100vh-180px)] overflow-y-auto pr-4 pl-4">
                  <CategoryFilter
                    selectedCategories={filterCategories}
                    onToggle={handleToggleCategory}
                    mode="list"
                    categoryCounts={categoryCounts}
                    onPresetSelect={(categories) => setFilterCategories(categories)}
                  />
                  {filterCategories.length > 0 && (
                    <div className="mt-6 pt-6 border-t sticky bottom-0 bg-background">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFilterCategories([])}
                      >
                        Изчисти филтрите
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className={`relative ${selectedEvent ? 'h-1/3' : 'flex-1'} transition-all duration-300`}>
        <MapView 
          zones={zones} 
          events={filteredEvents}
          highlightedEventId={hoveredEventId}
          selectedEventId={selectedEvent?.id || null}
        />

        {/* Floating Add Zone Button */}
        {!selectedEvent && (
          <Button
            size="lg"
            className="absolute top-4 right-4 shadow-lg"
            onClick={() => setIsCreatingZone(true)}
          >
            <Plus size={20} className="mr-2" />
            Добави зона
          </Button>
        )}
      </div>

      {/* Bottom Sheet - Zones & Events (hidden when detail is open) */}
      {!selectedEvent && (
        <div className="bg-card border-t border-border">
          {/* Zone Pills */}
          <div className="px-4 py-3 border-b border-border overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {zones.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => setEditingZone(zone)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: zone.color }}
                  />
                  <span className="text-sm font-medium">{zone.name}</span>
                  {zone.activeEventsCount > 0 && (
                    <Badge variant="default" className="h-5 text-xs">
                      {zone.activeEventsCount}
                    </Badge>
                  )}
                </button>
              ))}
              {zones.length === 0 && (
                <p className="text-sm text-muted-foreground">Все още няма зони</p>
              )}
            </div>
          </div>

          {/* Events List */}
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Последни събития</h2>
              <span className="text-xs text-muted-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'събитие' : 'събития'}
              </span>
            </div>
            
            {filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 3).map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  zones={zones}
                  onClick={() => setSelectedEvent(event)}
                  onHover={setHoveredEventId}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Bell size={32} className="mx-auto mb-2 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground">Няма активни събития</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Event Detail (scrollable overlay) */}
      {selectedEvent && (
        <div className="flex-1 overflow-y-auto">
          <MobileEventDetail
            event={selectedEvent}
            zones={zones}
            onClose={() => setSelectedEvent(null)}
          />
        </div>
      )}

      {/* Dialogs */}
      {(editingZone || isCreatingZone) && (
        <ZoneEditor
          zone={editingZone}
          globalCategories={globalCategories}
          open={!!(editingZone || isCreatingZone)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingZone(null);
              setIsCreatingZone(false);
            }
          }}
          onSave={(zoneData) => {
            if (editingZone) {
              onUpdateZone(editingZone.id, zoneData);
            } else {
              onCreateZone(zoneData);
            }
            setEditingZone(null);
            setIsCreatingZone(false);
          }}
        />
      )}
    </div>
  );
}
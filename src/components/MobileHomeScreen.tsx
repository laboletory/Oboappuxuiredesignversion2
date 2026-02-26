import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Settings, Bell, Menu, SlidersHorizontal, MapPin, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Zone, Event, Notification, CategoryType } from '../types';
import { MapView } from './MapView';
import { EventCard } from './EventCard';
import { ZoneCardWithAccordion } from './ZoneCardWithAccordion';
import { MobileEventDetail } from './MobileEventDetail';
import { ZoneEditor } from './ZoneEditor';
import { NotificationDropdown } from './NotificationDropdown';
import { AppLogo } from './AppLogo';
import { CategoryFilter } from './CategoryFilter';

interface MobileHomeScreenProps {
  zones: Zone[];
  events: Event[];
  notifications: Notification[];
  isDeviceSubscribed: boolean;
  isLoggedIn: boolean;
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
  isLoggedIn,
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
  const [activeTab, setActiveTab] = useState<string>('events'); // Mobile tab state
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null); // Accordion state for zones

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

  // Calculate active events count based on login state
  const activeEventsCount = isLoggedIn 
    ? events.filter(e => 
        zones.some(z => e.affectedZones.includes(z.id) && !z.isPaused)
      ).length
    : events.length; // For logged-out users, show all events in the area
  
  // Determine label text based on login state
  const activeEventsLabel = isLoggedIn
    ? `${activeEventsCount} активни ${activeEventsCount === 1 ? 'събитие' : 'събития'} във вашите зони`
    : `${activeEventsCount} активни ${activeEventsCount === 1 ? 'събитие' : 'събития'} в района`;
  
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
              <Badge variant="default" className="text-xs whitespace-nowrap">
                {isLoggedIn 
                  ? `${activeEventsCount} във вашите зони`
                  : `${activeEventsCount} в района`}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border h-auto bg-transparent p-0 gap-0">
              <TabsTrigger 
                value="events" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all duration-200 h-14 px-4 gap-2 font-medium data-[state=active]:bg-primary/5"
              >
                <span>Събития</span>
                {filteredEvents.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5 text-xs font-semibold data-[state=active]:bg-primary/10">
                    {filteredEvents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="zones"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-all duration-200 h-14 px-4 gap-2 font-medium data-[state=active]:bg-primary/5"
              >
                <span>Моите зони</span>
                {zones.length > 0 && isLoggedIn && (
                  <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5 text-xs font-semibold">
                    {zones.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Eventi Tab Content */}
            <TabsContent value="events" className="mt-0">
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
                    <p className="text-sm text-muted-foreground">
                      {filterCategories.length > 0 
                        ? 'Няма събития, които отговарят на филтрите'
                        : isLoggedIn 
                          ? 'Няма активни събития във вашите зони'
                          : 'Няма активни събития в района'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* My Zones Tab Content */}
            <TabsContent value="zones" className="mt-0">
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {!isLoggedIn ? (
                  /* Not logged in state - Feature gated */
                  <div className="text-center py-8 px-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <MapPin size={24} className="text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Персонализирай известията</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Създай зони за местата, които са важни за теб, и получавай известия само за събития в тях.
                    </p>
                    <Button variant="default" size="sm" className="w-full">
                      <LogIn size={16} className="mr-2" />
                      Вход в системата
                    </Button>
                  </div>
                ) : zones.length > 0 ? (
                  zones.map(zone => (
                    <ZoneCardWithAccordion
                      key={zone.id}
                      zone={zone}
                      events={events}
                      globalCategories={globalCategories}
                      isExpanded={expandedZoneId === zone.id}
                      onToggleExpand={() => {
                        setExpandedZoneId(expandedZoneId === zone.id ? null : zone.id);
                      }}
                      onEdit={() => setEditingZone(zone)}
                      onDelete={() => {
                        if (confirm(`Сигурен ли си, че искаш да изтриеш зона "${zone.name}"?`)) {
                          onDeleteZone(zone.id);
                        }
                      }}
                      onTogglePause={() => {
                        onUpdateZone(zone.id, { isPaused: !zone.isPaused });
                      }}
                      onEventClick={(event) => setSelectedEvent(event)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin size={32} className="mx-auto mb-2 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Все още няма създадени зони
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCreatingZone(true)}
                    >
                      <Plus size={16} className="mr-2" />
                      Създай първата си зона
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
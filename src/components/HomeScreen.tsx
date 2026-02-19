import { useState } from 'react';
import { Zone, Event, CategoryType, Notification } from '../types';
import { MapView } from './MapView';
import { ZoneCard } from './ZoneCard';
import { EventCard } from './EventCard';
import { CategoryFilter } from './CategoryFilter';
import { EventDetailDialog } from './EventDetailDialog';
import { ZoneEditor } from './ZoneEditor';
import { DetailPanel } from './DetailPanel';
import { DetailPanelContent } from './DetailPanelContent';
import { GlobalCategoriesSettings } from './GlobalCategoriesSettings';
import { NotificationDropdown } from './NotificationDropdown';
import { AppLogo } from './AppLogo';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Plus, Settings, Bell, SlidersHorizontal, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface HomeScreenProps {
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

export function HomeScreen({ 
  zones, 
  events,
  notifications,
  isDeviceSubscribed,
  globalCategories,
  onGlobalCategoriesChange,
  onCreateZone, 
  onUpdateZone, 
  onDeleteZone,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead
}: HomeScreenProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <AppLogo size="md" showText={true} />
          
          <div className="flex items-center gap-2">
            {activeEventsCount > 0 && (
              <Badge variant="default">
                {activeEventsCount} активни {activeEventsCount === 1 ? 'събитие' : 'събития'}
              </Badge>
            )}
            <GlobalCategoriesSettings
              selectedCategories={globalCategories}
              onToggle={(category) => {
                const newCategories = globalCategories.includes(category)
                  ? globalCategories.filter(c => c !== category)
                  : [...globalCategories, category];
                onGlobalCategoriesChange(newCategories);
              }}
            />
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
                  setDetailPanelEvent(event);
                }
              }}
            />
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto p-6 flex gap-6">
          {/* Map section */}
          <div className="flex-1 min-w-0 relative">
            <MapView 
              zones={zones} 
              events={filteredEvents} 
              selectedZone={selectedZone}
              onEventClick={(event) => setDetailPanelEvent(event)}
              onEventHover={setHoveredEventId}
              highlightedEventId={hoveredEventId}
              selectedEventId={detailPanelEvent?.id || null}
            />
            
            {/* Floating Filter Button */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
              <Sheet open={filterPanelOpen} onOpenChange={setFilterPanelOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-card shadow-lg border-border hover:bg-accent"
                  >
                    <SlidersHorizontal size={18} className="mr-2" />
                    Филтри
                    {filterCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {filterCategories.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[400px]">
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

          {/* Side panel */}
          <div className="w-96 flex flex-col gap-4 overflow-hidden">
            {detailPanelEvent ? (
              /* Details View */
              <div className="flex-1 flex flex-col overflow-hidden bg-card border border-border rounded-xl">
                {/* Header with close button */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                  <h2 className="font-semibold">Детайли</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDetailPanelEvent(null)}
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                {/* Scrollable details content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <DetailPanelContent event={detailPanelEvent} zones={zones} />
                </div>
              </div>
            ) : (
              /* Normal Tabs View */
              <Tabs defaultValue="zones" className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="zones">
                      Моите зони
                      {zones.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {zones.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="events">
                      Събития
                      {filteredEvents.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filteredEvents.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  <TabsContent value="zones" className="flex-1 overflow-y-auto mt-0 space-y-3 pr-2">
                    {zones.map(zone => (
                      <ZoneCard
                        key={zone.id}
                        zone={zone}
                        globalCategories={globalCategories}
                        onClick={() => setSelectedZone(zone)}
                        onEdit={() => setEditingZone(zone)}
                        onDelete={() => onDeleteZone(zone.id)}
                        onTogglePause={() => onUpdateZone(zone.id, { isPaused: !zone.isPaused })}
                      />
                    ))}
                    
                    <Button
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() => setIsCreatingZone(true)}
                    >
                      <Plus size={18} className="mr-2" />
                      Добави зона
                    </Button>
                  </TabsContent>

                  <TabsContent value="events" className="flex-1 overflow-y-auto mt-0 space-y-3 pr-2">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map(event => (
                        <EventCard
                          key={event.id}
                          event={event}
                          zones={zones}
                          onClick={() => {
                            setDetailPanelEvent(event);
                          }}
                          onHover={setHoveredEventId}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Bell size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
                        <p className="text-muted-foreground">
                          {filterCategories.length > 0 
                            ? 'Няма събития, които отговарят на филтрите'
                            : 'Няма активни събития във вашите зони'}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          zones={zones}
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        />
      )}

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
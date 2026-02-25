import { useState } from 'react';
import { Zone, Event, UserSettings, CategoryType, Notification } from './types';
import { HomeScreen } from './components/HomeScreen';
import { MobileHomeScreen } from './components/MobileHomeScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DesignShowcase } from './components/DesignShowcase';
import { mockZones, mockEvents, mockNotifications } from './lib/mockData';
import { getZoneColor } from './lib/categoryConfig';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Monitor, Smartphone, Palette } from 'lucide-react';

// Default global categories selection
const defaultGlobalCategories: CategoryType[] = [
  'water', 'electricity', 'heating', 
  'traffic', 'road-block', 'public-transport',
  'weather', 'construction-and-repairs'
];

function App() {
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<UserSettings>({
    notificationsEnabled: true,
    hasCompletedOnboarding: true,
    globalCategories: defaultGlobalCategories
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [view, setView] = useState<'desktop' | 'mobile' | 'design'>('desktop');
  const [isDeviceSubscribed, setIsDeviceSubscribed] = useState(false); // Mock subscription status
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock authentication status

  const handleGlobalCategoriesChange = (categories: CategoryType[]) => {
    setSettings(prev => ({
      ...prev,
      globalCategories: categories
    }));
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleCreateZone = (zoneData: Omit<Zone, 'id' | 'activeEventsCount'>) => {
    const newZone: Zone = {
      ...zoneData,
      id: String(zones.length + 1),
      activeEventsCount: events.filter(e => {
        // Simple distance check - in production, use proper geospatial calculation
        return true; // Mock: all events could affect new zones
      }).length,
      color: zoneData.color || getZoneColor(zones.length)
    };
    
    setZones(prev => [...prev, newZone]);
  };

  const handleUpdateZone = (zoneId: string, updates: Partial<Zone>) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId ? { ...zone, ...updates } : zone
    ));
  };

  const handleDeleteZone = (zoneId: string) => {
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const handleOnboardingComplete = (data: {
    name: string;
    label: string;
    notificationsEnabled: boolean;
  }) => {
    handleCreateZone({
      name: data.name,
      label: data.label,
      latitude: 42.6977,
      longitude: 23.3219,
      radius: 500,
      color: getZoneColor(0),
      isPaused: false,
      useGlobalCategories: true
    });
    
    setSettings({
      notificationsEnabled: data.notificationsEnabled,
      hasCompletedOnboarding: true,
      globalCategories: defaultGlobalCategories
    });
    
    setShowOnboarding(false);
  };

  const resetToOnboarding = () => {
    setZones([]);
    setSettings({
      notificationsEnabled: false,
      hasCompletedOnboarding: false,
      globalCategories: defaultGlobalCategories
    });
    setShowOnboarding(true);
  };

  return (
    <div className="w-full">
      {/* View Switcher - Fixed for desktop/design, inline for mobile */}
      {view !== 'mobile' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg p-1">
          <div className="flex gap-1">
            <Button
              variant={view === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('desktop')}
            >
              <Monitor size={16} className="mr-2" />
              Desktop
            </Button>
            <Button
              variant={view === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('mobile')}
            >
              <Smartphone size={16} className="mr-2" />
              Mobile
            </Button>
            <Button
              variant={view === 'design' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('design')}
            >
              <Palette size={16} className="mr-2" />
              Design System
            </Button>
          </div>
        </div>
      )}

      {/* Demo Controls */}
      {view !== 'design' && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="bg-card shadow-lg"
          >
            {isLoggedIn ? 'LOGOUT' : 'LOGIN'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToOnboarding}
            className="bg-card shadow-lg"
          >
            ИНТРО
          </Button>
        </div>
      )}

      {/* Main Views */}
      {view === 'desktop' && (
        <HomeScreen
          zones={zones}
          events={events}
          notifications={notifications}
          isDeviceSubscribed={isDeviceSubscribed}
          isLoggedIn={isLoggedIn}
          globalCategories={settings.globalCategories}
          onGlobalCategoriesChange={handleGlobalCategoriesChange}
          onCreateZone={handleCreateZone}
          onUpdateZone={handleUpdateZone}
          onDeleteZone={handleDeleteZone}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        />
      )}

      {view === 'mobile' && (
        <div className="flex flex-col min-h-screen">
          {/* View Switcher - Inline for mobile view */}
          <div className="flex justify-center py-4 bg-background border-b border-border">
            <div className="bg-card border border-border rounded-lg shadow-sm p-1">
              <div className="flex gap-1">
                <Button
                  variant={view === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('desktop')}
                >
                  <Monitor size={16} className="mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={view === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('mobile')}
                >
                  <Smartphone size={16} className="mr-2" />
                  Mobile
                </Button>
                <Button
                  variant={view === 'design' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('design')}
                >
                  <Palette size={16} className="mr-2" />
                  Design System
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="flex-1 max-w-md mx-auto border-x border-border w-full">
            <MobileHomeScreen
              zones={zones}
              events={events}
              notifications={notifications}
              isDeviceSubscribed={isDeviceSubscribed}
              isLoggedIn={isLoggedIn}
              globalCategories={settings.globalCategories}
              onGlobalCategoriesChange={handleGlobalCategoriesChange}
              onCreateZone={handleCreateZone}
              onUpdateZone={handleUpdateZone}
              onDeleteZone={handleDeleteZone}
              onMarkNotificationAsRead={handleMarkNotificationAsRead}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
            />
          </div>
        </div>
      )}

      {view === 'design' && <DesignShowcase />}

      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingFlow
          open={showOnboarding}
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}

export default App;
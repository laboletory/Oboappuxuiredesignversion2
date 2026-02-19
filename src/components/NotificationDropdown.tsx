import { useState, useRef, useEffect } from 'react';
import { Notification, Zone } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Button } from './ui/button';
import { Bell, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
import { NotificationBottomSheet } from './NotificationBottomSheet';

interface NotificationDropdownProps {
  notifications: Notification[];
  zones: Zone[];
  isDeviceSubscribed: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationDropdown({
  notifications,
  zones,
  isDeviceSubscribed,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // Show 10 initially
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, displayCount);
  const hasMore = displayCount < notifications.length;

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && window.innerWidth >= 1024) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Reset display count when closing
  useEffect(() => {
    if (!isOpen) {
      setDisplayCount(10);
    }
  }, [isOpen]);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, notifications.length));
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
          )}
        </Button>

        {/* Desktop Dropdown Panel */}
        {isOpen && (
          <div className="hidden lg:block absolute right-0 top-full mt-2 w-[420px] bg-card border border-border rounded-lg shadow-lg z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">Известия</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  Маркирай всички като прочетени
                </Button>
              )}
            </div>

            {/* Device subscription warning */}
            {!isDeviceSubscribed && (
              <div className="mx-3 mt-3 px-3 py-2 bg-muted/30 border border-border/30 rounded flex items-start gap-2">
                <AlertCircle size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-snug">
                  Текущото устройство не е абонирано за известия.
                </p>
              </div>
            )}

            {/* Notifications List */}
            <div className="max-h-[420px] overflow-y-auto notification-scrollbar">
              {notifications.length > 0 ? (
                <div className="py-1">
                  {displayedNotifications.map((notification) => {
                    const zone = zones.find(z => z.id === notification.zoneId);
                    return (
                      <button
                        key={notification.id}
                        onClick={() => {
                          if (!notification.isRead) {
                            onMarkAsRead(notification.id);
                          }
                          onNotificationClick(notification);
                          setIsOpen(false);
                        }}
                        className="w-full px-4 py-3 hover:bg-accent/50 transition-colors text-left flex items-start gap-3 group"
                      >
                        {/* Category Icon */}
                        <div className="shrink-0 mt-0.5">
                          <CategoryIcon 
                            category={notification.category} 
                            size={16} 
                            className={notification.isRead ? 'opacity-50' : ''}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <h4 className={`text-sm line-clamp-1 flex-1 ${
                              !notification.isRead 
                                ? 'font-semibold text-foreground' 
                                : 'font-normal text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1.5" />
                            )}
                          </div>
                          
                          <p className={`text-xs line-clamp-2 mb-1.5 ${
                            notification.isRead 
                              ? 'text-muted-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {notification.message}
                          </p>

                          <div className={`flex items-center gap-1.5 text-xs ${
                            notification.isRead 
                              ? 'text-muted-foreground/60' 
                              : 'text-muted-foreground'
                          }`}>
                            {zone && (
                              <>
                                <div 
                                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                                  style={{ 
                                    backgroundColor: zone.color,
                                    opacity: notification.isRead ? 0.5 : 1
                                  }}
                                />
                                <span>{zone.name}</span>
                                <span className="opacity-50">•</span>
                              </>
                            )}
                            <span>
                              {formatDistanceToNow(notification.timestamp, { 
                                addSuffix: true,
                                locale: bg 
                              })}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Bell size={36} className="mx-auto mb-3 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">
                    Няма известия
                  </p>
                </div>
              )}
            </div>

            {/* Footer - Load More */}
            {hasMore && (
              <div className="px-3 py-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMore}
                  className="w-full text-xs h-8 text-muted-foreground hover:text-foreground"
                >
                  Зареди още ({notifications.length - displayCount} останали)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <NotificationBottomSheet
        notifications={notifications}
        zones={zones}
        isDeviceSubscribed={isDeviceSubscribed}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onNotificationClick={onNotificationClick}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
import { useEffect, useRef, useState } from 'react';
import { Notification, Zone } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Button } from './ui/button';
import { Bell, X, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';

interface NotificationBottomSheetProps {
  notifications: Notification[];
  zones: Zone[];
  isDeviceSubscribed: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationBottomSheet({
  notifications,
  zones,
  isDeviceSubscribed,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  isOpen,
  onClose
}: NotificationBottomSheetProps) {
  const [displayCount, setDisplayCount] = useState(10);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, displayCount);
  const hasMore = displayCount < notifications.length;

  // Reset display count when closing
  useEffect(() => {
    if (!isOpen) {
      setDisplayCount(10);
      setDragStartY(null);
      setDragCurrentY(null);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 10, notifications.length));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow drag from the header or if scrolled to top
    const isScrolledToTop = contentRef.current?.scrollTop === 0;
    if (isScrolledToTop || e.target === sheetRef.current) {
      setDragStartY(e.touches[0].clientY);
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY !== null && isDragging) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - dragStartY;
      
      // Only allow dragging down
      if (diff > 0) {
        setDragCurrentY(currentY);
      }
    }
  };

  const handleTouchEnd = () => {
    if (dragStartY !== null && dragCurrentY !== null) {
      const diff = dragCurrentY - dragStartY;
      
      // If dragged down more than 100px, close the sheet
      if (diff > 100) {
        onClose();
      }
    }
    
    setDragStartY(null);
    setDragCurrentY(null);
    setIsDragging(false);
  };

  const dragOffset = dragStartY !== null && dragCurrentY !== null 
    ? Math.max(0, dragCurrentY - dragStartY) 
    : 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Minimal backdrop - just for dimming */}
      <div 
        className="fixed inset-0 bg-black/5 z-40 lg:hidden bottom-sheet-backdrop-enter"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden bottom-sheet-enter"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-card rounded-t-2xl shadow-2xl flex flex-col h-[95vh] max-h-[95vh]">
          {/* Drag Handle */}
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
            <h3 className="font-semibold">Известия</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  Маркирай всички
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 shrink-0"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Device subscription warning */}
          {!isDeviceSubscribed && (
            <div className="mx-4 mt-3 px-3 py-2.5 bg-muted/30 border border-border/30 rounded flex items-start gap-2 shrink-0">
              <AlertCircle size={16} className="text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-snug">
                Текущото устройство не е абонирано за известия.
              </p>
            </div>
          )}

          {/* Scrollable Notifications List */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto notification-scrollbar"
          >
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
                        onClose();
                      }}
                      className="w-full px-4 py-3.5 active:bg-accent/50 transition-colors text-left flex items-start gap-3"
                    >
                      {/* Category Icon */}
                      <div className="shrink-0 mt-0.5">
                        <CategoryIcon 
                          category={notification.category} 
                          size={18} 
                          className={notification.isRead ? 'opacity-50' : ''}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className={`text-sm line-clamp-2 flex-1 ${
                            !notification.isRead 
                              ? 'font-semibold text-foreground' 
                              : 'font-normal text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                          )}
                        </div>
                        
                        <p className={`text-sm line-clamp-2 mb-2 ${
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
              <div className="py-16 text-center">
                <Bell size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-sm text-muted-foreground">
                  Няма известия
                </p>
              </div>
            )}
          </div>

          {/* Footer - Load More */}
          {hasMore && (
            <div className="px-4 py-3 border-t border-border shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadMore}
                className="w-full text-sm h-10 text-muted-foreground hover:text-foreground"
              >
                Зареди още ({notifications.length - displayCount} останали)
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
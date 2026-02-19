import { MapPin, Bell, BellOff, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  type: 'no-zones' | 'no-events' | 'paused-zone' | 'notifications-disabled';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const configs = {
    'no-zones': {
      icon: MapPin,
      title: 'Все още няма зони',
      description: 'Създайте първата си зона, за да започнете да получавате релевантни известия за вашия район.',
      actionLabel: 'Добави първата зона',
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-primary/20 rounded-full animate-pulse delay-75" />
          <div className="absolute inset-8 bg-primary/30 rounded-full animate-pulse delay-150" />
          <MapPin size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
        </div>
      )
    },
    'no-events': {
      icon: Sparkles,
      title: 'Всичко е наред!',
      description: 'В момента няма активни събития във вашите зони. Ще ви уведомим, когато се появи нещо.',
      actionLabel: undefined,
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full" />
          <Sparkles size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" />
        </div>
      )
    },
    'paused-zone': {
      icon: BellOff,
      title: 'Зоната е на пауза',
      description: 'Известията са временно спрени за тази зона. Възобновете, за да започнете да получавате актуализации отново.',
      actionLabel: 'Възобнови известията',
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-muted rounded-full opacity-50" />
          <BellOff size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      )
    },
    'notifications-disabled': {
      icon: Bell,
      title: 'Известията са изключени',
      description: 'Разрешете известия, за да бъдете информирани за важни събития във вашите зони.',
      actionLabel: 'Разреши известията',
      illustration: (
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-amber-500/10 rounded-full" />
          <Bell size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600" />
        </div>
      )
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="text-center py-12 px-6">
      {config.illustration}
      <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {config.description}
      </p>
      {config.actionLabel && onAction && (
        <Button onClick={onAction}>
          <Icon size={18} className="mr-2" />
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
}

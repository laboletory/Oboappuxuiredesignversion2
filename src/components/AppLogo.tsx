import { Bell } from 'lucide-react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'minimal';
}

export function AppLogo({ size = 'md', showText = true, variant = 'default' }: AppLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2.5">
        <div className={`${sizeClasses[size]} bg-primary rounded-xl flex items-center justify-center shadow-sm`}>
          <Bell size={iconSizes[size]} className="text-primary-foreground" strokeWidth={2.5} />
        </div>
        {showText && (
          <span className={`font-semibold tracking-tight ${textSizes[size]}`}>
            OboApp
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Enhanced Logo with layered design */}
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-[#1e3a8a] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
          <Bell size={iconSizes[size]} className="text-primary-foreground relative z-10" strokeWidth={2.5} />
        </div>
        {/* Small accent dot */}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#3b82f6] rounded-full border-2 border-background shadow-sm" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight leading-none ${textSizes[size]}`}>
            Obo<span className="text-primary">App</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
            Местни известия
          </span>
        </div>
      )}
    </div>
  );
}
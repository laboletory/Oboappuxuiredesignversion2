import logoImage from 'figma:asset/091100520a8c963d375232b686af9c98578dcd37.png';
import logoSmall from 'figma:asset/43ba71b390debbff4310076a13854d3a6d76c785.png';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'minimal';
}

export function AppLogo({ size = 'md', showText = true, variant = 'default' }: AppLogoProps) {
  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 64
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  // Use the smaller version for sm size, larger for md and lg
  const logoSrc = size === 'sm' ? logoSmall : logoImage;

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2.5">
        <img 
          src={logoSrc} 
          alt="OboApp Logo" 
          className="shrink-0"
          style={{ width: imageSizes[size], height: imageSizes[size] }}
        />
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
      <img 
        src={logoSrc} 
        alt="OboApp Logo" 
        className="shrink-0"
        style={{ width: imageSizes[size], height: imageSizes[size] }}
      />
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
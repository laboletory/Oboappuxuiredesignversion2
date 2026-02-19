import { CategoryType } from '../types';
import { categoryConfig } from '../lib/categoryConfig';
import { CategoryIcon } from './CategoryIcon';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: CategoryType[];
  onToggle: (category: CategoryType) => void;
  mode?: 'chips' | 'list';
  categoryCounts?: Record<CategoryType, number>;
  onPresetSelect?: (categories: CategoryType[]) => void;
}

// Filter presets
const filterPresets = [
  {
    id: 'all',
    name: 'Всички',
    categories: Object.keys(categoryConfig) as CategoryType[]
  },
  {
    id: 'infrastructure',
    name: 'Инфраструктура',
    categories: ['water', 'electricity', 'heating', 'waste', 'construction-and-repairs'] as CategoryType[]
  },
  {
    id: 'mobility',
    name: 'Трафик и мобилност',
    categories: ['traffic', 'road-block', 'public-transport', 'parking', 'vehicles', 'bicycles'] as CategoryType[]
  },
  {
    id: 'environment',
    name: 'Околна среда',
    categories: ['weather', 'air-quality', 'health'] as CategoryType[]
  },
  {
    id: 'culture',
    name: 'Култура и събития',
    categories: ['culture', 'art', 'sports'] as CategoryType[]
  }
];

export function CategoryFilter({ 
  selectedCategories, 
  onToggle, 
  mode = 'chips',
  categoryCounts,
  onPresetSelect
}: CategoryFilterProps) {
  // Get all available categories from the config
  const categories = Object.keys(categoryConfig) as CategoryType[];

  const handlePresetClick = (preset: typeof filterPresets[0]) => {
    if (onPresetSelect) {
      onPresetSelect(preset.categories);
    } else {
      // If no callback provided, toggle each category
      preset.categories.forEach(cat => {
        if (!selectedCategories.includes(cat)) {
          onToggle(cat);
        }
      });
    }
  };

  // Determine which preset (if any) is currently active
  const getActivePreset = () => {
    for (const preset of filterPresets) {
      // Check if current selection exactly matches this preset
      if (
        selectedCategories.length === preset.categories.length &&
        preset.categories.every(cat => selectedCategories.includes(cat))
      ) {
        return preset.id;
      }
    }
    return null; // Custom state - no preset matches
  };

  const activePresetId = getActivePreset();

  // Presets section (only shown in list mode)
  const PresetsSection = mode === 'list' ? (
    <div className="mb-5 pb-5 border-b border-border/40">
      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-3">
        Бързи филтри
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filterPresets.map(preset => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`
                px-2.5 py-1 text-xs font-medium rounded-md transition-all
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-muted hover:bg-muted/70 text-foreground'
                }
              `}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  if (mode === 'chips') {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const config = categoryConfig[category];
          const isSelected = selectedCategories.includes(category);
          
          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-current bg-current/10' 
                  : 'border-border hover:border-current/50 bg-card'
                }
              `}
              style={isSelected ? { 
                borderColor: config.color,
                backgroundColor: config.lightColor 
              } : {}}
            >
              <div className={isSelected ? '' : 'opacity-60'}>
                <CategoryIcon category={category} size={16} className="p-0 bg-transparent" />
              </div>
              <span 
                className="text-sm font-medium"
                style={isSelected ? { color: config.color } : {}}
              >
                {config.name}
              </span>
              {isSelected && (
                <Check size={14} style={{ color: config.color }} strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {PresetsSection}
      {categories.map(category => {
        const config = categoryConfig[category];
        const isSelected = selectedCategories.includes(category);
        const count = categoryCounts?.[category] ?? 0;
        
        return (
          <button
            key={category}
            onClick={() => onToggle(category)}
            className={`
              w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-left
              ${isSelected 
                ? 'border-current bg-current/5' 
                : 'border-border hover:border-current/30 bg-card'
              }
            `}
            style={isSelected ? { borderColor: config.color } : {}}
          >
            <div 
              className="inline-flex items-center justify-center rounded-md p-1.5"
              style={{ backgroundColor: config.lightColor }}
            >
              <CategoryIcon category={category} size={14} className="p-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-tight">{config.name}</div>
            </div>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {count}
                </Badge>
              )}
              {isSelected && (
                <Check size={16} style={{ color: config.color }} strokeWidth={2.5} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
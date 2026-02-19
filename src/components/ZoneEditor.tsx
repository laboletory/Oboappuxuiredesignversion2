import { useState } from 'react';
import { Zone, CategoryType } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { GlobalCategoriesSettings } from './GlobalCategoriesSettings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { getZoneColor } from '../lib/categoryConfig';
import { MapPin, Globe, Settings2 } from 'lucide-react';

interface ZoneEditorProps {
  zone?: Zone | null;
  globalCategories: CategoryType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (zone: Omit<Zone, 'id' | 'activeEventsCount'>) => void;
}

const zoneLabelOptions = ['Дома', 'Офис', 'Родители', 'Училище', 'Фитнес', 'Друго'];

export function ZoneEditor({ zone, globalCategories, open, onOpenChange, onSave }: ZoneEditorProps) {
  const isEditing = !!zone;
  
  const [label, setLabel] = useState(zone?.label || 'Дома');
  const [generalLocation, setGeneralLocation] = useState('Център, София');
  const [radius, setRadius] = useState(zone?.radius || 500);
  const [useGlobalCategories, setUseGlobalCategories] = useState(
    zone?.useGlobalCategories ?? true
  );
  const [customCategories, setCustomCategories] = useState<CategoryType[]>(
    zone?.customCategories || globalCategories
  );

  const handleToggleCategory = (category: CategoryType) => {
    setCustomCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    if (!useGlobalCategories && customCategories.length === 0) return;

    onSave({
      name: label, // Use label as the name
      label: label,
      latitude: zone?.latitude || 42.6977,
      longitude: zone?.longitude || 23.3219,
      radius,
      color: zone?.color || getZoneColor(Math.floor(Math.random() * 6)),
      isPaused: zone?.isPaused || false,
      useGlobalCategories,
      customCategories: useGlobalCategories ? undefined : customCategories
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактиране на зона' : 'Създаване на нова зона'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Актуализирайте настройките на зоната и предпочитанията за известия.'
              : 'Дефинирай местоположение, което те интересува и персонализирай известията.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Zone Label */}
          <div className="space-y-2">
            <Label>Тип зона</Label>
            <div className="flex flex-wrap gap-2">
              {zoneLabelOptions.map(option => (
                <Button
                  key={option}
                  type="button"
                  variant={label === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLabel(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Това ще се използва като визуална етикета за твоята зона
            </p>
          </div>

          {/* Location - Simplified for demo */}
          <div className="space-y-2">
            <Label>Местоположение</Label>
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={20} className="text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">{generalLocation}</div>
                  <div className="text-xs text-muted-foreground">
                    Общ район (без точен адрес)
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                💡 В пълната версия кликнете на картата за избор на приблизителен район
              </div>
            </div>
          </div>

          {/* Radius */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Радиус на известията</Label>
              <span className="text-sm font-medium">{radius}м</span>
            </div>
            <Slider
              value={[radius]}
              onValueChange={([value]) => setRadius(value)}
              min={100}
              max={2000}
              step={50}
            />
            <p className="text-xs text-muted-foreground">
              Ще получавате известия за събития в този радиус от центъра на зоната
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>За какво искаш да получаваш известия?</Label>
            <div className="flex items-center justify-between gap-2 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Switch
                  id="use-global"
                  checked={useGlobalCategories}
                  onCheckedChange={setUseGlobalCategories}
                />
                <Label htmlFor="use-global" className="cursor-pointer">
                  {useGlobalCategories ? (
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-primary" />
                      <span>Глобални категории ({globalCategories.length})</span>
                    </div>
                  ) : (
                    <span>Персонализирани категории</span>
                  )}
                </Label>
              </div>
            </div>
            
            {useGlobalCategories ? (
              <p className="text-xs text-muted-foreground">
                Тази зона ще получава известия за всички категории, избрани в глобалните настройки.
              </p>
            ) : (
              <div className="space-y-2">
                <GlobalCategoriesSettings
                  selectedCategories={customCategories}
                  onToggle={handleToggleCategory}
                  trigger={
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings2 size={16} className="mr-2" />
                      Избери категории ({customCategories.length})
                    </Button>
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Тази зона ще получава известия само за избраните категории.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отказ
          </Button>
          <Button onClick={handleSave} disabled={!useGlobalCategories && customCategories.length === 0}>
            {isEditing ? 'Запази промените' : 'Създай зона'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
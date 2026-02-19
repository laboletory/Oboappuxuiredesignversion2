import { CategoryType, CategoryGroup } from '../types';
import { categoryConfig, categoryGroups } from '../lib/categoryConfig';
import { Settings, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { CategoryIcon } from './CategoryIcon';

interface GlobalCategoriesSettingsProps {
  selectedCategories: CategoryType[];
  onToggle: (category: CategoryType) => void;
  trigger?: React.ReactNode;
}

export function GlobalCategoriesSettings({
  selectedCategories,
  onToggle,
  trigger
}: GlobalCategoriesSettingsProps) {
  const isAllSelected = (groupCategories: CategoryType[]) => {
    return groupCategories.every(cat => selectedCategories.includes(cat));
  };

  const toggleGroup = (groupCategories: CategoryType[]) => {
    const allSelected = isAllSelected(groupCategories);
    groupCategories.forEach(cat => {
      if (allSelected) {
        // Deselect all
        if (selectedCategories.includes(cat)) {
          onToggle(cat);
        }
      } else {
        // Select all
        if (!selectedCategories.includes(cat)) {
          onToggle(cat);
        }
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings size={16} className="mr-2" />
            Категории
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Глобални категории известия</DialogTitle>
          <DialogDescription>
            Избери какви известия искаш да получаваш за всички зони. Можеш да персонализираш категориите за всяка зона отделно.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {(Object.keys(categoryGroups) as CategoryGroup[]).map((groupKey) => {
            const group = categoryGroups[groupKey];
            const allSelected = isAllSelected(group.categories);
            const someSelected = group.categories.some(cat => selectedCategories.includes(cat));

            return (
              <div key={groupKey} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{group.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toggleGroup(group.categories)}
                  >
                    {allSelected ? 'Махни всички' : 'Избери всички'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {group.categories.map((category) => {
                    const config = categoryConfig[category];
                    const isSelected = selectedCategories.includes(category);

                    return (
                      <button
                        key={category}
                        onClick={() => onToggle(category)}
                        className={`
                          relative flex items-start gap-3 px-4 py-3.5 rounded-lg border-2 transition-all text-left min-h-[68px]
                          ${isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/30 bg-card'
                          }
                        `}
                      >
                        <CategoryIcon category={category} size={20} className="shrink-0 mt-0.5" />
                        <span className="text-sm flex-1 leading-relaxed font-normal">{config.name}</span>
                        {isSelected && (
                          <Check size={18} className="text-primary shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedCategories.length} от {Object.keys(categoryConfig).length} категории избрани
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
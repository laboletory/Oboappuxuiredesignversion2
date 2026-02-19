import { useState } from 'react';
import { CategoryType } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { AppLogo } from './AppLogo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { MapPin, Sparkles, Bell, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { getZoneColor } from '../lib/categoryConfig';
import { VisuallyHidden } from './ui/visually-hidden';

interface OnboardingFlowProps {
  open: boolean;
  onComplete: (firstZone: {
    name: string;
    label: string;
    notificationsEnabled: boolean;
  }) => void;
  onClose: () => void;
}

type Step = 'welcome' | 'location' | 'notifications';

const zoneTypeOptions = ['Дома', 'Офис', 'Родители', 'Училище', 'Фитнес', 'Друго'];

export function OnboardingFlow({ open, onComplete, onClose }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [zoneType, setZoneType] = useState('Дома');

  const handleComplete = (notificationsEnabled: boolean) => {
    onComplete({
      name: zoneType,
      label: zoneType,
      notificationsEnabled
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && onClose) {
        onClose();
      }
    }}>
      <DialogContent 
        className="max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Настройка на OboApp</DialogTitle>
            <DialogDescription>
              Преминете през стъпките за настройка на вашата първа зона и предпочитания за известия
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        
        {step === 'welcome' && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bell size={40} className="text-primary-foreground" />
            </div>
            
            <h1 className="text-3xl font-semibold mb-4">Добре дошъл в OboApp</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
              Получавай известия за инфраструктурни проблеми, които са важни за теб - само за места, които те интересуват.
            </p>

            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div className="font-medium mb-1">Дефинирай зони</div>
                <div className="text-sm text-muted-foreground">
                  Дом, офис или всяко място, което те интересува
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} className="text-primary" />
                </div>
                <div className="font-medium mb-1">Избери категории</div>
                <div className="text-sm text-muted-foreground">
                  Избери какво искаш да знаеш
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-primary" />
                </div>
                <div className="font-medium mb-1">Бъди информиран</div>
                <div className="text-sm text-muted-foreground">
                  Получавай навременни, релевантни известия
                </div>
              </div>
            </div>

            <Button size="lg" onClick={() => setStep('location')}>
              Започни
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        )}

        {step === 'location' && (
          <div className="py-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Стъпка 1 от 2</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Добави първата си зона</h2>
              <p className="text-muted-foreground">
                Избери типа на зоната. Няма да съхраняваме лично идентифицируема информация.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Тип зона</Label>
                <div className="flex flex-wrap gap-2">
                  {zoneTypeOptions.map(option => (
                    <Button
                      key={option}
                      type="button"
                      variant={zoneType === option ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setZoneType(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Това ще се използва само като визуална етикета за твоята зона
                </p>
              </div>

              <div className="space-y-2">
                <Label>Къде се намира?</Label>
                <div className="bg-muted/20 rounded-lg border-2 border-dashed border-border p-8">
                  <div className="text-center">
                    <MapPin size={40} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium mb-2">Кликни на картата за избор на приблизителен район</p>
                    <p className="text-sm text-muted-foreground">
                      В това демо ще използваме местоположение по подразбиране в София, България
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button variant="outline" onClick={() => setStep('welcome')}>
                <ArrowLeft size={18} className="mr-2" />
                Назад
              </Button>
              <Button onClick={() => setStep('notifications')}>
                Напред
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 'notifications' && (
          <div className="py-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>Стъпка 2 от 2</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Разрешаване на известия</h2>
              <p className="text-muted-foreground">
                Бъди информиран за важни събития, които засягат твоите зони.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <Bell size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Защо да разреша известия?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>Получавай навременни предупреждения за вода, ток или отопление</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>Научи за затваряне на пътища и ремонти близо до теб</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>Получавай известия само за зони, които са важни за теб</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Пример за известие:</strong>
                </p>
                <div className="mt-3 bg-card border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium mb-1">Спиране на водата близо до {zoneType}</div>
                      <div className="text-sm text-muted-foreground">
                        Планирана поддръжка днес 8:00-16:00, 200м от вашата зона
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleComplete(false)}
              >
                Пропусни засега
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleComplete(true)}
              >
                <Bell size={18} className="mr-2" />
                Разреши известията
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
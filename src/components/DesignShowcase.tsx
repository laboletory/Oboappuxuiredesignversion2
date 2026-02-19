import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { CategoryIcon } from './CategoryIcon';
import { categoryConfig } from '../lib/categoryConfig';
import { CategoryType } from '../types';
import { Palette, Type, Layout, Layers } from 'lucide-react';

export function DesignShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">OboApp Design System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A calm, civic-tech aesthetic focused on clarity, accessibility, and user-first design principles.
          </p>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">
              <Palette size={16} className="mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type size={16} className="mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="components">
              <Layout size={16} className="mr-2" />
              Components
            </TabsTrigger>
            <TabsTrigger value="icons">
              <Layers size={16} className="mr-2" />
              Icons
            </TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Category Colors</h2>
              <p className="text-muted-foreground mb-6">
                Each event category has a distinct color for instant recognition.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.entries(categoryConfig) as [CategoryType, typeof categoryConfig[CategoryType]][]).map(([key, config]) => (
                  <Card key={key} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CategoryIcon category={key} size={24} />
                      <div>
                        <div className="font-semibold">{config.name}</div>
                        <div className="text-xs text-muted-foreground">{config.color}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div 
                        className="h-12 rounded-lg border"
                        style={{ backgroundColor: config.color }}
                      />
                      <div 
                        className="h-12 rounded-lg border"
                        style={{ backgroundColor: config.lightColor }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Severity Levels</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6">
                  <Badge variant="secondary" className="mb-3">Low</Badge>
                  <p className="text-sm text-muted-foreground">Minor inconvenience</p>
                </Card>
                <Card className="p-6">
                  <Badge variant="default" className="mb-3">Medium</Badge>
                  <p className="text-sm text-muted-foreground">Moderate disruption</p>
                </Card>
                <Card className="p-6">
                  <Badge variant="destructive" className="mb-3">High</Badge>
                  <p className="text-sm text-muted-foreground">Significant impact</p>
                </Card>
                <Card className="p-6">
                  <Badge variant="destructive" className="mb-3 bg-red-900">Critical</Badge>
                  <p className="text-sm text-muted-foreground">Urgent action needed</p>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6">Type Scale</h2>
              <div className="space-y-6">
                <div>
                  <h1>Heading 1 - Primary Headlines</h1>
                  <p className="text-sm text-muted-foreground mt-1">font-semibold, text-2xl</p>
                </div>
                <div>
                  <h2>Heading 2 - Section Titles</h2>
                  <p className="text-sm text-muted-foreground mt-1">font-semibold, text-xl</p>
                </div>
                <div>
                  <h3>Heading 3 - Subsection Titles</h3>
                  <p className="text-sm text-muted-foreground mt-1">font-semibold, text-lg</p>
                </div>
                <div>
                  <h4>Heading 4 - Card Titles</h4>
                  <p className="text-sm text-muted-foreground mt-1">font-medium, text-base</p>
                </div>
                <div>
                  <p className="text-base">Body Text - Main content and descriptions</p>
                  <p className="text-sm text-muted-foreground mt-1">font-normal, text-base</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Small Text - Meta information and helpers</p>
                  <p className="text-xs text-muted-foreground mt-1">font-normal, text-sm</p>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Components */}
          <TabsContent value="components" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
              <div className="flex flex-wrap gap-3">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Badges</h2>
              <div className="flex flex-wrap gap-3">
                <Badge>Default Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Standard Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Used for zone cards, event cards, and content containers.
                  </p>
                </Card>
                <Card className="p-6 border-primary/30 hover:border-primary/50 transition-colors">
                  <h3 className="font-semibold mb-2">Interactive Card</h3>
                  <p className="text-sm text-muted-foreground">
                    Hover effect for clickable cards and list items.
                  </p>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Icons */}
          <TabsContent value="icons" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Category Icons</h2>
              <p className="text-muted-foreground mb-6">
                Icons from Lucide React library, sized consistently at 20px with 2px stroke width.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(categoryConfig) as CategoryType[]).map(category => (
                  <Card key={category} className="p-6 flex items-center gap-3">
                    <CategoryIcon category={category} size={24} />
                    <div>
                      <div className="font-medium">{categoryConfig[category].name}</div>
                      <div className="text-xs text-muted-foreground">{categoryConfig[category].icon}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Design Principles */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Design Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">User-First, Not Data-First</h3>
              <p className="text-sm text-muted-foreground">
                Focus on personal zones and relevance rather than overwhelming users with raw map data.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Clear Visual Hierarchy</h3>
              <p className="text-sm text-muted-foreground">
                Strong typographic scale and consistent spacing guide users through information.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Calm, Civic-Tech Aesthetic</h3>
              <p className="text-sm text-muted-foreground">
                Trustworthy, professional design that feels official yet approachable.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Accessibility First</h3>
              <p className="text-sm text-muted-foreground">
                High contrast ratios, clear labeling, and keyboard navigation support.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Map as Support</h3>
              <p className="text-sm text-muted-foreground">
                The map visualizes zones but doesn't dominate—zones and events are the focus.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Contextual Relevance</h3>
              <p className="text-sm text-muted-foreground">
                Every notification and event clearly explains why it matters to the user.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

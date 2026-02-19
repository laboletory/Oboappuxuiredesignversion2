// Core types for OboApp

export type CategoryType = 
  // Infrastructure
  | 'water' 
  | 'electricity' 
  | 'heating'
  | 'waste'
  // Mobility
  | 'traffic'
  | 'road-block'
  | 'public-transport'
  | 'parking'
  | 'vehicles'
  | 'bicycles'
  // Environment
  | 'weather'
  | 'air-quality'
  // Society
  | 'health'
  | 'culture'
  | 'art'
  | 'sports'
  // Maintenance
  | 'construction-and-repairs'
  | 'maintenance'
  // Other
  | 'uncategorized';

export type CategoryGroup = 'infrastructure' | 'mobility' | 'environment' | 'society' | 'maintenance';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type GeometryType = 'point' | 'linestring' | 'polygon';

export interface EventGeometry {
  type: GeometryType;
  coordinates: number[][]; // Array of [x, y] percentage coordinates for visualization
}

export interface Zone {
  id: string;
  name: string;
  label?: string; // e.g., "Home", "Office", "Parents"
  latitude: number;
  longitude: number;
  radius: number; // in meters
  color: string;
  isPaused: boolean;
  activeEventsCount: number;
  useGlobalCategories: boolean; // If true, inherits from global settings
  customCategories?: CategoryType[]; // Only used when useGlobalCategories is false
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  severity: SeverityLevel;
  startTime: Date;
  endTime?: Date;
  latitude: number;
  longitude: number;
  source: string; // e.g., "Municipal Water Authority"
  affectedZones: string[]; // Zone IDs
  distanceFromZone?: number; // in meters
  geometry?: EventGeometry; // Optional geometry for visualization
}

export interface UserSettings {
  notificationsEnabled: boolean;
  hasCompletedOnboarding: boolean;
  globalCategories: CategoryType[]; // Global category selection
}

export interface Notification {
  id: string;
  eventId: string; // Reference to the event
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: CategoryType;
  zoneId?: string; // Which zone triggered this notification
}
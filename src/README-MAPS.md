# Map Integration

This application uses **Leaflet** with **OpenStreetMap** to display zones and events in Sofia, Bulgaria (Krasno Selo area).

## Why Leaflet?

- **No API key required** - Perfect for mockups and demos
- **Free and open source** - OpenStreetMap data
- **Lightweight and performant** - Fast rendering
- **Full-featured** - Supports circles, markers, and custom icons

## Default Location

The map is centered on **Krasno Selo, Sofia, Bulgaria**:
- Latitude: 42.6977° N
- Longitude: 23.2561° E
- Default Zoom: 13

## Features

- **Zone Visualization**: Zones are displayed as colored circles with configurable radius
- **Event Markers**: Events appear as colored markers based on their category
- **Interactive**: Click on event markers to open the detail panel
- **Zone Highlighting**: Selected zones are highlighted with increased opacity and stroke weight
- **Smooth Navigation**: Animated pan and zoom when selecting zones

## Mock Data Distribution

Zones and events are automatically distributed around the Krasno Selo area:
- Zones are placed in a grid pattern with ~1.5km spacing
- Events are offset from their zone centers by ~200m for visibility

## Libraries Used

- `react-leaflet` - React components for Leaflet
- `leaflet` - Core mapping library
- OpenStreetMap tile layer - Map tiles (no API key needed)

export const DEFAULT_API_KEY = 'DEMO_KEY';
export const NASA_BASE_URL = 'https://api.nasa.gov';
export const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
export const GEOJSON_URL = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson';

export const CATEGORY_COLORS: Record<string, string> = {
    'STATION': '#F59E0B',   // Amber-500
    'TELESCOPE': '#8B5CF6', // Violet-500
    'CIVIL': '#3B82F6',     // Blue-500
    'MILITARY': '#EF4444',  // Red-500
    'DEBRIS': '#6B7280',    // Gray-500
    'WILDFIRE': '#EA580C',  // Orange-600
    'STORM': '#06B6D4',     // Cyan-500
    'HAZARD': '#F43F5E'     // Rose-500 (Generic)
};

export const IMAGE_ASSETS: Record<string, string> = {
    'HURRICANE': 'https://images.unsplash.com/photo-1582234050212-320d3e91122a?auto=format&fit=crop&w=800&q=80',
    'CITY LIGHTS': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'OCEAN': 'https://images.unsplash.com/photo-1460500063983-994d4c27756c?auto=format&fit=crop&w=800&q=80',
    'NEBULA': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    'GALAXY': 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
    'MILITARY BASE': 'https://images.unsplash.com/photo-1596267802871-33e1444c9b1f?auto=format&fit=crop&w=800&q=80',
    'ASTEROID': 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=800&q=80',
    'DEEP FIELD': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    'DEFAULT_EARTH': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'DEFAULT_SPACE': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80'
};

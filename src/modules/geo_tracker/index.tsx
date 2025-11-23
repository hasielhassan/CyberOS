import { Map as MapIcon } from 'lucide-react';
import { Plugin } from '../../core/types';
import GeoMap from './GeoMap';

export const GeoTrackerPlugin: Plugin = {
    id: 'geo_tracker',
    name: 'Geo_Tracker',
    icon: MapIcon,
    component: GeoMap,
};

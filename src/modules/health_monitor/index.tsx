import { lazy } from 'react';
import { Plugin } from '../../core/types';
import { Activity } from 'lucide-react';

const HealthMonitor = lazy(() => import('./HealthMonitor'));

export const HealthMonitorPlugin: Plugin = {
    id: 'health_monitor',
    name: 'VITALS',
    component: HealthMonitor,
    icon: Activity
};

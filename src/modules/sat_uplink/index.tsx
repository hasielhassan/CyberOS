import { Globe } from 'lucide-react';
import { Plugin } from '../../core/types';
import OrbitSat from './OrbitSat';

export const SatUplinkPlugin: Plugin = {
    id: 'sat_uplink',
    name: 'Sat_Uplink',
    icon: Globe,
    component: OrbitSat,
};

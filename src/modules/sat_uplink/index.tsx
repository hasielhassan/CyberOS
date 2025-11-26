import { Globe } from 'lucide-react';
import { Plugin } from '../../core/types';
import SatUplink from './SatUplink';

export const SatUplinkPlugin: Plugin = {
    id: 'sat_uplink',
    name: 'Sat_Uplink',
    icon: Globe,
    component: SatUplink,
};

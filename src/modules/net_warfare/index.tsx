import { Wifi } from 'lucide-react';
import { Plugin } from '../../core/types';
import NetWar from './NetWar';

export const NetWarfarePlugin: Plugin = {
    id: 'net_warfare',
    name: 'Net_Warfare',
    icon: Wifi,
    component: NetWar,
};

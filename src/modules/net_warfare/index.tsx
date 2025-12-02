import { Wifi } from 'lucide-react';
import { Plugin } from '../../core/types';
import NetWar from './NetWar';


export const NetWarfarePlugin: Plugin = {
    id: 'net_warfare',
    name: 'net.plugin_name', // This needs to be dynamic, but Plugin interface expects string. 
    // Usually plugins are defined as objects. If I want to translate the name, I might need to change how plugins are registered or used.
    // However, looking at Layout.tsx, it uses t(plugin.name) or similar?
    // Let's check Layout.tsx again.
    icon: Wifi,
    component: NetWar,
};

import { Activity } from 'lucide-react';
import { Plugin } from '../../core/types';
import SysOverview from './SysOverview';

export const SysOverviewPlugin: Plugin = {
    id: 'sys_overview',
    name: 'Sys_Overview',
    icon: Activity,
    component: SysOverview,
};

import { Briefcase } from 'lucide-react';
import { Plugin } from '../../core/types';
import MissionHub from './MissionHub';

const WrappedMissionHub = () => (
    <MissionHub />
);

export const MissionsPlugin: Plugin = {
    id: 'missions',
    name: 'mission.plugin_name',
    icon: Briefcase,
    component: WrappedMissionHub,
};

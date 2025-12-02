import { Briefcase } from 'lucide-react';
import { Plugin } from '../../core/types';
import MissionHub from './MissionHub';

const WrappedMissionHub = () => (
    <MissionHub />
);

export const MissionsPlugin: Plugin = {
    id: 'missions',
    name: 'Missions',
    icon: Briefcase,
    component: WrappedMissionHub,
};

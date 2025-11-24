import { Briefcase } from 'lucide-react';
import { Plugin } from '../../core/types';
import MissionHub from './MissionHub';

const WrappedMissionHub = () => (
    <MissionHub />
);

export const ContractsPlugin: Plugin = {
    id: 'contracts',
    name: 'Contracts',
    icon: Briefcase,
    component: WrappedMissionHub,
};

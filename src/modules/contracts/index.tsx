import { Briefcase } from 'lucide-react';
import { Plugin } from '../../core/types';
import MissionHub from './MissionHub';
import { MissionsProvider } from './MissionsContext';

const WrappedMissionHub = () => (
    <MissionsProvider>
        <MissionHub />
    </MissionsProvider>
);

export const ContractsPlugin: Plugin = {
    id: 'contracts',
    name: 'Contracts',
    icon: Briefcase,
    component: WrappedMissionHub,
};

import { Eye } from 'lucide-react';
import { Plugin } from '../../core/types';
import CamGrid from './CamGrid';

export const SurveillancePlugin: Plugin = {
    id: 'surveillance',
    name: 'Surveillance',
    icon: Eye,
    component: CamGrid,
};

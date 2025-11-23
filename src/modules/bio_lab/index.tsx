import { lazy } from 'react';
import { Plugin } from '../../core/types';
import { Dna } from 'lucide-react';

const BioLab = lazy(() => import('./BioLab'));

export const BioLabPlugin: Plugin = {
    id: 'bio_lab',
    name: 'BIO_LAB',
    component: BioLab,
    icon: Dna
};

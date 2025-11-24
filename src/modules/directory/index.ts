import { lazy } from 'react';
import { FileText } from 'lucide-react';

const Directory = lazy(() => import('./Directory'));

export const DirectoryPlugin = {
    id: 'directory',
    name: 'directory.title',
    component: Directory,
    icon: FileText
};

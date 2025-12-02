import { lazy } from 'react';
import { FileText } from 'lucide-react';

const Directory = lazy(() => import('./Directory'));

export const DirectoryPlugin = {
    id: 'directory',
    name: 'dir.title',
    component: Directory,
    icon: FileText
};

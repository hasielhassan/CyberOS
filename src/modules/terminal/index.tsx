import { Terminal } from 'lucide-react';
import { Plugin } from '../../core/types';
import TerminalConsole from './Terminal';

export const TerminalPlugin: Plugin = {
    id: 'terminal',
    name: 'Terminal_Bash',
    icon: Terminal,
    component: TerminalConsole,
};

import { Lock } from 'lucide-react';
import { Plugin } from '../../core/types';
import Decryptor from './Decryptor';

export const DecryptionPlugin: Plugin = {
    id: 'decryption',
    name: 'dec.plugin_name',
    icon: Lock,
    component: Decryptor,
};

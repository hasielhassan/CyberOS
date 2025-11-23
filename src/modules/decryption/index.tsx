import { Lock } from 'lucide-react';
import { Plugin } from '../../core/types';
import Decryptor from './Decryptor';

export const DecryptionPlugin: Plugin = {
    id: 'decryption',
    name: 'Decryption',
    icon: Lock,
    component: Decryptor,
};

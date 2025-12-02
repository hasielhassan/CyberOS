import React from 'react';
import { useMissionEngine } from './hooks/useMissionEngine';

/**
 * This component is responsible for running the mission engine logic globally.
 * It does not render anything, but ensures that the useMissionEngine hook is always active,
 * listening for events and updating mission state regardless of the current view.
 */
export const GlobalMissionEngine: React.FC = () => {
    useMissionEngine();
    return null;
};

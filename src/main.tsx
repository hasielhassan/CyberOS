import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { PluginProvider, LanguageProvider, usePlugins } from './core/registry';
import { AuthProvider, useAuth } from './core/AuthContext';
import { Layout } from './core/Layout';
import { Login } from './core/Login';

// Import Plugins
import { SysOverviewPlugin } from './modules/sys_overview';
import { TerminalPlugin } from './modules/terminal';
import { GeoTrackerPlugin } from './modules/geo_tracker';
import { SatUplinkPlugin } from './modules/sat_uplink';
import { NetWarfarePlugin } from './modules/net_warfare';
import { DecryptionPlugin } from './modules/decryption';
import { ContractsPlugin } from './modules/contracts';
import { SurveillancePlugin } from './modules/surveillance';
import { BioLabPlugin } from './modules/bio_lab';
import { HealthMonitorPlugin } from './modules/health_monitor';

import { en } from './locales/en';
import { es } from './locales/es';

const App = () => {
    const { registerPlugin } = usePlugins();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Register all plugins
        registerPlugin(SysOverviewPlugin);
        registerPlugin(TerminalPlugin);
        registerPlugin(GeoTrackerPlugin);
        registerPlugin(SatUplinkPlugin);
        registerPlugin(NetWarfarePlugin);
        registerPlugin(DecryptionPlugin);
        registerPlugin(ContractsPlugin);
        registerPlugin(SurveillancePlugin);
        registerPlugin(BioLabPlugin);
        registerPlugin(HealthMonitorPlugin);
    }, []);

    return isAuthenticated ? <Layout /> : <Login />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <AuthProvider>
                <LanguageProvider initialLanguages={[en, es]}>
                    <PluginProvider>
                        <App />
                    </PluginProvider>
                </LanguageProvider>
            </AuthProvider>
        </HashRouter>
    </React.StrictMode>,
);

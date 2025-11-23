import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PluginProvider, LanguageProvider, usePlugins } from './core/registry';
import { Layout } from './core/Layout';

// Import Plugins
import { SysOverviewPlugin } from './modules/sys_overview';
import { TerminalPlugin } from './modules/terminal';
import { GeoTrackerPlugin } from './modules/geo_tracker';
import { SatUplinkPlugin } from './modules/sat_uplink';
import { NetWarfarePlugin } from './modules/net_warfare';
import { DecryptionPlugin } from './modules/decryption';
import { ContractsPlugin } from './modules/contracts';
import { SurveillancePlugin } from './modules/surveillance';

// Import Languages
import { en } from './locales/en';
import { es } from './locales/es';

const App = () => {
    const { registerPlugin } = usePlugins();

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
    }, []);

    return <Layout />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LanguageProvider initialLanguages={[en, es]}>
            <PluginProvider>
                <App />
            </PluginProvider>
        </LanguageProvider>
    </React.StrictMode>,
);

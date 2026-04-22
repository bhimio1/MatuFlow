/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  RefreshCw, 
  FileCode, 
  Settings, 
  Layout, 
  Check, 
  Copy, 
  Terminal,
  ExternalLink,
  Info,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

const DEFAULT_CSS = `/* ==UserStyle==
@name           matugen global styles
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    mine, not yours
@author         bhimio
==/UserStyle== */

:root {
    /* Primary Colors */
    --primary: #C9D5EB;
    --on-primary: #3A4A62;
    --primary-container: #B7C7E5;
    --on-primary-container: #314159;
    --inverse-primary: #506079;
    --primary-fixed: #B7C7E5;
    --primary-fixed-dim: #A9B9D6;
    --on-primary-fixed: #1D2C43;
    --on-primary-fixed-variant: #3A4A62;

    /* Secondary Colors */
    --secondary: #BDC9C0;
    --on-secondary: #38433C;
    --secondary-container: #1E2822;
    --on-secondary-container: #9BA69E;
    --secondary-fixed: #E8F4EA;
    --secondary-fixed-dim: #D9E5DC;
    --on-secondary-fixed: #3F4B43;
    --on-secondary-fixed-variant: #5B675F;

    /* Tertiary Colors */
    --tertiary: #EAFBEB;
    --on-tertiary: #3D664C;
    --tertiary-container: #C2F4D0;
    --on-tertiary-container: #375D45;
    --tertiary-fixed: #C2F4D0;
    --tertiary-fixed-dim: #B4E6C2;
    --on-tertiary-fixed: #2B4A36;
    --on-tertiary-fixed-variant: #3F684D;

    /* Surface & Background */
    --background: #0A0E15;
    --on-background: #E0E5F3;
    --surface: #0A0E15;
    --on-surface: #E0E5F3;
    --surface-variant: #1E2633;
    --on-surface-variant: #A4ABBC;
    --surface-dim: #0A0E15;
    --surface-bright: #242D3B;
    --surface-container-lowest: #000000;
    --surface-container-low: #0F141C;
    --surface-container: #141A23;
    --surface-container-high: #19202B;
    --surface-container-highest: #1E2633;
    --inverse-surface: #FBF9FC;
    --inverse-on-surface: #51555D;
    --surface-tint: #C9D5EB;

    /* Error Colors */
    --error: #DE8680;
    --on-error: #3D1110;
    --error-container: #75312F;
    --on-error-container: #E4A5A1;

    /* Outline & Misc */
    --outline: #6D7585;
    --outline-variant: #404956;
    --shadow: #000000;
    --scrim: #000000;
}`;

export default function App() {
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'settings'>('preview');
  const [copied, setCopied] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  // Parse CSS variables from root
  const variables = useMemo(() => {
    const vars: Record<string, string> = {};
    const regex = /--([\w-]+):\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(cssCode)) !== null) {
      vars[`--${match[1]}`] = match[2].trim();
    }
    return vars;
  }, [cssCode]);

  const fetchThemeFromServer = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/theme');
      const data = await response.json();
      if (data.css) {
        setCssCode(data.css);
        setLastSync(new Date(data.updatedAt).toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to fetch theme from RAM:", err);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchThemeFromServer();
  }, [fetchThemeFromServer]);

  // Inject variables into :root
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(variables).forEach(([name, value]) => {
      root.style.setProperty(name, value as string);
    });
  }, [variables]);

  const handleSync = () => {
    fetchThemeFromServer();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex text-[var(--on-surface)] selection:bg-[var(--primary-container)] selection:text-[var(--on-primary-container)]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[var(--background)] transition-colors duration-500 -z-10" />

      {/* Nav Rail Sidebar (Bold Typography Style) */}
      <nav className="w-20 md:w-24 flex-shrink-0 flex flex-col items-center py-6 border-r border-[var(--outline-variant)] bg-[var(--surface-container)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] flex items-center justify-center mb-10 shadow-lg shadow-[var(--primary)]/20">
          <Palette className="text-[var(--on-primary)] w-6 h-6" />
        </div>

        <div className="space-y-4">
          <NavRailItem 
            active={activeTab === 'preview'} 
            onClick={() => setActiveTab('preview')}
            icon={<Layout className="w-6 h-6" />}
          />
          <NavRailItem 
            active={activeTab === 'editor'} 
            onClick={() => setActiveTab('editor')}
            icon={<FileCode className="w-6 h-6" />}
          />
          <NavRailItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Settings className="w-6 h-6" />}
          />
        </div>

        <div className="mt-auto">
          <div className="p-1 rounded-full bg-[var(--primary-container)]">
             <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header (Simplified for Bold Style) */}
        <header className="h-20 flex items-center justify-between px-10 bg-transparent">
          <div className="flex items-center gap-3">
             <div className="status-badge">Theme Engine v2.4</div>
             <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest hidden sm:block">Update Cycle: Auto</div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
               Docs
            </button>
            <div className="w-1 h-1 rounded-full bg-[var(--outline)]" />
            <span className="text-xs font-mono tabular-nums opacity-60">{lastSync}</span>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto px-10 pb-10 max-w-7xl w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="flex flex-col gap-12"
              >
                {/* Hero Section */}
                <div className="pt-4">
                  <h1 className="hero-title">
                    Variables<br />Synced.
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Configuration Card */}
                  <div className="md3-card">
                    <h2 className="card-label">Source Configuration</h2>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center group">
                        <span className="font-medium">Live Injection</span>
                        <Toggle active />
                      </div>
                      
                      <div className="space-y-2">
                         <p className="text-xs font-bold uppercase opacity-50">Target Theme File</p>
                         <div className="p-4 rounded-xl bg-[var(--surface-container-highest)] font-mono text-sm border border-[var(--outline-variant)]">
                            ~/.cache/wal/colors.css
                         </div>
                      </div>

                      <div className="flex justify-between items-center">
                         <div className="space-y-1">
                            <p className="text-xs font-bold uppercase opacity-50">Interval</p>
                            <p className="font-semibold">Auto-detecting changes</p>
                         </div>
                         <button 
                           onClick={handleSync}
                           className="md3-button-primary"
                         >
                           Refresh Now
                         </button>
                      </div>
                    </div>
                  </div>

                  {/* Variables Preview Card */}
                  <div className="md3-card">
                    <h2 className="card-label">Detected Variables ({Object.keys(variables).length})</h2>
                    <div className="space-y-1 overflow-y-auto max-h-[360px] pr-2 custom-scrollbar">
                      {Object.entries(variables).slice(0, 12).map(([name, val]) => (
                        <div key={name} className="variable-row border-b border-black/5 last:border-0 py-4 hover:bg-[var(--primary)]/5 px-2 rounded-xl transition-colors">
                           <span className="font-mono text-xs text-[var(--primary)] font-bold">{name}</span>
                           <div 
                             className="w-6 h-6 rounded-md shadow-inner border border-black/10" 
                             style={{ backgroundColor: val }}
                           />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Component Showcase - Large */}
                  <div className="md3-card lg:col-span-2 flex flex-col md:flex-row gap-8 items-center bg-[var(--primary-container)] text-[var(--on-primary-container)] border-none">
                     <div className="flex-grow space-y-4">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Theme Inheritance Test</h3>
                        <p className="opacity-80 leading-relaxed max-w-xl">
                          All components below are inheriting the root context. 
                          The primary container background and on-container text are applied here.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                           <button className="bg-[var(--on-primary-container)] text-[var(--primary-container)] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl shadow-[var(--shadow)]/10">
                              Primary Action
                           </button>
                           <button className="border-2 border-[var(--on-primary-container)] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest">
                              Outline View
                           </button>
                        </div>
                     </div>
                     <div className="w-full md:w-64 h-48 rounded-3xl bg-[var(--surface)] p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-4 left-4 w-12 h-1.5 rounded-full bg-[var(--primary)]" />
                        <div className="mt-8 space-y-3">
                           <div className="h-2 w-3/4 rounded-full bg-[var(--outline)] opacity-20" />
                           <div className="h-2 w-1/2 rounded-full bg-[var(--outline)] opacity-20" />
                           <div className="h-2 w-5/6 rounded-full bg-[var(--outline)] opacity-20" />
                        </div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--primary-container)] shadow-lg shadow-[var(--shadow)]/10" />
                     </div>
                  </div>
                </div>

                <footer className="pt-12 text-[10px] font-bold uppercase tracking-widest opacity-30 text-right">
                  Root Injection Active on ALL Tabs • Version 2.4.0
                </footer>
              </motion.div>
            )}

            {activeTab === 'editor' && (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full pt-4"
              >
                <div className="md3-card h-[600px] flex flex-col p-0 overflow-hidden border-2 border-black/10">
                  <div className="px-6 py-4 bg-white/50 backdrop-blur border-b border-black/5 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Matugen Source Editor</span>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500" />
                       <span className="text-[10px] font-bold opacity-40">AUTO-SAVE</span>
                    </div>
                  </div>
                  <textarea 
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    className="flex-grow p-8 font-mono text-xs md:text-sm bg-transparent focus:outline-none resize-none leading-relaxed"
                    placeholder="Paste or type CSS variables..."
                  />
                  <div className="p-6 bg-white/50 backdrop-blur border-t border-black/5 flex justify-end gap-4">
                    <button 
                       onClick={() => setCssCode(DEFAULT_CSS)}
                       className="text-xs font-bold uppercase px-4 py-2 hover:bg-black/5 rounded-lg transition-colors"
                    >
                      Reset File
                    </button>
                    <button className="md3-button-primary">Push Update</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="md3-card col-span-full">
                   <h2 className="card-label">Global Web Injection</h2>
                   <div className="bg-[var(--primary-container)] text-[var(--on-primary-container)] p-6 rounded-2xl border-none flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-grow">
                         <h3 className="text-xl font-black uppercase mb-2">Extension Active</h3>
                         <p className="text-sm opacity-80 mb-4">
                            You are currently viewing the MatuFlow dashboard directly from your browser extension. 
                            Injection is active on all open tabs.
                         </p>
                         <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-2 rounded-lg">
                               <Check className="w-4 h-4" /> manifest.json ready
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-2 rounded-lg">
                               <Check className="w-4 h-4" /> inject.js ready
                            </div>
                         </div>
                      </div>
                      <div className="flex-shrink-0 w-full md:w-auto">
                         <ol className="text-xs space-y-2 font-medium opacity-90 list-decimal list-inside">
                            <li>Download project ZIP</li>
                            <li>Go to <code>chrome://extensions</code></li>
                            <li>Enable <b>Developer Mode</b></li>
                            <li>Click <b>Load Unpacked</b></li>
                            <li>Select the <code>/extension</code> folder</li>
                         </ol>
                      </div>
                   </div>
                </div>

                <div className="md3-card col-span-full">
                  <h2 className="card-label">Python Bridge Service</h2>
                  <div className="bg-[var(--surface-container-highest)] p-6 rounded-2xl border border-black/5">
                    <p className="text-sm opacity-70 mb-4">
                      Download <strong>bridge.py</strong> and run it locally to sync your system theme. 
                      It uses the standard library for zero dependencies.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div className="bg-black/20 p-4 rounded-xl font-mono text-xs overflow-x-auto selection:bg-white/10">
                          <p className="text-[var(--primary)] mb-2"># Post-theme (Matugen)</p>
                          <pre className="text-[var(--on-surface-variant)]">
                             python3 bridge.py --reload --file path/to/css
                          </pre>
                       </div>
                       <div className="bg-black/20 p-4 rounded-xl font-mono text-xs overflow-x-auto selection:bg-white/10">
                          <p className="text-[var(--primary)] mb-2"># Background Service</p>
                          <pre className="text-[var(--on-surface-variant)]">
                             python3 bridge.py --watch
                          </pre>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                       <Terminal className="w-4 h-4" />
                       ROOT API: {window.location.origin}/api/bridge/reload
                    </div>
                  </div>
                </div>

                <div className="md3-card">
                  <h2 className="card-label">App Behavior</h2>
                  <div className="space-y-4">
                    <ToggleItem label="Force Root Proxy" />
                    <ToggleItem label="Bypass CSP" active />
                    <ToggleItem label="Silent Syncing" />
                  </div>
                </div>

                <div className="md3-card border-red-500/10 bg-red-500/5">
                  <h2 className="card-label text-red-500">Danger Zone</h2>
                  <p className="text-sm font-medium mb-6 opacity-70">
                    Irreversible actions related to the local filesystem bridge.
                  </p>
                  <button className="w-full bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                     Kill Theme Bridge [PID: 4812]
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Persistent Copy Action */}
      <button 
        onClick={handleCopy}
        className="fixed bottom-10 right-10 w-14 h-14 rounded-2xl bg-[var(--primary)] text-[var(--on-primary)] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
        <div className="absolute right-full mr-4 px-3 py-1 rounded-lg bg-[var(--on-surface)] text-[var(--surface)] text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase">
           Copy Config
        </div>
      </button>
    </div>
  );
}

function NavRailItem({ active, icon, onClick }: { active: boolean; icon: ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
        ${active ? 'bg-[var(--primary-container)] text-[var(--md-primary)]' : 'hover:bg-[var(--surface-container-high)] text-[var(--on-surface)] opacity-60'}
      `}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
        {icon}
      </div>
      {active && (
        <motion.div 
          layoutId="rail-indicator"
          className="absolute inset-0 bg-[var(--primary)]/5 rounded-2xl -z-10"
        />
      )}
    </button>
  );
}

function SettingsBlock({ title, value }: { title: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--surface-container-highest)] border border-black/5">
      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function ToggleItem({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-black/5 last:border-0 hover:bg-black/[0.02] px-2 -mx-2 rounded-lg transition-colors">
      <span className="text-sm font-semibold">{label}</span>
      <Toggle active={active} />
    </div>
  );
}

function Toggle({ active = false }: { active?: boolean }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <button 
      onClick={() => setIsOn(!isOn)}
      className={`w-13 h-8 rounded-full p-1 transition-colors duration-300 relative
        ${isOn ? 'bg-[var(--primary)]' : 'bg-black/10'}
      `}
    >
      <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

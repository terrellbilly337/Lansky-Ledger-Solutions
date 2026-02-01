
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Shield, Lock, Unlock, X, Save, Database, Layout, Type, Code } from 'lucide-react';

interface MasterConsoleProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onClose: () => void;
  rawState: any;
  setRawState: (state: any) => void;
}

const MasterConsole: React.FC<MasterConsoleProps> = ({ settings, setSettings, onClose, rawState, setRawState }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activePanel, setActivePanel] = useState<'identity' | 'data'>('identity');
  const [jsonText, setJsonText] = useState(JSON.stringify(rawState, null, 2));

  const MASTER_PASSWORD = "LanskyAdmin"; // Default Back Door Key

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Key');
      setPassword('');
    }
  };

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System identity updated.');
  };

  const handleSaveData = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setRawState(parsed);
      alert('System state injected successfully.');
    } catch (e) {
      alert('Invalid JSON structure.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="max-w-md w-full p-10 bg-slate-900 border border-slate-800 rounded-[40px] text-center shadow-2xl shadow-blue-900/20">
          <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 ring-1 ring-blue-500/20">
            <Shield size={40} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Master Authentication</h2>
          <p className="text-slate-500 text-sm font-medium mb-8">Enter the secure administrative bypass key.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS KEY"
                className="w-full pl-12 pr-4 py-4 bg-black border border-slate-800 rounded-2xl text-white font-mono tracking-widest focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            {error && <p className="text-rose-500 text-xs font-black uppercase tracking-widest animate-pulse">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20">
              INITIATE BYPASS
            </button>
            <button onClick={onClose} type="button" className="text-slate-600 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors">
              ABORT SEQUENCE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-500">
      <div className="max-w-6xl w-full h-[85vh] bg-slate-950 border border-slate-800 rounded-[48px] overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/10">
        <header className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
              <Unlock size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase">Master Control Center</h1>
              <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">Security Level: Root Access</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Internal Sidebar */}
          <nav className="w-64 border-r border-slate-800 p-6 space-y-3 bg-black/20">
            <button 
              onClick={() => setActivePanel('identity')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activePanel === 'identity' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-900'}`}
            >
              <Layout size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Identity</span>
            </button>
            <button 
              onClick={() => setActivePanel('data')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activePanel === 'data' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-900'}`}
            >
              <Database size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Data Vault</span>
            </button>
          </nav>

          {/* Main Console Content */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
            {activePanel === 'identity' ? (
              <div className="max-w-2xl space-y-10">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-blue-500">
                      <Type size={20} />
                      <h3 className="font-black uppercase tracking-widest text-sm">Application Identity</h3>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">App Display Name</label>
                      <input 
                        type="text"
                        value={settings.appName}
                        onChange={(e) => setSettings(s => ({ ...s, appName: e.target.value }))}
                        className="w-full p-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-blue-600 font-bold"
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-blue-500">
                      <Code size={20} />
                      <h3 className="font-black uppercase tracking-widest text-sm">Branding Injection (SVG)</h3>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Custom SVG Code</label>
                      <textarea 
                        value={settings.logoSvgOverride || ''}
                        onChange={(e) => setSettings(s => ({ ...s, logoSvgOverride: e.target.value }))}
                        placeholder="Paste <svg>...</svg> here to override logo"
                        className="w-full h-48 p-4 bg-black border border-slate-800 rounded-2xl text-slate-300 font-mono text-xs outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                      />
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <Database size={20} />
                    <h3 className="font-black uppercase tracking-widest text-sm">System State Editor</h3>
                  </div>
                  <button 
                    onClick={handleSaveData}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <Save size={16} /> INJECT STATE
                  </button>
                </div>
                <div className="flex-1 bg-black rounded-3xl border border-slate-800 p-4 relative overflow-hidden group">
                  <textarea 
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full h-full bg-transparent text-emerald-500/80 font-mono text-xs outline-none resize-none custom-scrollbar"
                  />
                  <div className="absolute top-4 right-4 text-[9px] font-black text-slate-700 bg-black/50 px-2 py-1 rounded-md pointer-events-none uppercase">Direct Access Node</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="px-10 py-6 border-t border-slate-800 bg-black/40 flex items-center justify-between">
           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">
              <Shield size={12} className="text-emerald-900" /> Administrative session persistent until close
           </p>
           <button onClick={onClose} className="px-8 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs transition-all">
              SECURE LOGOUT
           </button>
        </footer>
      </div>
    </div>
  );
};

export default MasterConsole;

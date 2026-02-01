
import React, { useState } from 'react';
import { AppSettings, Sale, InventoryItem, Expense } from '../types';
import { COLORS } from '../constants';
import { 
  Plus, Trash2, Palette, List, AlertCircle, HelpCircle, 
  Download, Moon, Sun, Scale, Database, ShieldAlert,
  ChevronDown, ChevronUp, BookOpen, Sparkles
} from 'lucide-react';
import { exportToCSV } from '../utils/dataUtils';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSeedData: () => void;
  onClearData: () => void;
  sales: Sale[];
  inventory: InventoryItem[];
  expenses: Expense[];
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, onSeedData, onClearData, sales, inventory, expenses }) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [openSection, setOpenSection] = useState<string | null>('help');

  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

  const Section = ({ id, icon, title, children }: any) => (
    <div className={`rounded-[32px] border overflow-hidden transition-all duration-300 ${settings.theme === 'dark' ? 'bg-[#020617] border-slate-800' : 'bg-white border-slate-300 shadow-sm'}`}>
      <button 
        onClick={() => toggleSection(id)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-500/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${settings.theme === 'dark' ? 'bg-slate-900 text-primary' : 'bg-slate-100 text-primary'}`}>
            {icon}
          </div>
          <h3 className={`text-lg font-black tracking-tight ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>{title}</h3>
        </div>
        {openSection === id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {openSection === id && <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tighter ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Settings</h1>
          <p className={`${settings.theme === 'dark' ? 'text-slate-400' : 'text-slate-700'} font-black mt-1`}>Configure your workspace and legal compliance.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setSettings(s => ({ ...s, inspectionMode: !s.inspectionMode }))}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${settings.inspectionMode ? 'bg-blue-900 text-white shadow-xl' : 'bg-slate-200 text-black'}`}
          >
            <HelpCircle size={18} />
            {settings.inspectionMode ? 'Hint Mode On' : 'Hint Mode Off'}
          </button>
          <button 
            onClick={() => setSettings(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
            className={`p-3 rounded-2xl transition-all shadow-xl ${settings.theme === 'dark' ? 'bg-amber-600 text-white' : 'bg-black text-white'}`}
          >
            {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Help & Guide Section */}
        <Section id="help" title="Help & User Guide" icon={<BookOpen size={20} />}>
          <div className={`space-y-6 ${settings.theme === 'dark' ? 'text-slate-200' : 'text-black'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className={`font-black uppercase text-xs tracking-widest ${settings.theme === 'dark' ? 'text-primary' : 'text-black'}`}>1. Add Inventory First</h4>
                <p className="text-sm leading-relaxed font-bold">Start in the <b>Inventory Stock</b> tab. Record your buy price and date. This tracks your invested capital.</p>
              </div>
              <div className="space-y-4">
                <h4 className={`font-black uppercase text-xs tracking-widest ${settings.theme === 'dark' ? 'text-primary' : 'text-black'}`}>2. Move to Sales</h4>
                <p className="text-sm leading-relaxed font-bold">When an item sells, click the <b>Sell</b> button on the item card. Enter the final sale details, and the app calculates your net profit automatically.</p>
              </div>
              <div className="space-y-4">
                <h4 className={`font-black uppercase text-xs tracking-widest ${settings.theme === 'dark' ? 'text-primary' : 'text-black'}`}>3. Track Expenses</h4>
                <p className="text-sm leading-relaxed font-bold">Log supplies like boxes, gas, or software in the <b>Expenses</b> tab. These are subtracted from your total business income for tax accuracy.</p>
              </div>
              <div className="space-y-4">
                <h4 className={`font-black uppercase text-xs tracking-widest ${settings.theme === 'dark' ? 'text-primary' : 'text-black'}`}>4. AI Business Advisor</h4>
                <p className="text-sm leading-relaxed font-bold">Once you have enough data, visit the <b>AI Advisor</b>. It uses high-performance reasoning to find ways for you to scale your profits.</p>
              </div>
            </div>
            <div className={`p-5 rounded-2xl border ${settings.theme === 'dark' ? 'bg-primary/20 border-primary/40 text-primary-light' : 'bg-blue-100 border-blue-300 text-blue-900'}`}>
              <p className="text-xs font-black leading-relaxed">
                <AlertCircle className="inline-block mr-2" size={14} /> 
                <b>Pro Tip:</b> Use the clickable <b>?</b> in the header to enable "Hint Mode". Hovering over dashboard metrics will explain how they are calculated.
              </p>
            </div>
          </div>
        </Section>

        {/* Customization */}
        <Section id="visual" title="Visual Theme & Customization" icon={<Palette size={20} />}>
          <div className="space-y-8">
            <div>
              <p className={`text-xs font-black uppercase tracking-widest mb-4 ${settings.theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>Vibrant Accent Color</p>
              <div className="flex flex-wrap gap-4">
                {COLORS.map(c => (
                  <button 
                    key={c.value}
                    onClick={() => setSettings(s => ({ ...s, primaryColor: c.value }))}
                    className={`w-12 h-12 rounded-2xl transition-all ${settings.primaryColor === c.value ? 'ring-4 ring-offset-4 ring-black shadow-2xl scale-110' : 'hover:scale-105 opacity-80'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-4 ${settings.theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>Sales Platforms</p>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newPlatform} 
                    onChange={e => setNewPlatform(e.target.value)} 
                    placeholder="Add..." 
                    className={`flex-1 px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-primary ${settings.theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  />
                  <button onClick={() => { if(newPlatform){ setSettings(s => ({...s, platforms: [...s.platforms, newPlatform]})); setNewPlatform(''); } }} className="px-5 bg-black text-white rounded-xl hover:scale-105 transition-all font-black shadow-lg">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.platforms.map(p => (
                    <div key={p} className={`flex items-center gap-3 px-4 py-2 rounded-full border ${settings.theme === 'dark' ? 'bg-black border-slate-700 text-white' : 'bg-white border-slate-300 text-black shadow-sm'}`}>
                      <span className="text-xs font-black">{p}</span>
                      <button onClick={() => setSettings(s => ({...s, platforms: s.platforms.filter(i => i !== p)}))} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-4 ${settings.theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>Expense Categories</p>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)} 
                    placeholder="Add..." 
                    className={`flex-1 px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-primary ${settings.theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  />
                  <button onClick={() => { if(newCategory){ setSettings(s => ({...s, expenseCategories: [...s.expenseCategories, newCategory]})); setNewCategory(''); } }} className="px-5 bg-black text-white rounded-xl hover:scale-105 transition-all font-black shadow-lg">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.expenseCategories.map(c => (
                    <div key={c} className={`flex items-center gap-3 px-4 py-2 rounded-full border ${settings.theme === 'dark' ? 'bg-black border-slate-700 text-white' : 'bg-white border-slate-300 text-black shadow-sm'}`}>
                      <span className="text-xs font-black">{c}</span>
                      <button onClick={() => setSettings(s => ({...s, expenseCategories: s.expenseCategories.filter(i => i !== c)}))} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Data Controls */}
        <Section id="data" title="Data Management & Export" icon={<Database size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => exportToCSV(sales, inventory, expenses)}
              className="flex items-center justify-center gap-3 p-6 rounded-3xl bg-black text-white font-black hover:scale-105 transition-all shadow-xl shadow-black/20"
            >
              <Download size={20} /> Export CSV
            </button>
            <button 
              onClick={onSeedData}
              className="flex items-center justify-center gap-3 p-6 rounded-3xl bg-emerald-900 text-white font-black hover:scale-105 transition-all shadow-xl shadow-emerald-900/20"
            >
              <Sparkles size={20} /> Seed Demo Data
            </button>
            <button 
              onClick={onClearData}
              className={`flex items-center justify-center gap-3 p-6 rounded-3xl font-black transition-all shadow-lg ${settings.theme === 'dark' ? 'bg-rose-950 text-white hover:bg-rose-900' : 'bg-rose-100 text-rose-900 hover:bg-rose-200'}`}
            >
              <Trash2 size={20} /> Delete All Data
            </button>
          </div>
          <div className="mt-8 flex items-start gap-3 p-6 rounded-3xl bg-slate-200 dark:bg-slate-900 text-black dark:text-slate-300 border border-slate-300 dark:border-slate-800">
             <AlertCircle size={20} className="shrink-0" />
             <p className="text-xs font-black leading-relaxed uppercase tracking-wider">
               <b>Warning:</b> Exporting data to CSV is recommended before using "Delete All Data". All data is stored locally in your browser cache.
             </p>
          </div>
        </Section>

        {/* Legal Section */}
        <Section id="legal" title="Legal & Compliance" icon={<Scale size={20} />}>
          <div className={`space-y-6 text-sm leading-relaxed ${settings.theme === 'dark' ? 'text-slate-100' : 'text-black font-black'}`}>
            <div className={`p-8 rounded-[32px] border ${settings.theme === 'dark' ? 'bg-slate-950 border-slate-800 shadow-inner' : 'bg-white border-slate-300 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-rose-800" size={24} />
                <h4 className={`text-xl font-black ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>Anti-Resale & Rebranding Protection</h4>
              </div>
              <p className="mb-6">
                Lansky Ledger Solutions is a proprietary enterprise software platform. Rebranding, reselling, or unauthorized distribution of this software is strictly prohibited under the <b>Digital Millennium Copyright Act (DMCA)</b> and <b>The Copyright Act of 1976 (17 U.S.C. §§ 101-810)</b>. 
              </p>
              <p className="mb-6">
                Violation of these federal statutes may result in significant civil damages and criminal penalties. Users are granted a limited, non-transferable license for business use only. All UI elements, logic, and branding assets remain the sole intellectual property of <b>Lansky Ledger Solutions Inc</b>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${settings.theme === 'dark' ? 'bg-white/5 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                   <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Entity Protection</p>
                   <p className="text-[11px] font-black">15 U.S. Code Chapter 22 - Trademarks</p>
                </div>
                <div className={`p-4 rounded-2xl border ${settings.theme === 'dark' ? 'bg-white/5 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                   <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Software Logic</p>
                   <p className="text-[11px] font-black">Defend Trade Secrets Act (DTSA)</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-center font-black uppercase tracking-widest mt-10 text-slate-600">
              © 2025 Lansky Ledger Solutions. All Rights Reserved.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Settings;

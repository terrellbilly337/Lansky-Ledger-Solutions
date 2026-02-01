
import React, { useState } from 'react';
import { NAV_ITEMS, DEFAULT_LOGO_SVG } from '../constants';
import { Menu, X } from 'lucide-react';
import { AppSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: AppSettings;
  onTriggerMaster: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, settings, onTriggerMaster }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleVersionClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      onTriggerMaster();
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg shadow-md md:hidden ${settings.theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-black text-white'}`}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-68 border-r transition-transform duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${settings.theme === 'dark' ? 'bg-[#020617] border-slate-800' : 'bg-white border-slate-300'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Logo Header */}
          <div className={`p-8 border-b flex flex-col items-center ${settings.theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4 w-full">
              {/* Logo Icon */}
              <div 
                 className="text-primary w-12 h-12 shrink-0"
                 dangerouslySetInnerHTML={{ __html: settings.logoSvgOverride || DEFAULT_LOGO_SVG }}
              />
              
              {/* Logo Text Side-by-Side */}
              <div className="flex flex-col">
                <h1 className={`text-2xl font-black tracking-tighter leading-none ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {settings.appName}
                </h1>
                <div className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mt-1 opacity-80 whitespace-nowrap">
                  Ledger Solutions
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 mt-2 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-5 py-3.5 rounded-[22px] transition-all duration-300 group
                  ${activeTab === item.id 
                    ? 'bg-primary text-white font-black shadow-xl shadow-primary/30' 
                    : settings.theme === 'dark' 
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-black'}
                `}
              >
                <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-black tracking-tight">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6">
            <button 
              onClick={handleVersionClick}
              className={`${settings.theme === 'dark' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-black hover:bg-slate-900'} w-full rounded-[24px] p-5 text-center shadow-inner transition-colors group cursor-default`}
            >
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest font-black text-white">System: Active</span>
              </div>
              <p className="text-[9px] font-black text-slate-400 group-active:text-primary transition-colors">v2.5.0 ENTERPRISE</p>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

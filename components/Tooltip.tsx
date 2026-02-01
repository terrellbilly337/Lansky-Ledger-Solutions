
import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  hint: string;
  active: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ children, hint, active }) => {
  if (!active) return <>{children}</>;

  return (
    <div className="relative group/tooltip inline-block w-full">
      {children}
      <div className="absolute z-[100] hidden group-hover/tooltip:block bg-slate-900 text-white text-[10px] p-2 rounded-lg -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-48 shadow-xl border border-white/10 pointer-events-none">
        <div className="font-black mb-1 uppercase tracking-tighter text-blue-400">What's this?</div>
        {hint}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse pointer-events-none"></div>
    </div>
  );
};

export default Tooltip;

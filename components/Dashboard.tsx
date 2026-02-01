
import React from 'react';
import { Sale, InventoryItem, AppSettings } from '../types';
import { calculateMetrics, formatCurrency } from '../utils/dataUtils';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  ArrowRight, 
  Activity,
  Zap
} from 'lucide-react';
import Tooltip from './Tooltip';

interface DashboardProps {
  sales: Sale[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ sales, inventory, setActiveTab, settings }) => {
  const metrics = calculateMetrics(sales, inventory);
  
  const quarterlyData = Object.entries(
    sales.reduce((acc, sale) => {
      acc[sale.quarter] = (acc[sale.quarter] || 0) + sale.netProfit;
      return acc;
    }, {} as Record<string, number>)
  ).sort().map(([name, value]) => ({ name, value }));

  const activeInv = inventory.filter(i => i.status === 'available');

  const MetricCard = ({ title, value, icon, sub, colorClass, gradient, hint }: any) => (
    <Tooltip active={settings.inspectionMode} hint={hint}>
      <div className={`relative overflow-hidden p-7 rounded-[32px] border group hover:shadow-2xl transition-all duration-500 h-full ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-200 shadow-md'}`}>
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-30 blur-3xl ${gradient}`}></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className={`p-4 rounded-2xl shadow-xl ${colorClass}`}>
            {icon}
          </div>
          <Activity size={18} className={`${settings.theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} group-hover:text-primary transition-colors`} />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className={`text-3xl font-black mt-1 ${settings.theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>{value}</h3>
          <p className={`text-[11px] mt-4 font-black inline-block px-3 py-1.5 rounded-xl ${settings.theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-800'}`}>{sub}</p>
        </div>
      </div>
    </Tooltip>
  );

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tighter ${settings.theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>Dashboard</h1>
          <p className="text-slate-600 font-black mt-1">Real-time financial performance overview.</p>
        </div>
        <button 
          onClick={() => setActiveTab('inventory')}
          className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-[24px] font-black hover:scale-105 hover:bg-slate-900 transition-all shadow-2xl shadow-black/30 dark:bg-white dark:text-slate-950"
        >
          <Package size={22} /> Stock Inventory <ArrowRight size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Net Profit" 
          value={formatCurrency(metrics.totalNetProfit)} 
          icon={<Zap size={28} className="text-white" />}
          sub="Earnings after all deductions"
          colorClass="bg-indigo-900"
          gradient="bg-indigo-500"
          hint="Your total take-home pay after COGS, fees, and shipping."
        />
        <MetricCard 
          title="Revenue" 
          value={formatCurrency(metrics.totalRevenue)} 
          icon={<DollarSign size={28} className="text-white" />}
          sub="Total gross sales volume"
          colorClass="bg-emerald-900"
          gradient="bg-emerald-500"
          hint="The total amount of money collected from customers before any costs."
        />
        <MetricCard 
          title="Active Stock" 
          value={metrics.activeInventoryCount} 
          icon={<Package size={28} className="text-white" />}
          sub={`${formatCurrency(metrics.activeInventoryValue)} total cost`}
          colorClass="bg-amber-900"
          gradient="bg-amber-500"
          hint="Count of items currently listed and ready for sale."
        />
        <MetricCard 
          title="Margin" 
          value={`${metrics.avgMargin.toFixed(1)}%`} 
          icon={<TrendingUp size={28} className="text-white" />}
          sub="Business efficiency rating"
          colorClass="bg-rose-900"
          gradient="bg-rose-500"
          hint="The percentage of revenue that is kept as profit."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className={`p-8 rounded-[40px] border flex flex-col h-full ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className={`text-xl font-black ${settings.theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>New Stock</h3>
            <span className="bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Available</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeInv.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Package size={48} className="mx-auto mb-4 opacity-10" />
                <p className="font-black text-sm text-slate-400">Your inventory is empty</p>
                <button onClick={() => setActiveTab('inventory')} className="text-primary text-xs mt-3 font-black hover:underline">Add first item</button>
              </div>
            ) : (
              activeInv.slice(0, 8).map(item => (
                <div key={item.id} className={`group p-5 rounded-[24px] border border-transparent transition-all cursor-pointer hover:border-primary/30 ${settings.theme === 'dark' ? 'bg-slate-950 hover:bg-slate-800' : 'bg-slate-100 hover:bg-white hover:shadow-xl'}`} onClick={() => setActiveTab('inventory')}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className={`font-black text-sm line-clamp-1 ${settings.theme === 'dark' ? 'text-slate-100' : 'text-slate-950'}`}>{item.itemName}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase mt-1">{item.purchaseDate}</p>
                    </div>
                    <span className="font-black text-emerald-700 text-sm ml-4">{formatCurrency(item.purchasePrice)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full mt-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all ${settings.theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            Full Inventory
          </button>
        </div>

        <div className={`lg:col-span-2 p-10 rounded-[48px] border ${settings.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className={`text-2xl font-black ${settings.theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>Financial Growth</h3>
              <p className="text-slate-600 font-black text-sm mt-1">Quarterly net profit performance</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl">
              <div className="w-10 h-1 bg-primary rounded-full"></div>
              <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Live Trend</span>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quarterlyData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={settings.theme === 'dark' ? '#1e293b' : '#cbd5e1'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 900}} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                    backgroundColor: settings.theme === 'dark' ? '#020617' : '#ffffff',
                    color: settings.theme === 'dark' ? '#f8fafc' : '#020617'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--primary-color)" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

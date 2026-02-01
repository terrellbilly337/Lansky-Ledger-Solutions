
import React from 'react';
import { Sale, AppSettings } from '../types';
import { formatCurrency } from '../utils/dataUtils';
import { Trash2, ShoppingBag, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CHART_COLORS } from '../constants';

interface SalesLogProps {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  settings: AppSettings;
}

const SalesLog: React.FC<SalesLogProps> = ({ sales, onDeleteSale, settings }) => {
  const platformData = Object.entries(
    sales.reduce((acc, sale) => {
      acc[sale.platform] = (acc[sale.platform] || 0) + sale.netProfit;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const profitByMonth = Object.entries(
    sales.reduce((acc, sale) => {
      const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + sale.netProfit;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sales Ledger</h1>
        <p className="text-slate-500 font-medium">History of all sold inventory.</p>
      </header>

      {/* Visual Analytics integrated in Ledger */}
      {sales.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl"><BarChart2 size={20} /></div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Monthly Performance</h3>
             </div>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={profitByMonth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <Tooltip />
                      <Bar dataKey="value" fill="var(--primary-color)" radius={[6, 6, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><PieChartIcon size={20} /></div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Platform Profit</h3>
             </div>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Profit</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">
                    No sales history yet. Go to Inventory to sell your stock!
                  </td>
                </tr>
              ) : (
                sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-slate-800">{sale.date}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{sale.quarter}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 text-slate-400 rounded-lg"><ShoppingBag size={16} /></div>
                         <div>
                            <p className="text-sm font-black text-slate-800">{sale.itemName}</p>
                            {sale.description && <p className="text-xs text-slate-400 font-medium line-clamp-1">{sale.description}</p>}
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-light text-primary rounded-full text-[10px] font-black uppercase">
                        {sale.platform}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`text-base font-black ${sale.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(sale.netProfit)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => onDeleteSale(sale.id)}
                        className="text-slate-200 hover:text-rose-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesLog;

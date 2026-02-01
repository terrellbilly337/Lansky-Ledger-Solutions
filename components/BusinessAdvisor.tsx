
import React, { useState } from 'react';
import { Sale, Expense, InventoryItem } from '../types';
import { getBusinessAdvice } from '../services/geminiService';
import { Sparkles, Loader2, BrainCircuit, TrendingUp, Info } from 'lucide-react';

interface BusinessAdvisorProps {
  sales: Sale[];
  expenses: Expense[];
  inventory: InventoryItem[];
}

const BusinessAdvisor: React.FC<BusinessAdvisorProps> = ({ sales, expenses, inventory }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAdvice = async () => {
    setLoading(true);
    const summary = `
      Total Sales: ${sales.length}
      Total Revenue: $${sales.reduce((sum, s) => sum + s.salePrice, 0).toFixed(2)}
      Total Profit: $${sales.reduce((sum, s) => sum + s.netProfit, 0).toFixed(2)}
      Active Inventory: ${inventory.filter(i => i.status === 'available').length} items
      Inventory Value (Cost): $${inventory.filter(i => i.status === 'available').reduce((sum, i) => sum + i.purchasePrice, 0).toFixed(2)}
      Total Expenses: $${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
    `;
    
    const result = await getBusinessAdvice(summary);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          AI Business Advisor <Sparkles className="text-primary animate-pulse" />
        </h1>
        <p className="text-slate-500 font-medium">Actionable insights from your ledger data.</p>
      </header>

      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
        {!advice && !loading ? (
          <div className="max-w-md">
            <div className="w-20 h-20 bg-primary-light text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BrainCircuit size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">Analyze Your Business</h2>
            <p className="text-slate-500 font-medium mb-8">
              Gemini will examine your sales history, current stock, and expenses to find patterns and suggest improvements.
            </p>
            <button 
              onClick={generateAdvice}
              className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary-light flex items-center justify-center gap-3"
            >
              Consult the AI <TrendingUp size={24} />
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center">
            <Loader2 size={64} className="text-primary animate-spin mb-6" />
            <h2 className="text-xl font-black text-slate-800">Processing Data...</h2>
            <p className="text-slate-400 font-medium">Our AI is crunching the numbers for you.</p>
          </div>
        ) : (
          <div className="w-full text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><Info size={20} /></div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">Business Intelligence Report</h3>
             </div>
             <div className="prose prose-slate max-w-none text-slate-700">
                <div dangerouslySetInnerHTML={{ __html: advice?.replace(/\*\*(.*?)\*\*/g, '<b class="text-slate-900 font-black">$1</b>').replace(/\n/g, '<br/>') || '' }} />
             </div>
             <button 
              onClick={() => setAdvice(null)}
              className="mt-12 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-colors"
            >
              Run New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAdvisor;


import React from 'react';
import { Sale, Expense } from '../types';
import { formatCurrency } from '../utils/dataUtils';
import { Download, FileBarChart, Calculator, AlertCircle } from 'lucide-react';

interface TaxReportsProps {
  sales: Sale[];
  expenses: Expense[];
}

const TaxReports: React.FC<TaxReportsProps> = ({ sales, expenses }) => {
  const grossReceipts = sales.reduce((sum, s) => sum + s.salePrice, 0);
  const cogs = sales.reduce((sum, s) => sum + s.purchasePrice, 0);
  const platformFees = sales.reduce((sum, s) => sum + s.fees, 0);
  const shippingCosts = sales.reduce((sum, s) => sum + s.shippingPaid, 0);

  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  // Fix: Cast values to number array to avoid 'unknown' type errors when applying arithmetic operations (Line 23)
  const totalOtherExpenses = (Object.values(expensesByCategory) as number[]).reduce((sum, val) => sum + val, 0);
  // Fix: Ensure totalOtherExpenses is treated as number for subtraction (Line 24)
  const netBusinessIncome = grossReceipts - cogs - platformFees - shippingCosts - totalOtherExpenses;

  const exportData = () => {
    const csvRows = [
      ['Date', 'Item Name', 'Platform', 'Sale Price', 'Buy Price', 'Fees', 'Shipping', 'Net Profit'],
      ...sales.map(s => [s.date, s.itemName, s.platform, s.salePrice, s.purchasePrice, s.fees, s.shippingPaid, s.netProfit])
    ];
    
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `lansky_ledger_full_export_${new Date().getFullYear()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tax Prep (Schedule C)</h1>
          <p className="text-slate-500 mt-1">Aggregated totals for your annual tax return.</p>
        </div>
        <button 
          onClick={exportData}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Download size={18} />
          Export Full Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue and COGS */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-blue-600" /> Income & Direct Costs
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Line 1: Gross Receipts / Sales</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(grossReceipts)}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Line 4: Cost of Goods Sold (COGS)</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(cogs)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-slate-50 px-4 rounded-xl mt-2">
                <span className="text-slate-800 font-bold">Gross Profit</span>
                <span className="text-xl font-black text-blue-600">{formatCurrency(grossReceipts - cogs)}</span>
              </div>
            </div>
          </div>

          {/* Deductible Expenses */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileBarChart size={20} className="text-amber-600" /> Operating Deductions
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Platform Selling Fees</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(platformFees)}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Shipping & Logistics Costs</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(shippingCosts)}</span>
              </div>
              {/* Fix: Explicitly cast amt to number for formatCurrency compatibility (Line 100) */}
              {Object.entries(expensesByCategory).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between items-center py-4 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">{cat}</span>
                  <span className="text-lg font-bold text-slate-800">{formatCurrency(amt as number)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-100">
            <h3 className="text-lg font-bold opacity-80 mb-2">Estimated Net Income</h3>
            <div className="text-4xl font-black mb-4">
              {formatCurrency(netBusinessIncome)}
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              This is your taxable business income after subtracting all recorded expenses and costs.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
            <div className="flex gap-3">
              <AlertCircle className="text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Tax Tip</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Keep digital receipts for all expenses logged. If you use your car for sourcing, ensure you track your mileage separately for Line 9 (Car and truck expenses).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxReports;

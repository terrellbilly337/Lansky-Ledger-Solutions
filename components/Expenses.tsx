
import React, { useState } from 'react';
import { Expense, AppSettings } from '../types';
import { formatCurrency } from '../utils/dataUtils';
import { Plus, Trash2, Receipt, Calendar, Tag, FileText } from 'lucide-react';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: any) => void;
  onDeleteExpense: (id: string) => void;
  settings: AppSettings;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAddExpense, onDeleteExpense, settings }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Use the first category from settings as default
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: settings.expenseCategories[0] || 'Other',
    amount: 0,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: settings.expenseCategories[0] || 'Other',
      amount: 0,
      description: ''
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Expenses</h1>
          <p className="text-slate-500 mt-1">Track overhead and sourcing costs.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100"
        >
          <Plus size={18} />
          {showAddForm ? 'Close Form' : 'Log Expense'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xl shadow-amber-50/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Date
              </label>
              <input 
                type="date" required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Tag size={14} /> Category
              </label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all appearance-none"
              >
                {settings.expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Receipt size={14} /> Amount ($)
              </label>
              <input 
                type="number" step="0.01" required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Note
              </label>
              <input 
                type="text" placeholder="Description..." required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <button type="submit" className="w-full mt-8 bg-amber-500 text-white py-4 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-100">
            Log Business Expense
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No expenses logged. Track your costs for tax deductions.
                  </td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{expense.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{expense.description}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-2"
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

export default Expenses;


import React, { useState } from 'react';
import { InventoryItem, AppSettings } from '../types';
import { formatCurrency } from '../utils/dataUtils';
import { Plus, Trash2, Calendar, ShoppingBag, DollarSign, Tag, CheckCircle, Package, ArrowRight } from 'lucide-react';

interface InventoryProps {
  inventory: InventoryItem[];
  onAddItem: (item: any) => void;
  onDeleteItem: (id: string) => void;
  onSellItem: (id: string, saleData: any) => void;
  settings: AppSettings;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onAddItem, onDeleteItem, onSellItem, settings }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState<string | null>(null);
  
  const [itemForm, setItemForm] = useState({
    itemName: '',
    description: '',
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: settings.platforms[0],
    salePrice: 0,
    fees: 0,
    shippingPaid: 0,
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(itemForm);
    setItemForm({ itemName: '', description: '', purchasePrice: 0, purchaseDate: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const handleSellItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (showSellForm) {
      onSellItem(showSellForm, saleForm);
      setShowSellForm(null);
      setSaleForm({
        date: new Date().toISOString().split('T')[0],
        platform: settings.platforms[0],
        salePrice: 0,
        fees: 0,
        shippingPaid: 0,
      });
    }
  };

  const activeItems = inventory.filter(i => i.status === 'available');

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inventory Stock</h1>
          <p className="text-slate-500 font-medium">Add items here first. Move them to Sales once sold.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-[24px] font-black hover:scale-105 transition-all shadow-xl shadow-primary-light"
        >
          <Plus size={24} /> Add Stock
        </button>
      </header>

      {showAddForm && (
        <form onSubmit={handleAddItem} className="bg-white p-8 rounded-[40px] border-2 border-primary border-opacity-20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShoppingBag size={14} /> Item Name</label>
              <input required type="text" value={itemForm.itemName} onChange={e => setItemForm({...itemForm, itemName: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-primary outline-none transition-all" placeholder="Sneakers, Laptop, etc." />
            </div>
            <div className="space-y-2 lg:col-span-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag size={14} /> Description (Optional)</label>
              <input type="text" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-primary outline-none transition-all" placeholder="Blue color, size 10..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><DollarSign size={14} /> Purchase Price</label>
              <input required type="number" step="0.01" value={itemForm.purchasePrice} onChange={e => setItemForm({...itemForm, purchasePrice: parseFloat(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} /> Date Purchased</label>
              <input required type="date" value={itemForm.purchaseDate} onChange={e => setItemForm({...itemForm, purchaseDate: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-primary outline-none transition-all" />
            </div>
          </div>
          <button type="submit" className="w-full mt-8 py-5 rounded-3xl font-black bg-primary text-white shadow-xl shadow-primary-light hover:brightness-110 transition-all text-lg">
            Record New Inventory
          </button>
        </form>
      )}

      {showSellForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form onSubmit={handleSellItem} className="bg-white p-8 rounded-[40px] shadow-2xl max-w-2xl w-full animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <CheckCircle className="text-emerald-500" /> Log Sale: {inventory.find(i => i.id === showSellForm)?.itemName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sale Date</label>
                <input required type="date" value={saleForm.date} onChange={e => setSaleForm({...saleForm, date: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform</label>
                <select value={saleForm.platform} onChange={e => setSaleForm({...saleForm, platform: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none appearance-none">
                  {settings.platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sale Price ($)</label>
                <input required type="number" step="0.01" value={saleForm.salePrice} onChange={e => setSaleForm({...saleForm, salePrice: parseFloat(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Fees ($)</label>
                <input required type="number" step="0.01" value={saleForm.fees} onChange={e => setSaleForm({...saleForm, fees: parseFloat(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Shipping Paid ($)</label>
                <input required type="number" step="0.01" value={saleForm.shippingPaid} onChange={e => setSaleForm({...saleForm, shippingPaid: parseFloat(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 outline-none" />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setShowSellForm(null)} className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-4 rounded-2xl font-black bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:brightness-110 transition-all">Move to Sales</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeItems.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-[40px] border border-slate-100 text-center">
            <Package size={64} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800">No items in stock</h3>
            <p className="text-slate-400 font-medium">Add your inventory to start tracking profits.</p>
          </div>
        ) : (
          activeItems.map(item => (
            <div key={item.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary-light transition-colors">
                  <Package className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                </div>
                <button onClick={() => onDeleteItem(item.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
              </div>
              <h3 className="text-xl font-black text-slate-800 line-clamp-1">{item.itemName}</h3>
              {item.description && <p className="text-sm text-slate-400 mt-1 font-medium">{item.description}</p>}
              
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cost</p>
                  <p className="text-2xl font-black text-emerald-600">{formatCurrency(item.purchasePrice)}</p>
                </div>
                <button 
                  onClick={() => setShowSellForm(item.id)}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-colors"
                >
                  Sell <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inventory;

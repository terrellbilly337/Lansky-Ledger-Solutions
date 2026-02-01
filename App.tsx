
import React, { useState, useEffect } from 'react';
import { Sale, Expense, InventoryItem, AppSettings } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SalesLog from './components/SalesLog';
import Expenses from './components/Expenses';
import TaxReports from './components/TaxReports';
import Inventory from './components/Inventory';
import BusinessAdvisor from './components/BusinessAdvisor';
import Settings from './components/Settings';
import MasterConsole from './components/MasterConsole';
import { getQuarter, generateSeedData } from './utils/dataUtils';
import { DEFAULT_PLATFORMS, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_APP_NAME } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMasterConsole, setShowMasterConsole] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    appName: DEFAULT_APP_NAME,
    platforms: DEFAULT_PLATFORMS,
    expenseCategories: DEFAULT_EXPENSE_CATEGORIES,
    primaryColor: '#1e3a8a',
    theme: 'light',
    inspectionMode: false
  });

  useEffect(() => {
    const savedSales = localStorage.getItem('lansky_sales');
    const savedExpenses = localStorage.getItem('lansky_expenses');
    const savedInventory = localStorage.getItem('lansky_inventory');
    const savedSettings = localStorage.getItem('lansky_settings');

    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('lansky_sales', JSON.stringify(sales));
    localStorage.setItem('lansky_expenses', JSON.stringify(expenses));
    localStorage.setItem('lansky_inventory', JSON.stringify(inventory));
    localStorage.setItem('lansky_settings', JSON.stringify(settings));
    
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-color-light', `${settings.primaryColor}22`);
    
    if (settings.theme === 'dark') {
      document.body.style.backgroundColor = '#020617';
    } else {
      document.body.style.backgroundColor = '#f1f5f9';
    }
  }, [sales, expenses, inventory, settings]);

  const handleSeedData = () => {
    const { sales: s, inventory: i, expenses: e } = generateSeedData();
    setSales(s);
    setInventory(i);
    setExpenses(e);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all business data? This cannot be undone.")) {
      setSales([]);
      setInventory([]);
      setExpenses([]);
    }
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'status'>) => {
    const newItem: InventoryItem = { ...item, id: crypto.randomUUID(), status: 'available' };
    setInventory(prev => [newItem, ...prev]);
  };

  const sellInventoryItem = (itemId: string, saleData: any) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const netProfit = saleData.salePrice - item.purchasePrice - saleData.fees - saleData.shippingPaid;
    const newSale: Sale = {
      ...saleData,
      id: crypto.randomUUID(),
      inventoryItemId: itemId,
      itemName: item.itemName,
      description: item.description,
      purchasePrice: item.purchasePrice,
      date: saleData.date,
      quarter: getQuarter(saleData.date),
      netProfit,
    };

    setSales(prev => [newSale, ...prev]);
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, status: 'sold' } : i));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    setSales(prev => prev.filter(s => s.inventoryItemId !== id));
  };

  const deleteSale = (id: string) => {
    const sale = sales.find(s => s.id === id);
    if (sale?.inventoryItemId) {
      setInventory(prev => prev.map(i => i.id === sale.inventoryItemId ? { ...i, status: 'available' } : i));
    }
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'quarter'>) => {
    const newExpense: Expense = { ...expense, id: crypto.randomUUID(), quarter: getQuarter(expense.date) };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard sales={sales} inventory={inventory} setActiveTab={setActiveTab} settings={settings} />;
      case 'inventory':
        return <Inventory inventory={inventory} onAddItem={addInventoryItem} onDeleteItem={deleteInventoryItem} onSellItem={sellInventoryItem} settings={settings} />;
      case 'sales':
        return <SalesLog sales={sales} onDeleteSale={deleteSale} settings={settings} />;
      case 'expenses':
        return <Expenses expenses={expenses} onAddExpense={addExpense} onDeleteExpense={deleteExpense} settings={settings} />;
      case 'taxes':
        return <TaxReports sales={sales} expenses={expenses} />;
      case 'advisor':
        return <BusinessAdvisor sales={sales} expenses={expenses} inventory={inventory} />;
      case 'settings':
        return (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            onSeedData={handleSeedData} 
            onClearData={handleClearData} 
            sales={sales}
            inventory={inventory}
            expenses={expenses}
          />
        );
      default:
        return <Dashboard sales={sales} inventory={inventory} setActiveTab={setActiveTab} settings={settings} />;
    }
  };

  return (
    <div className={`flex min-h-screen transition-all duration-500 ${settings.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-black'}`}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        settings={settings} 
        onTriggerMaster={() => setShowMasterConsole(true)}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {showMasterConsole && (
        <MasterConsole 
          settings={settings} 
          setSettings={setSettings} 
          onClose={() => setShowMasterConsole(false)}
          rawState={{ sales, expenses, inventory }}
          setRawState={(state: any) => {
             if (state.sales) setSales(state.sales);
             if (state.expenses) setExpenses(state.expenses);
             if (state.inventory) setInventory(state.inventory);
          }}
        />
      )}

      <style>{`
        :root {
          --primary-color: ${settings.primaryColor};
          --primary-color-light: ${settings.primaryColor}22;
        }
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        .text-primary {
          color: var(--primary-color);
        }
        .bg-primary-light {
          background-color: var(--primary-color-light);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${settings.theme === 'dark' ? '#1e293b' : '#334155'};
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;


import { Sale, Expense, DashboardMetrics, InventoryItem } from '../types';

export const getQuarter = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter}`;
};

export const calculateMetrics = (sales: Sale[], inventory: InventoryItem[]): DashboardMetrics => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const totalCOGS = sales.reduce((sum, sale) => sum + sale.purchasePrice, 0);
  const totalNetProfit = sales.reduce((sum, sale) => sum + sale.netProfit, 0);
  const avgMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  const activeInventory = inventory.filter(item => item.status === 'available');
  const activeInventoryValue = activeInventory.reduce((sum, item) => sum + item.purchasePrice, 0);
  const activeInventoryCount = activeInventory.length;

  return { 
    totalRevenue, 
    totalCOGS, 
    totalNetProfit, 
    avgMargin, 
    activeInventoryValue, 
    activeInventoryCount 
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const generateSeedData = () => {
  const inventory: InventoryItem[] = [
    { id: '1', itemName: 'Vintage Denim Jacket', purchasePrice: 15, purchaseDate: '2023-11-15', status: 'sold' },
    { id: '2', itemName: 'Limited Edition Sneakers', purchasePrice: 85, purchaseDate: '2023-12-05', status: 'available' },
    { id: '3', itemName: 'Retro Gaming Console', purchasePrice: 40, purchaseDate: '2024-01-10', status: 'sold' },
    { id: '4', itemName: 'Classic Camera', purchasePrice: 55, purchaseDate: '2024-01-20', status: 'available' },
    { id: '5', itemName: 'Designer Handbag', purchasePrice: 120, purchaseDate: '2024-02-01', status: 'available' },
  ];

  const sales: Sale[] = [
    { 
      id: 's1', 
      inventoryItemId: '1', 
      date: '2024-01-05', 
      itemName: 'Vintage Denim Jacket', 
      platform: 'eBay', 
      purchasePrice: 15, 
      salePrice: 45, 
      fees: 5.85, 
      shippingPaid: 10, 
      netProfit: 14.15, 
      quarter: 'Q1' 
    },
    { 
      id: 's2', 
      inventoryItemId: '3', 
      date: '2024-02-12', 
      itemName: 'Retro Gaming Console', 
      platform: 'Poshmark', 
      purchasePrice: 40, 
      salePrice: 95, 
      fees: 19, 
      shippingPaid: 0, 
      netProfit: 36, 
      quarter: 'Q1' 
    },
  ];

  const expenses: Expense[] = [
    { id: 'e1', date: '2024-01-02', category: 'Packaging/Boxes', amount: 25.50, description: 'Bulk bubble mailers', quarter: 'Q1' },
    { id: 'e2', date: '2024-02-15', category: 'Inventory Software', amount: 15.00, description: 'Monthly subscription', quarter: 'Q1' },
  ];

  return { inventory, sales, expenses };
};

export const exportToCSV = (sales: Sale[], inventory: InventoryItem[], expenses: Expense[]) => {
  const rows = [
    ['TYPE', 'DATE', 'ITEM', 'PLATFORM/CATEGORY', 'IN', 'OUT', 'FEES', 'NET'],
    ...sales.map(s => ['SALE', s.date, s.itemName, s.platform, s.purchasePrice, s.salePrice, s.fees, s.netProfit]),
    ...inventory.map(i => ['INVENTORY', i.purchaseDate, i.itemName, i.status, i.purchasePrice, 0, 0, -i.purchasePrice]),
    ...expenses.map(e => ['EXPENSE', e.date, e.description, e.category, e.amount, 0, 0, -e.amount]),
  ];

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "lansky_ledger_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export interface InventoryItem {
  id: string;
  itemName: string;
  description?: string;
  purchasePrice: number;
  purchaseDate: string;
  status: 'available' | 'sold';
}

export interface Sale {
  id: string;
  inventoryItemId?: string;
  date: string;
  itemName: string;
  description?: string;
  platform: string;
  purchasePrice: number;
  salePrice: number;
  fees: number;
  shippingPaid: number;
  netProfit: number;
  quarter: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  quarter: string;
}

export interface AppSettings {
  appName: string;
  logoSvgOverride?: string;
  platforms: string[];
  expenseCategories: string[];
  primaryColor: string;
  theme: 'light' | 'dark';
  inspectionMode: boolean;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalCOGS: number;
  totalNetProfit: number;
  avgMargin: number;
  activeInventoryValue: number;
  activeInventoryCount: number;
}

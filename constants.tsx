
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Receipt, 
  FileText, 
  Sparkles,
  Settings as SettingsIcon,
  Package
} from 'lucide-react';

export const DEFAULT_APP_NAME = "Lansky";

export const DEFAULT_PLATFORMS = ["eBay", "Poshmark", "Mercari", "Facebook", "Whatnot", "Other"];
export const DEFAULT_EXPENSE_CATEGORIES = [
  "Office Supplies", 
  "Packaging/Boxes", 
  "Gas & Mileage", 
  "Inventory Software", 
  "Advertising", 
  "Thrift/Sourcing Costs", 
  "Other"
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'inventory', label: 'Inventory Stock', icon: <Package size={20} /> },
  { id: 'sales', label: 'Sales Ledger', icon: <ShoppingCart size={20} /> },
  { id: 'expenses', label: 'Expenses', icon: <Receipt size={20} /> },
  { id: 'taxes', label: 'Tax Reports', icon: <FileText size={20} /> },
  { id: 'advisor', label: 'AI Business Advisor', icon: <Sparkles size={20} /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
];

export const COLORS = [
  { name: 'Power Blue', value: '#1e3a8a' }, // Blue 900
  { name: 'Deep Indigo', value: '#312e81' }, // Indigo 900
  { name: 'Royal Purple', value: '#581c87' }, // Purple 900
  { name: 'Crimson Rose', value: '#881337' }, // Rose 900
  { name: 'Forest Emerald', value: '#064e3b' }, // Emerald 900
  { name: 'Burnt Amber', value: '#78350f' }, // Amber 900
];

export const CHART_COLORS = ['#1e3a8a', '#064e3b', '#78350f', '#881337', '#581c87', '#312e81'];

export const DEFAULT_LOGO_SVG = `
<svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer Shield Frame -->
  <path d="M50 5L85 22.5V50C85 72.5 50 95 50 95C50 95 15 72.5 15 50V22.5L50 5Z" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="2"/>
  
  <!-- Stylized L and Growth Bars -->
  <!-- Vertical L stem / Bar 1 -->
  <rect x="35" y="45" width="8" height="30" rx="4" fill="currentColor" fill-opacity="0.2" />
  <!-- Horizontal L base / Bar 2 -->
  <rect x="47" y="35" width="8" height="40" rx="4" fill="currentColor" fill-opacity="0.5" />
  <!-- Bar 3 (Financial Growth) -->
  <rect x="59" y="25" width="8" height="50" rx="4" fill="#0066FF" />
  
  <!-- Intersection detail for 'L' character -->
  <path d="M35 75H55" stroke="currentColor" stroke-width="8" stroke-linecap="round" />
  
  <!-- Subtle accent dots -->
  <circle cx="50" cy="15" r="2" fill="currentColor" />
</svg>
`;

// types.ts

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum BookType {
  GENERAL = 'GENERAL',
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
}

export interface Transaction {
  id: string;
  date: string; // ISO string format
  description: string;
  amount: number; // This will now be the total amount (taxable + GST)
  type: TransactionType;
  category: string;
  customerName?: string;
  customerAddress?: string;
  taxableAmount?: number;
  gstAmount?: number;
  isSaving?: boolean;
}

export interface AccountBook {
  id: string;
  name: string;
  currency: string;
  transactions: Transaction[];
  bookType: BookType; // New property for specialized ledgers
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO string format
  source: 'voice' | 'receipt';
  transactions: Transaction[];
}
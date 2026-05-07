export interface Transaction {
  id: number;
  name: string;
  category: string;
  date: string;
  amount: number;
  avatar: string;
}

export interface Budget {
  id: number;
  category: string;
  maximum: number;
  theme: string;
}

export interface Pot {
  id: number;
  name: string;
  target: number;
  total: number;
  theme: string;
}

export interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDay: number;
  isPaid: boolean;
  avatar: string;
}

// ── TRANSACTIONS ──
export function getTransactions(): Transaction[] {
  return JSON.parse(localStorage.getItem('finance_transactions') || '[]');
}
export function saveTransactions(list: Transaction[]): void {
  localStorage.setItem('finance_transactions', JSON.stringify(list));
}
export function addTransaction(tx: Transaction): void {
  const list = getTransactions();
  list.unshift(tx);
  saveTransactions(list);
}

// ── BUDGETS ──
export function getBudgets(): Budget[] {
  return JSON.parse(localStorage.getItem('finance_budgets') || '[]');
}
export function saveBudgets(list: Budget[]): void {
  localStorage.setItem('finance_budgets', JSON.stringify(list));
}
export function addBudget(b: Budget): void {
  const list = getBudgets();
  list.push(b);
  saveBudgets(list);
}
export function deleteBudget(id: number): void {
  saveBudgets(getBudgets().filter(b => b.id !== id));
}

// ── POTS ──
export function getPots(): Pot[] {
  return JSON.parse(localStorage.getItem('finance_pots') || '[]');
}
export function savePots(list: Pot[]): void {
  localStorage.setItem('finance_pots', JSON.stringify(list));
}
export function addPot(p: Pot): void {
  const list = getPots();
  list.push(p);
  savePots(list);
}
export function updatePot(id: number, total: number): void {
  const list = getPots().map(p => p.id === id ? { ...p, total } : p);
  savePots(list);
}
export function deletePot(id: number): void {
  savePots(getPots().filter(p => p.id !== id));
}

// ── BILLS ──
export function getBills(): Bill[] {
  return JSON.parse(localStorage.getItem('finance_bills') || '[]');
}
export function saveBills(list: Bill[]): void {
  localStorage.setItem('finance_bills', JSON.stringify(list));
}
export function addBill(b: Bill): void {
  const list = getBills();
  list.push(b);
  saveBills(list);
}
export function toggleBillPaid(id: number): void {
  const list = getBills().map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b);
  saveBills(list);
}
export function deleteBill(id: number): void {
  saveBills(getBills().filter(b => b.id !== id));
}
// ── TRANSACTIONS ──
export function getTransactions() {
    return JSON.parse(localStorage.getItem('finance_transactions') || '[]');
}
export function saveTransactions(list) {
    localStorage.setItem('finance_transactions', JSON.stringify(list));
}
export function addTransaction(tx) {
    const list = getTransactions();
    list.unshift(tx);
    saveTransactions(list);
}
// ── BUDGETS ──
export function getBudgets() {
    return JSON.parse(localStorage.getItem('finance_budgets') || '[]');
}
export function saveBudgets(list) {
    localStorage.setItem('finance_budgets', JSON.stringify(list));
}
export function addBudget(b) {
    const list = getBudgets();
    list.push(b);
    saveBudgets(list);
}
export function deleteBudget(id) {
    saveBudgets(getBudgets().filter(b => b.id !== id));
}
// ── POTS ──
export function getPots() {
    return JSON.parse(localStorage.getItem('finance_pots') || '[]');
}
export function savePots(list) {
    localStorage.setItem('finance_pots', JSON.stringify(list));
}
export function addPot(p) {
    const list = getPots();
    list.push(p);
    savePots(list);
}
export function updatePot(id, total) {
    const list = getPots().map(p => p.id === id ? Object.assign(Object.assign({}, p), { total }) : p);
    savePots(list);
}
export function deletePot(id) {
    savePots(getPots().filter(p => p.id !== id));
}
// ── BILLS ──
export function getBills() {
    return JSON.parse(localStorage.getItem('finance_bills') || '[]');
}
export function saveBills(list) {
    localStorage.setItem('finance_bills', JSON.stringify(list));
}
export function addBill(b) {
    const list = getBills();
    list.push(b);
    saveBills(list);
}
export function toggleBillPaid(id) {
    const list = getBills().map(b => b.id === id ? Object.assign(Object.assign({}, b), { isPaid: !b.isPaid }) : b);
    saveBills(list);
}
export function deleteBill(id) {
    saveBills(getBills().filter(b => b.id !== id));
}

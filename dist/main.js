import { renderSidebar } from './sidebar.js';
import { renderOverview } from './overview.js';
import { renderTransactions } from './transactions.js';
import { renderAddTransaction } from './addTransaction.js';
import { renderBudgets } from './budgets.js';
import { renderPots } from './ports.js';
import { renderBills } from './bills.js';
import { renderLogin } from './login.js';
import { renderRegister } from './register.js';
import { isLoggedIn, logout } from './auth.js';
const app = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
function showApp(page) {
    sidebar.style.display = 'flex';
    app.style.marginLeft = '300px';
    renderSidebar(page);
    if (page === 'overview')
        renderOverview();
    else if (page === 'transactions')
        renderTransactions();
    else if (page === 'add-transaction')
        renderAddTransaction();
    else if (page === 'budgets')
        renderBudgets();
    else if (page === 'pots')
        renderPots();
    else if (page === 'bills')
        renderBills();
}
function navigate(page) {
    if (!isLoggedIn()) {
        renderLogin();
        return;
    }
    showApp(page);
}
window.addEventListener('logged-in', () => showApp('overview'));
window.addEventListener('go-register', () => renderRegister());
window.addEventListener('go-login', () => renderLogin());
window.addEventListener('logout', () => { logout(); renderLogin(); });
window.addEventListener('navigate', (e) => navigate(e.detail));
isLoggedIn() ? showApp('overview') : renderLogin();

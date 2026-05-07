import { getCurrentUser } from './auth.js';
const icons = {
    overview: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    transactions: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
    budgets: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    pots: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h14M5 8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/></svg>`,
    bills: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
};
const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'budgets', label: 'Budgets' },
    { id: 'pots', label: 'Pots' },
    { id: 'bills', label: 'Recurring Bills' },
];
export function renderSidebar(activePage) {
    var _a;
    const user = getCurrentUser();
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
  <div class="sidebar-logo">
    <h1>finance</h1>
  </div>

  <nav class="nav-links">
    ${navItems.map(item => `
      <a class="nav-item ${activePage === item.id ? 'active' : ''}"
         data-page="${item.id}">
        ${icons[item.id]}
        ${item.label}
      </a>
    `).join('')}
  </nav>

  <div class="sidebar-bottom">
    <div style="font-size:13px;color:#B5B5C3;padding:0 0 16px;font-weight:600;">
      ${user ? user.name : ''}
    </div>
    <button class="sidebar-min-btn" id="logout-btn">
      Logout
    </button>
  </div>
`;
    (_a = document.getElementById('logout-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('logout'));
    });
    sidebar.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
        });
    });
}

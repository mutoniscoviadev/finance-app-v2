import { getTransactions, Transaction } from './data.js';

const PER_PAGE = 8;
let currentPage = 1;
let filtered: Transaction[] = [];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toFixed(2);
  return amount >= 0 ? `+$${abs}` : `-$${abs}`;
}

function renderTable(): void {
  const transactions = getTransactions();
  const start        = (currentPage - 1) * PER_PAGE;
  const paginated    = filtered.slice(start, start + PER_PAGE);
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const tableEl      = document.getElementById('tx-table-body') as HTMLElement;
  const paginationEl = document.getElementById('tx-pagination') as HTMLElement;

  if (paginated.length === 0) {
    tableEl.innerHTML = `
      <div class="tx-empty">
        <p>No transactions yet.</p>
        <p style="margin-top:8px;font-size:13px;">Click <strong>+ Add Transaction</strong> to get started!</p>
      </div>`;
  } else {
    tableEl.innerHTML = paginated.map(tx => `
      <div class="tx-table-row">
        <div class="tx-col-name">
          <div class="tx-avatar">${tx.avatar}</div>
          <div class="tx-name">${tx.name}</div>
        </div>
        <div class="tx-col-category">${tx.category}</div>
        <div class="tx-col-date">${formatDate(tx.date)}</div>
        <div class="tx-col-amount ${tx.amount >= 0 ? 'positive' : 'negative'}">
          ${formatAmount(tx.amount)}
        </div>
      </div>
    `).join('');
  }

  // Pagination
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  paginationEl.innerHTML = `
    <button class="pagination-btn" id="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      Prev
    </button>
    <div class="pagination-pages">
      ${pages.map(p => `
        <button class="page-num ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>
      `).join('')}
    </div>
    <button class="pagination-btn" id="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
      Next
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  `;

  document.getElementById('prev-btn')?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; applyFilters(); }
  });
  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; applyFilters(); }
  });
  paginationEl.querySelectorAll('.page-num').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt((btn as HTMLElement).dataset.page!);
      applyFilters();
    });
  });
}

function applyFilters(): void {
  const transactions = getTransactions();
  const search   = (document.getElementById('tx-search') as HTMLInputElement).value.toLowerCase();
  const category = (document.getElementById('tx-category') as HTMLSelectElement).value;
  const sort     = (document.getElementById('tx-sort') as HTMLSelectElement).value;

  filtered = transactions.filter(tx => {
    const matchSearch   = tx.name.toLowerCase().includes(search);
    const matchCategory = !category || tx.category === category;
    return matchSearch && matchCategory;
  });

  if (sort === 'latest')  filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === 'oldest')  filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === 'a-z')     filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'z-a')     filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === 'highest') filtered.sort((a, b) => b.amount - a.amount);
  if (sort === 'lowest')  filtered.sort((a, b) => a.amount - b.amount);

  renderTable();
}

export function renderTransactions(): void {
  const app = document.getElementById('app') as HTMLElement;
  const transactions = getTransactions();
const categories = [...new Set(transactions.map((t: Transaction) => t.category))];

 app.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h1 style="font-size:28px;font-weight:800;">Transactions</h1>
      <button class="btn-add" id="add-tx-btn" style="background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px 20px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
        + Add Transaction
      </button>
    </div>

    <div class="section-card" style="margin-top:0;">
      <div class="transactions-filters">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" id="tx-search" placeholder="Search transaction" />
        </div>
        <div class="filter-group">
          <label>Sort by</label>
          <select class="filter-select" id="tx-sort">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A to Z</option>
            <option value="z-a">Z to A</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Category</label>
          <select class="filter-select" id="tx-category">
            <option value="">All Transactions</option>
            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="tx-table-header">
        <span>Recipient / Sender</span>
        <span>Category</span>
        <span>Date</span>
        <span style="text-align:right;">Amount</span>
      </div>

      <div id="tx-table-body"></div>
      <div id="tx-pagination"></div>
    </div>
  `;

  document.getElementById('add-tx-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'add-transaction' }));
  });

  document.getElementById('tx-search')?.addEventListener('input', applyFilters);
  document.getElementById('tx-sort')?.addEventListener('change', applyFilters);
  document.getElementById('tx-category')?.addEventListener('change', applyFilters);

  applyFilters();
}
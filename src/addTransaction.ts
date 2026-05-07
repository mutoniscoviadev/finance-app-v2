import { addTransaction } from './data.js';

export function renderAddTransaction(): void {
  const app = document.getElementById('app') as HTMLElement;

  const categories = [
    'General', 'Dining Out', 'Groceries', 'Entertainment',
    'Bills', 'Personal Care', 'Transport', 'Education', 'Savings'
  ];

  app.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h1 style="font-size:28px;font-weight:800;">Add Transaction</h1>
    </div>

    <div style="background:white;border-radius:12px;padding:32px;max-width:560px;">

      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Recipient / Sender Name</label>
        <input type="text" id="tx-name" placeholder="e.g. FreshMart"
          style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
      </div>

      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Category</label>
        <select id="tx-cat" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;">
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Date</label>
        <input type="date" id="tx-date"
          style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
      </div>

      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Amount ($)</label>
        <input type="number" id="tx-amount" placeholder="0.00" step="0.01" min="0.01"
          style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
      </div>

      <div style="margin-bottom:24px;">
        <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Transaction Type</label>
        <select id="tx-type" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;">
          <option value="expense">💸 Expense — money going out</option>
          <option value="income">💰 Income — money coming in</option>
        </select>
      </div>

      <div id="tx-error" style="color:var(--red);font-size:13px;margin-bottom:12px;display:none;"></div>

      <div style="display:flex;gap:12px;">
        <button id="cancel-tx" style="flex:1;background:var(--beige);border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
          Cancel
        </button>
        <button id="save-tx" style="flex:1;background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
          Save Transaction
        </button>
      </div>
    </div>
  `;

  const dateInput = document.getElementById('tx-date') as HTMLInputElement;
  dateInput.value = new Date().toISOString().split('T')[0];

  document.getElementById('cancel-tx')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'transactions' }));
  });

  document.getElementById('save-tx')?.addEventListener('click', () => {
    const name    = (document.getElementById('tx-name') as HTMLInputElement).value.trim();
    const cat     = (document.getElementById('tx-cat') as HTMLSelectElement).value;
    const date    = (document.getElementById('tx-date') as HTMLInputElement).value;
    const amount  = parseFloat((document.getElementById('tx-amount') as HTMLInputElement).value);
    const type    = (document.getElementById('tx-type') as HTMLSelectElement).value;
    const errorEl = document.getElementById('tx-error') as HTMLElement;

    if (!name) { errorEl.textContent = 'Please enter a name.'; errorEl.style.display = 'block'; return; }
    if (!date) { errorEl.textContent = 'Please select a date.'; errorEl.style.display = 'block'; return; }
    if (isNaN(amount) || amount <= 0) { errorEl.textContent = 'Please enter a valid amount.'; errorEl.style.display = 'block'; return; }

    errorEl.style.display = 'none';
    const initials    = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    addTransaction({ id: Date.now(), name, category: cat, date, amount: finalAmount, avatar: initials });
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'transactions' }));
  });
}
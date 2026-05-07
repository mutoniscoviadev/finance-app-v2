import { getBills, addBill, toggleBillPaid, deleteBill } from './data.js';

function renderBillsContent(): void {
  const bills  = getBills();
  const today  = new Date().getDate();

  const paid    = bills.filter(b => b.isPaid);
  const unpaid  = bills.filter(b => !b.isPaid);
  const dueSoon = unpaid.filter(b => (b.dueDay - today) >= 0 && (b.dueDay - today) <= 5);

  const paidTotal     = paid.reduce((s, b) => s + b.amount, 0);
  const upcomingTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const dueSoonTotal  = dueSoon.reduce((s, b) => s + b.amount, 0);

  (document.getElementById('paid-total') as HTMLElement).textContent     = `$${paidTotal.toFixed(2)}`;
  (document.getElementById('upcoming-total') as HTMLElement).textContent = `$${upcomingTotal.toFixed(2)}`;
  (document.getElementById('due-soon-total') as HTMLElement).textContent = `$${dueSoonTotal.toFixed(2)}`;

  const tbody = document.getElementById('bills-tbody') as HTMLElement;

  if (bills.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted);">
          No bills yet. Click <strong>+ Add Bill</strong> to get started.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = bills.map(b => {
    const isDueSoon = !b.isPaid && (b.dueDay - today) >= 0 && (b.dueDay - today) <= 5;
    const badge = b.isPaid
      ? `<span class="bill-status-badge paid">Paid</span>`
      : isDueSoon
        ? `<span class="bill-status-badge due-soon">Due Soon</span>`
        : `<span class="bill-status-badge unpaid">Upcoming</span>`;

    return `
      <tr>
        <td>
          <div class="bill-name-cell">
            <div class="bill-avatar">${b.avatar}</div>
            <span style="font-weight:600;">${b.name}</span>
          </div>
        </td>
        <td style="color:var(--text-muted);">Day ${b.dueDay} of month</td>
        <td>${badge}</td>
        <td class="bill-amount-col">$${b.amount.toFixed(2)}</td>
        <td class="bill-action-col">
          <button class="pot-action-btn" data-id="${b.id}" data-action="toggle"
            style="margin-right:6px;padding:6px 12px;">
            ${b.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
          </button>
          <button class="pot-action-btn danger" data-id="${b.id}" data-action="delete"
            style="padding:6px 12px;">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = parseInt((btn as HTMLElement).dataset.id!);
      const action = (btn as HTMLElement).dataset.action!;
      if (action === 'toggle') {
        toggleBillPaid(id);
        renderBillsContent();
      }
      if (action === 'delete') {
        if (confirm('Delete this bill?')) {
          deleteBill(id);
          renderBillsContent();
        }
      }
    });
  });
}

export function renderBills(): void {
  const app = document.getElementById('app') as HTMLElement;

  app.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h1 style="font-size:28px;font-weight:800;">Recurring Bills</h1>
      <button id="add-bill-btn"
        style="background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px 20px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
        + Add Bill
      </button>
    </div>

    <!-- Summary cards -->
    <div class="bills-summary">
      <div class="bill-sum-card">
        <div class="bill-sum-label">Paid Bills</div>
        <div class="bill-sum-amount" style="color:var(--green);" id="paid-total">$0.00</div>
      </div>
      <div class="bill-sum-card">
        <div class="bill-sum-label">Total Upcoming</div>
        <div class="bill-sum-amount" id="upcoming-total">$0.00</div>
      </div>
      <div class="bill-sum-card">
        <div class="bill-sum-label">Due Soon</div>
        <div class="bill-sum-amount" style="color:var(--red);" id="due-soon-total">$0.00</div>
      </div>
    </div>

    <!-- Bills table -->
    <div style="background:white;border-radius:12px;padding:24px;">
      <table class="bills-table">
        <thead>
          <tr>
            <th>Bill Name</th>
            <th>Due Date</th>
            <th>Status</th>
            <th style="text-align:right;">Amount</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody id="bills-tbody"></tbody>
      </table>
    </div>

    <!-- Modal -->
    <div id="bill-modal"
      style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:12px;padding:32px;width:100%;max-width:480px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:24px;">Add Recurring Bill</h2>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Bill Name</label>
          <input type="text" id="bl-name" placeholder="e.g. Netflix"
            style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Amount ($)</label>
          <input type="number" id="bl-amount" placeholder="e.g. 9.99" min="0.01" step="0.01"
            style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
        </div>

        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Due Day of Month (1-31)</label>
          <input type="number" id="bl-day" placeholder="e.g. 15" min="1" max="31"
            style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
        </div>

        <div id="bl-error"
          style="color:var(--red);font-size:13px;margin-bottom:12px;display:none;"></div>

        <div style="display:flex;gap:12px;">
          <button id="cancel-bill"
            style="flex:1;background:var(--beige);border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
            Cancel
          </button>
          <button id="save-bill"
            style="flex:1;background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
            Add Bill
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('add-bill-btn')?.addEventListener('click', () => {
    (document.getElementById('bill-modal') as HTMLElement).style.display = 'flex';
  });

  document.getElementById('cancel-bill')?.addEventListener('click', () => {
    (document.getElementById('bill-modal') as HTMLElement).style.display = 'none';
  });

  document.getElementById('save-bill')?.addEventListener('click', () => {
    const name    = (document.getElementById('bl-name') as HTMLInputElement).value.trim();
    const amount  = parseFloat((document.getElementById('bl-amount') as HTMLInputElement).value);
    const dueDay  = parseInt((document.getElementById('bl-day') as HTMLInputElement).value);
    const errorEl = document.getElementById('bl-error') as HTMLElement;

    if (!name) {
      errorEl.textContent = 'Please enter a bill name.';
      errorEl.style.display = 'block'; return;
    }
    if (!amount || amount <= 0) {
      errorEl.textContent = 'Please enter a valid amount.';
      errorEl.style.display = 'block'; return;
    }
    if (!dueDay || dueDay < 1 || dueDay > 31) {
      errorEl.textContent = 'Please enter a valid day between 1 and 31.';
      errorEl.style.display = 'block'; return;
    }

    const avatar = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    addBill({ id: Date.now(), name, amount, dueDay, isPaid: false, avatar });
    (document.getElementById('bill-modal') as HTMLElement).style.display = 'none';
    renderBillsContent();
  });

  renderBillsContent();
}
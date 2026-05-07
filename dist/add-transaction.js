import { transactions } from './data.js';
export function renderAddTransaction() {
    var _a, _b;
    const app = document.getElementById('app');
    const categories = [
        'General', 'Dining Out', 'Groceries', 'Entertainment',
        'Bills', 'Personal Care', 'Transport', 'Education', 'Savings'
    ];
    app.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Add Transaction</h1>
    </div>

    <div class="add-tx-card">
      <div class="form-group">
        <label>Recipient / Sender Name</label>
        <input type="text" id="tx-name" placeholder="e.g. FreshMart" />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select class="filter-select" id="tx-cat" style="width:100%;padding:14px 16px;">
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="tx-date" />
      </div>
      <div class="form-group">
        <label>Amount</label>
        <input type="number" id="tx-amount" placeholder="0.00" step="0.01" />
      </div>
      <div class="form-group">
        <label>Type</label>
        <select class="filter-select" id="tx-type" style="width:100%;padding:14px 16px;">
          <option value="expense">Expense (money out)</option>
          <option value="income">Income (money in)</option>
        </select>
      </div>
      <div class="form-error" id="tx-error"></div>
      <div class="add-tx-actions">
        <button class="cancel-btn" id="cancel-tx">Cancel</button>
        <button class="save-btn" id="save-tx">Save Transaction</button>
      </div>
    </div>
  `;
    // Set today's date as default
    const dateInput = document.getElementById('tx-date');
    dateInput.value = new Date().toISOString().split('T')[0];
    (_a = document.getElementById('cancel-tx')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'transactions' }));
    });
    (_b = document.getElementById('save-tx')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        const name = document.getElementById('tx-name').value.trim();
        const cat = document.getElementById('tx-cat').value;
        const date = document.getElementById('tx-date').value;
        const amount = parseFloat(document.getElementById('tx-amount').value);
        const type = document.getElementById('tx-type').value;
        const error = document.getElementById('tx-error');
        if (!name || !date || isNaN(amount) || amount <= 0) {
            error.textContent = 'Please fill in all fields correctly.';
            error.classList.add('visible');
            return;
        }
        const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        transactions.unshift({
            id: Date.now(),
            name,
            category: cat,
            date,
            amount: finalAmount,
            avatar: initials
        });
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'transactions' }));
    });
}

import { getBudgets, addBudget, deleteBudget, getTransactions } from './data.js';

const THEMES = [
  '#277C78', '#626070', '#C94736', '#82C9D7',
  '#F2CDAC', '#934F6F', '#3F82B2', '#97A0AC'
];

const CATEGORIES = [
  'General', 'Dining Out', 'Groceries', 'Entertainment',
  'Bills', 'Personal Care', 'Transport', 'Education', 'Savings'
];

function renderBudgetCards(): void {
  const budgets      = getBudgets();
  const transactions = getTransactions();
  const container    = document.getElementById('budgets-container') as HTMLElement;

  if (budgets.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No budgets yet</h3>
        <p>Click <strong>+ Add Budget</strong> to create your first budget.</p>
      </div>`;
    return;
  }

  container.innerHTML = budgets.map(b => {
    const spent     = transactions
      .filter(t => t.category === b.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const remaining = Math.max(0, b.maximum - spent);
    const pct       = Math.min(100, (spent / b.maximum) * 100);
    const over      = spent > b.maximum;

    return `
      <div class="budget-card">
        <div class="budget-card-header">
          <div class="budget-card-title">
            <span class="budget-card-dot" style="background:${b.theme}"></span>
            ${b.category}
          </div>
          <span class="budget-card-max">Max $${b.maximum.toFixed(2)}</span>
        </div>

        <div class="budget-progress-track">
          <div class="budget-progress-fill"
               style="width:${pct}%;background:${b.theme};"></div>
        </div>

        <div class="budget-amounts">
          <div>
            <div class="budget-spent-label">Spent</div>
            <div class="budget-spent-val"
                 style="color:${over ? 'var(--red)' : 'var(--text)'}">
              $${spent.toFixed(2)}
            </div>
          </div>
          <div class="budget-remaining">
            <div>Remaining</div>
            <span>$${remaining.toFixed(2)}</span>
          </div>
        </div>

        <button class="delete-btn" data-id="${b.id}">Delete Budget</button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt((btn as HTMLElement).dataset.id!);
      if (confirm('Delete this budget?')) {
        deleteBudget(id);
        renderBudgetCards();
      }
    });
  });
}

export function renderBudgets(): void {
  const app = document.getElementById('app') as HTMLElement;

  app.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h1 style="font-size:28px;font-weight:800;">Budgets</h1>
      <button id="add-budget-btn" style="background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px 20px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
        + Add Budget
      </button>
    </div>

    <div class="budgets-grid" id="budgets-container"></div>

    <!-- Add Budget Modal -->
    <div id="budget-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:12px;padding:32px;width:100%;max-width:480px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:24px;">Add New Budget</h2>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Category</label>
          <select id="b-category" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;">
            ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Maximum Spending ($)</label>
          <input type="number" id="b-max" placeholder="e.g. 500"
            style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
        </div>

        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:12px;">Color Theme</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${THEMES.map((t, i) => `
              <label style="cursor:pointer;">
                <input type="radio" name="b-theme" value="${t}"
                  ${i === 0 ? 'checked' : ''} style="display:none;" />
                <span class="theme-dot" style="background:${t};${i === 0 ? 'border-color:#333;' : ''}"></span>
              </label>
            `).join('')}
          </div>
        </div>

        <div id="b-error" style="color:var(--red);font-size:13px;margin-bottom:12px;display:none;"></div>

        <div style="display:flex;gap:12px;">
          <button id="cancel-budget" style="flex:1;background:var(--beige);border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
            Cancel
          </button>
          <button id="save-budget" style="flex:1;background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
            Add Budget
          </button>
        </div>
      </div>
    </div>
  `;

  // Theme dot selection highlight
  document.querySelectorAll('input[name="b-theme"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.theme-dot').forEach(dot => {
        (dot as HTMLElement).style.borderColor = 'transparent';
      });
      (radio.nextElementSibling as HTMLElement).style.borderColor = '#333';
    });
  });

  // Open modal
  document.getElementById('add-budget-btn')?.addEventListener('click', () => {
    (document.getElementById('budget-modal') as HTMLElement).style.display = 'flex';
  });

  // Close modal
  document.getElementById('cancel-budget')?.addEventListener('click', () => {
    (document.getElementById('budget-modal') as HTMLElement).style.display = 'none';
  });

  // Save budget
  document.getElementById('save-budget')?.addEventListener('click', () => {
    const category = (document.getElementById('b-category') as HTMLSelectElement).value;
    const maximum  = parseFloat((document.getElementById('b-max') as HTMLInputElement).value);
    const theme    = (document.querySelector('input[name="b-theme"]:checked') as HTMLInputElement)?.value;
    const errorEl  = document.getElementById('b-error') as HTMLElement;

    if (!maximum || maximum <= 0) {
      errorEl.textContent = 'Please enter a valid maximum amount.';
      errorEl.style.display = 'block';
      return;
    }

    const exists = getBudgets().find(b => b.category === category);
    if (exists) {
      errorEl.textContent = 'A budget for this category already exists.';
      errorEl.style.display = 'block';
      return;
    }

    addBudget({ id: Date.now(), category, maximum, theme });
    (document.getElementById('budget-modal') as HTMLElement).style.display = 'none';
    renderBudgetCards();
  });

  renderBudgetCards();
}
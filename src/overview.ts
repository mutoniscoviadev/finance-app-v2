import { getTransactions, getBudgets, getPots, getBills } from './data.js';
import { Transaction, Budget, Pot, Bill } from './data.js';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toFixed(2);
  return amount >= 0 ? `+$${abs}` : `-$${abs}`;
}

export function renderOverview(): void {
  const app          = document.getElementById('app') as HTMLElement;
  const transactions = getTransactions();
  const budgets      = getBudgets();
  const pots         = getPots();
  const bills        = getBills();

  const income     = transactions.filter((t: Transaction) => t.amount > 0).reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  const expenses   = transactions.filter((t: Transaction) => t.amount < 0).reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
  const balance    = income - expenses;
  const totalSaved = pots.reduce((sum: number, p: Pot) => sum + p.total, 0);
  const paidBills  = bills.filter((b: Bill) => b.isPaid).reduce((sum: number, b: Bill) => sum + b.amount, 0);
  const upcoming   = bills.filter((b: Bill) => !b.isPaid).reduce((sum: number, b: Bill) => sum + b.amount, 0);

  app.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h1 style="font-size:28px;font-weight:800;">Overview</h1>
    </div>

    <!-- Balance Cards -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:24px;">
      <div style="background:var(--sidebar-bg);border-radius:12px;padding:24px;color:white;">
        <div style="font-size:13px;opacity:0.7;margin-bottom:8px;">Current Balance</div>
        <div style="font-size:32px;font-weight:800;">$${balance.toFixed(2)}</div>
      </div>
      <div style="background:white;border-radius:12px;padding:24px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Income</div>
        <div style="font-size:32px;font-weight:800;">$${income.toFixed(2)}</div>
      </div>
      <div style="background:white;border-radius:12px;padding:24px;">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">Expenses</div>
        <div style="font-size:32px;font-weight:800;">$${expenses.toFixed(2)}</div>
      </div>
    </div>

    <!-- Transactions + Right column -->
    <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:24px;">

      <!-- Recent Transactions -->
      <div style="background:white;border-radius:12px;padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <span style="font-size:18px;font-weight:800;">Transactions</span>
          <button onclick="window.dispatchEvent(new CustomEvent('navigate',{detail:'transactions'}))"
            style="background:none;border:none;font-family:var(--font);font-size:14px;color:var(--text-muted);cursor:pointer;">
            View All →
          </button>
        </div>
        ${transactions.length === 0
          ? `<p style="color:var(--text-muted);font-size:14px;text-align:center;padding:20px;">No transactions yet.</p>`
          : transactions.slice(0, 5).map((tx: Transaction) => `
            <div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--beige-dark);">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--beige-dark);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">
                ${tx.avatar}
              </div>
              <div style="flex:1;">
                <div style="font-size:14px;font-weight:700;">${tx.name}</div>
                <div style="font-size:12px;color:var(--text-muted);">${tx.category}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:14px;font-weight:700;color:${tx.amount >= 0 ? 'var(--green)' : 'var(--text)'}">
                  ${formatAmount(tx.amount)}
                </div>
                <div style="font-size:12px;color:var(--text-muted);">${formatDate(tx.date)}</div>
              </div>
            </div>
          `).join('')
        }
      </div>

      <!-- Right column -->
      <div style="display:flex;flex-direction:column;gap:20px;">

        <!-- Pots -->
        <div style="background:white;border-radius:12px;padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <span style="font-size:18px;font-weight:800;">Pots</span>
            <button onclick="window.dispatchEvent(new CustomEvent('navigate',{detail:'pots'}))"
              style="background:none;border:none;font-family:var(--font);font-size:14px;color:var(--text-muted);cursor:pointer;">
              See Details →
            </button>
          </div>
          <div style="background:var(--beige);border-radius:10px;padding:16px;margin-bottom:12px;">
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px;">Total Saved</div>
            <div style="font-size:26px;font-weight:800;">$${totalSaved.toFixed(2)}</div>
          </div>
          ${pots.length === 0
            ? `<p style="color:var(--text-muted);font-size:13px;">No pots yet.</p>`
            : pots.slice(0, 4).map((p: Pot) => `
              <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--beige-dark);">
                <span style="width:12px;height:12px;border-radius:50%;background:${p.theme};display:inline-block;flex-shrink:0;"></span>
                <span style="flex:1;font-size:13px;color:var(--text-muted);">${p.name}</span>
                <span style="font-size:13px;font-weight:700;">$${p.total.toFixed(2)}</span>
              </div>
            `).join('')
          }
        </div>

        <!-- Budgets -->
        <div style="background:white;border-radius:12px;padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <span style="font-size:18px;font-weight:800;">Budgets</span>
            <button onclick="window.dispatchEvent(new CustomEvent('navigate',{detail:'budgets'}))"
              style="background:none;border:none;font-family:var(--font);font-size:14px;color:var(--text-muted);cursor:pointer;">
              See Details →
            </button>
          </div>
          ${budgets.length === 0
            ? `<p style="color:var(--text-muted);font-size:13px;">No budgets yet.</p>`
            : budgets.map((b: Budget) => {
                const spent = transactions
                  .filter((t: Transaction) => t.category === b.category && t.amount < 0)
                  .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
                const pct = Math.min(100, (spent / b.maximum) * 100);
                return `
                  <div style="margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                      <span style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;">
                        <span style="width:10px;height:10px;border-radius:50%;background:${b.theme};display:inline-block;"></span>
                        ${b.category}
                      </span>
                      <span style="font-size:12px;color:var(--text-muted);">$${spent.toFixed(2)} of $${b.maximum}</span>
                    </div>
                    <div style="height:6px;background:var(--beige-dark);border-radius:3px;overflow:hidden;">
                      <div style="height:100%;width:${pct}%;background:${b.theme};border-radius:3px;"></div>
                    </div>
                  </div>
                `;
              }).join('')
          }
        </div>

        <!-- Bills -->
        <div style="background:white;border-radius:12px;padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <span style="font-size:18px;font-weight:800;">Recurring Bills</span>
            <button onclick="window.dispatchEvent(new CustomEvent('navigate',{detail:'bills'}))"
              style="background:none;border:none;font-family:var(--font);font-size:14px;color:var(--text-muted);cursor:pointer;">
              See Details →
            </button>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <div style="background:var(--beige);border-radius:8px;padding:14px;flex:1;margin-right:8px;">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Paid</div>
              <div style="font-size:18px;font-weight:800;color:var(--green);">$${paidBills.toFixed(2)}</div>
            </div>
            <div style="background:var(--beige);border-radius:8px;padding:14px;flex:1;">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Upcoming</div>
              <div style="font-size:18px;font-weight:800;">$${upcoming.toFixed(2)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
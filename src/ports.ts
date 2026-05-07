import { getPots, addPot, updatePot, deletePot } from './data.js';

const THEMES = [
  '#277C78', '#626070', '#C94736', '#82C9D7',
  '#F2CDAC', '#934F6F', '#3F82B2', '#97A0AC'
];

function renderPotCards(): void {
  const pots      = getPots();
  const container = document.getElementById('pots-container') as HTMLElement;

  if (pots.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);">
        <h3 style="font-size:18px;margin-bottom:8px;color:var(--text);">No pots yet</h3>
        <p>Click <strong>+ Add Pot</strong> to start saving!</p>
      </div>`;
    return;
  }

  container.innerHTML = pots.map(p => {
    const pct = Math.min(100, (p.total / p.target) * 100);
    return `
      <div class="pot-card-full">
        <div class="pot-card-top" style="background:${p.theme}"></div>
        <div class="pot-card-body">
          <div class="pot-card-name">${p.name}</div>
          <div class="pot-total-label">Total Saved</div>
          <div class="pot-total-amount">$${p.total.toFixed(2)}</div>
          <div class="pot-progress-track">
            <div class="pot-progress-fill"
                 style="width:${pct.toFixed(1)}%;background:${p.theme};"></div>
          </div>
          <div class="pot-progress-info">
            <span class="pot-progress-pct" style="color:${p.theme}">
              ${pct.toFixed(1)}%
            </span>
            <span>Target: $${p.target.toFixed(2)}</span>
          </div>
          <div class="pot-card-actions">
            <button class="pot-action-btn" data-id="${p.id}" data-action="add">
              + Add Money
            </button>
            <button class="pot-action-btn" data-id="${p.id}" data-action="withdraw">
              Withdraw
            </button>
            <button class="pot-action-btn danger" data-id="${p.id}" data-action="delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.pot-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = parseInt((btn as HTMLElement).dataset.id!);
      const action = (btn as HTMLElement).dataset.action!;
      const pot    = getPots().find(p => p.id === id);
      if (!pot) return;

      if (action === 'delete') {
        if (confirm(`Delete pot "${pot.name}"?`)) {
          deletePot(id);
          renderPotCards();
        }
      } else if (action === 'add') {
        const input = prompt(`Add money to "${pot.name}"\nCurrent: $${pot.total.toFixed(2)}\nHow much to add:`);
        const amt   = parseFloat(input || '0');
        if (!isNaN(amt) && amt > 0) {
          updatePot(id, pot.total + amt);
          renderPotCards();
        }
      } else if (action === 'withdraw') {
        const input = prompt(`Withdraw from "${pot.name}"\nCurrent: $${pot.total.toFixed(2)}\nHow much to withdraw:`);
        const amt   = parseFloat(input || '0');
        if (!isNaN(amt) && amt > 0 && amt <= pot.total) {
          updatePot(id, pot.total - amt);
          renderPotCards();
        } else if (amt > pot.total) {
          alert('Cannot withdraw more than the current balance!');
        }
      }
    });
  });
}

export function renderPots(): void {
  const app = document.getElementById('app') as HTMLElement;

  app.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;">
      <h1 style="font-size:28px;font-weight:800;">Pots</h1>
      <button id="add-pot-btn"
        style="background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px 20px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
        + Add Pot
      </button>
    </div>

    <div class="pots-grid" id="pots-container"></div>

    <!-- Modal -->
    <div id="pot-modal"
      style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:12px;padding:32px;width:100%;max-width:480px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:24px;">Add New Pot</h2>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Pot Name</label>
          <input type="text" id="p-name" placeholder="e.g. Holiday Fund"
            style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
        </div>

        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:8px;">Savings Target ($)</label>
          <input type="number" id="p-target" placeholder="e.g. 2000" min="1" step="0.01"
            style="width:100%;border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-family:var(--font);font-size:14px;outline:none;" />
        </div>

        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:12px;">Color Theme</label>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${THEMES.map((t, i) => `
              <label style="cursor:pointer;">
                <input type="radio" name="p-theme" value="${t}"
                  ${i === 0 ? 'checked' : ''} style="display:none;" />
                <span style="display:block;width:28px;height:28px;border-radius:50%;background:${t};
                  border:3px solid ${i === 0 ? '#333' : 'transparent'};transition:border 0.2s;"
                  class="p-theme-dot"></span>
              </label>
            `).join('')}
          </div>
        </div>

        <div id="p-error"
          style="color:var(--red);font-size:13px;margin-bottom:12px;display:none;"></div>

        <div style="display:flex;gap:12px;">
          <button id="cancel-pot"
            style="flex:1;background:var(--beige);border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
            Cancel
          </button>
          <button id="save-pot"
            style="flex:1;background:var(--sidebar-bg);color:white;border:none;border-radius:8px;padding:14px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;">
            Add Pot
          </button>
        </div>
      </div>
    </div>
  `;

  // Theme dot highlight
  document.querySelectorAll('input[name="p-theme"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.p-theme-dot').forEach(dot => {
        (dot as HTMLElement).style.borderColor = 'transparent';
      });
      (radio.nextElementSibling as HTMLElement).style.borderColor = '#333';
    });
  });

  document.getElementById('add-pot-btn')?.addEventListener('click', () => {
    (document.getElementById('pot-modal') as HTMLElement).style.display = 'flex';
  });

  document.getElementById('cancel-pot')?.addEventListener('click', () => {
    (document.getElementById('pot-modal') as HTMLElement).style.display = 'none';
  });

  document.getElementById('save-pot')?.addEventListener('click', () => {
    const name    = (document.getElementById('p-name') as HTMLInputElement).value.trim();
    const target  = parseFloat((document.getElementById('p-target') as HTMLInputElement).value);
    const theme   = (document.querySelector('input[name="p-theme"]:checked') as HTMLInputElement)?.value;
    const errorEl = document.getElementById('p-error') as HTMLElement;

    if (!name) {
      errorEl.textContent = 'Please enter a pot name.';
      errorEl.style.display = 'block'; return;
    }
    if (!target || target <= 0) {
      errorEl.textContent = 'Please enter a valid target amount.';
      errorEl.style.display = 'block'; return;
    }

    addPot({ id: Date.now(), name, target, total: 0, theme });
    (document.getElementById('pot-modal') as HTMLElement).style.display = 'none';
    renderPotCards();
  });

  renderPotCards();
}
import { login } from './auth.js';

export function renderLogin(): void {
  const app = document.getElementById('app') as HTMLElement;
  const sidebar = document.getElementById('sidebar') as HTMLElement;
  sidebar.style.display = 'none';
  app.style.marginLeft = '0';

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-logo">finance</div>
        <h1>Keep track of your money and save for your future</h1>
        <p>Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pots easily.</p>
      </div>
      <div class="auth-right">
        <div class="auth-card">
          <h2>Login</h2>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-password" placeholder="••••••••" />
          </div>
          <div class="form-error" id="login-error">Email or password is incorrect.</div>
          <button class="auth-submit" id="login-btn">Login</button>
          <div class="auth-switch">
            Need to create an account? <a id="go-register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-btn')?.addEventListener('click', () => {
    const email    = (document.getElementById('login-email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    const error    = document.getElementById('login-error') as HTMLElement;

    if (!email || !password) {
      error.textContent = 'Please fill in all fields.';
      error.classList.add('visible');
      return;
    }

    const user = login(email, password);
    if (user) {
      error.classList.remove('visible');
      window.dispatchEvent(new CustomEvent('logged-in'));
    } else {
      error.textContent = 'Email or password is incorrect.';
      error.classList.add('visible');
    }
  });

  document.getElementById('go-register')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('go-register'));
  });
}
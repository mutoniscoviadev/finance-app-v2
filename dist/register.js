import { getUsers, saveUser } from './auth.js';
export function renderRegister() {
    var _a, _b;
    const app = document.getElementById('app');
    const sidebar = document.getElementById('sidebar');
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
          <h2>Sign Up</h2>
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="reg-name" placeholder="Your full name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="reg-email" placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="reg-password" placeholder="At least 8 characters" />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="reg-confirm" placeholder="Repeat your password" />
          </div>
          <div class="form-error" id="reg-error"></div>
          <button class="auth-submit" id="register-btn">Create Account</button>
          <div class="auth-switch">
            Already have an account? <a id="go-login">Login</a>
          </div>
        </div>
      </div>
    </div>
  `;
    (_a = document.getElementById('register-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const error = document.getElementById('reg-error');
        if (!name || !email || !password || !confirm) {
            error.textContent = 'Please fill in all fields.';
            error.classList.add('visible');
            return;
        }
        if (password.length < 8) {
            error.textContent = 'Password must be at least 8 characters.';
            error.classList.add('visible');
            return;
        }
        if (password !== confirm) {
            error.textContent = 'Passwords do not match.';
            error.classList.add('visible');
            return;
        }
        const exists = getUsers().find(u => u.email === email);
        if (exists) {
            error.textContent = 'An account with this email already exists.';
            error.classList.add('visible');
            return;
        }
        saveUser({ name, email, password });
        error.classList.remove('visible');
        alert('Account created! Please login.');
        window.dispatchEvent(new CustomEvent('go-login'));
    });
    (_b = document.getElementById('go-login')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('go-login'));
    });
}

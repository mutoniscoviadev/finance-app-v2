export interface User {
  name: string;
  email: string;
  password: string;
}

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('finance_users') || '[]');
}

export function getCurrentUser(): User | null {
  return JSON.parse(localStorage.getItem('finance_current_user') || 'null');
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('finance_users', JSON.stringify(users));
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const found = users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() &&
         u.password === password
  );
  if (found) {
    localStorage.setItem('finance_current_user', JSON.stringify(found));
    return found;
  }
  return null;
}

export function logout(): void {
  // Only remove session — keep users and data!
  localStorage.removeItem('finance_current_user');
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
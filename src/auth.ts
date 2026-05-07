export interface User {
  name: string;
  email: string;
  password: string;
}

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem('finance_users') || '[]');
  } catch {
    return [];
  }
}

export function getCurrentUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem('finance_current_user') || 'null');
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('finance_users', JSON.stringify(users));
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const found = users.find(
    u => u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
         u.password === password
  );
  if (found) {
    localStorage.setItem('finance_current_user', JSON.stringify(found));
    return found;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem('finance_current_user');
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
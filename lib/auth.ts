export function saveSession(accessToken: string) {
  localStorage.setItem('token', accessToken);
}

export function clearSession() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return typeof window !== 'undefined' && !!localStorage.getItem('token');
}

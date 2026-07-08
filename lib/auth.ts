type Matchmaker = { id: string; name: string; email: string };

export function saveSession(accessToken: string, matchmaker?: Matchmaker) {
  localStorage.setItem('token', accessToken);
  if (matchmaker) localStorage.setItem('matchmaker', JSON.stringify(matchmaker));
}

export function getMatchmaker(): Matchmaker | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('matchmaker');
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('matchmaker');
}

export function isLoggedIn() {
  return typeof window !== 'undefined' && !!localStorage.getItem('token');
}

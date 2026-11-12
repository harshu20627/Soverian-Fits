const USERS_KEY = 'soverian_fit_users';
export const SESSION_KEY = 'soverian_fit_session';
export const AUTH_CHANGED_EVENT = 'soverian:auth-changed';
export const AUTH_REQUIRED_EVENT = 'soverian:auth-required';

const announceAuthChanged = () => {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const requestAuthentication = () => {
  window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT));
};

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const registerUser = async ({ name, email, phone, password }) => {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
  announceAuthChanged();

  return user;
};

export const loginUser = async ({ email, password }) => {
  const users = readUsers();
  const user = users.find((item) => item.email === normalizeEmail(email));

  if (!user) throw new Error('INVALID_CREDENTIALS');

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const session = { id: user.id, name: user.name, email: user.email };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  announceAuthChanged();
  return session;
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  sessionStorage.removeItem(SESSION_KEY);
  announceAuthChanged();
};

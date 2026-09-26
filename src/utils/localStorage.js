// localStorage.js
// Only stores the logged-in user session (token + currentUser).
// All application data now comes from the backend API.

const CURRENT_USER_KEY = 'currentUser';

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  try {
    if (user === null || user === undefined) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error saving currentUser to localStorage', err);
  }
};

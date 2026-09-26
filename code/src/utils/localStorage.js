import { initialUsers } from '../data/users';
import { initialChallenges } from '../data/challenges';
import { initialRewards } from '../data/rewards';
import { initialBadges } from '../data/badges';
import { initialSubmissions } from '../data/submissions';
import { initialNotifications } from '../data/notifications';
import { initialVendorCoupons, initialRedemptions } from '../data/coupons';

const KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  CHALLENGES: 'challenges',
  REWARDS: 'rewards',
  BADGES: 'badges',
  SUBMISSIONS: 'submissions',
  NOTIFICATIONS: 'notifications',
  REDEMPTIONS: 'redemptions',
  COUPONS: 'coupons',
};

export const initLocalStorage = () => {
  const existingUsersStr = localStorage.getItem(KEYS.USERS);
  if (!existingUsersStr) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  } else {
    try {
      const parsedUsers = JSON.parse(existingUsersStr);
      let updated = false;
      initialUsers.forEach(demoU => {
        const idx = parsedUsers.findIndex(u => u.email.toLowerCase() === demoU.email.toLowerCase());
        if (idx !== -1) {
          if (parsedUsers[idx].password !== demoU.password) {
            parsedUsers[idx].password = demoU.password;
            updated = true;
          }
        } else {
          parsedUsers.push(demoU);
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(parsedUsers));
      }
    } catch {
      localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
    }
  }

  if (!localStorage.getItem(KEYS.CHALLENGES)) {
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(initialChallenges));
  }
  if (!localStorage.getItem(KEYS.REWARDS)) {
    localStorage.setItem(KEYS.REWARDS, JSON.stringify(initialRewards));
  }
  if (!localStorage.getItem(KEYS.BADGES)) {
    localStorage.setItem(KEYS.BADGES, JSON.stringify(initialBadges));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
  if (!localStorage.getItem(KEYS.REDEMPTIONS)) {
    localStorage.setItem(KEYS.REDEMPTIONS, JSON.stringify(initialRedemptions));
  }
  if (!localStorage.getItem(KEYS.COUPONS)) {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(initialVendorCoupons));
  }
};

// Generic Helpers
export const getItem = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setItem = (key, data) => {
  try {
    if (data === null || data === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (err) {
    console.error(`Error saving to localStorage key: ${key}`, err);
  }
};

export const getUsers = () => {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      const fallback = initialUsers ? [...initialUsers] : [];
      localStorage.setItem(KEYS.USERS, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setUsers = (users) => {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(Array.isArray(users) ? users : []));
  } catch (err) {
    console.error('Error saving users to localStorage', err);
  }
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  try {
    if (user === null || user === undefined) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error saving currentUser to localStorage', err);
  }
};

export const getChallenges = () => getItem(KEYS.CHALLENGES, initialChallenges);
export const setChallenges = (challenges) => setItem(KEYS.CHALLENGES, challenges);

export const getRewards = () => getItem(KEYS.REWARDS, initialRewards);
export const setRewards = (rewards) => setItem(KEYS.REWARDS, rewards);

export const getBadges = () => getItem(KEYS.BADGES, initialBadges);
export const setBadges = (badges) => setItem(KEYS.BADGES, badges);

export const getSubmissions = () => getItem(KEYS.SUBMISSIONS, initialSubmissions);
export const setSubmissions = (submissions) => setItem(KEYS.SUBMISSIONS, submissions);

export const getNotifications = () => getItem(KEYS.NOTIFICATIONS, initialNotifications);
export const setNotifications = (notifs) => setItem(KEYS.NOTIFICATIONS, notifs);

export const getRedemptions = () => getItem(KEYS.REDEMPTIONS, initialRedemptions);
export const setRedemptions = (redemptions) => setItem(KEYS.REDEMPTIONS, redemptions);

export const getCoupons = () => getItem(KEYS.COUPONS, initialVendorCoupons);
export const setCoupons = (coupons) => setItem(KEYS.COUPONS, coupons);

export const resetToDefaults = () => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(initialChallenges));
  localStorage.setItem(KEYS.REWARDS, JSON.stringify(initialRewards));
  localStorage.setItem(KEYS.BADGES, JSON.stringify(initialBadges));
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  localStorage.setItem(KEYS.REDEMPTIONS, JSON.stringify(initialRedemptions));
  localStorage.setItem(KEYS.COUPONS, JSON.stringify(initialVendorCoupons));
  localStorage.removeItem(KEYS.CURRENT_USER);
};

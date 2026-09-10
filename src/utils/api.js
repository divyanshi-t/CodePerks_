// api.js - Thin API wrapper for CodePerks backend
// All fetch calls go through here. Token is read from localStorage automatically.

const BASE_URL = '/api';

const getToken = () => {
  try {
    const raw = localStorage.getItem('cpToken');
    return raw ? raw : null;
  } catch {
    return null;
  }
};

const headers = () => {
  const token = getToken();
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

const request = async (method, path, body = null) => {
  const options = {
    method,
    headers: headers()
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// --- Auth ---
export const apiSignup = (payload) => request('POST', '/auth/signup', payload);
export const apiLogin = (payload) => request('POST', '/auth/login', payload);
export const apiGetMe = () => request('GET', '/auth/me');

// --- Users ---
export const apiGetUsers = () => request('GET', '/users');
export const apiGetUserById = (id) => request('GET', `/users/${id}`);
export const apiUpdateUser = (id, payload) => request('PUT', `/users/${id}`, payload);

// --- Challenges ---
export const apiGetChallenges = () => request('GET', '/challenges');
export const apiGetChallengeById = (id) => request('GET', `/challenges/${id}`);
export const apiCreateChallenge = (payload) => request('POST', '/challenges', payload);
export const apiUpdateChallenge = (id, payload) => request('PUT', `/challenges/${id}`, payload);
export const apiDeleteChallenge = (id) => request('DELETE', `/challenges/${id}`);

// --- Submissions ---
export const apiCreateSubmission = (payload) => request('POST', '/submissions', payload);
export const apiGetSubmissions = () => request('GET', '/submissions');
export const apiGetSubmissionsByUser = (userId) => request('GET', `/submissions/user/${userId}`);
export const apiGetSubmissionsByChallenge = (challengeId) => request('GET', `/submissions/challenge/${challengeId}`);
export const apiGetSubmissionById = (id) => request('GET', `/submissions/${id}`);

// --- Rewards ---
export const apiGetRewards = () => request('GET', '/rewards');
export const apiCreateReward = (payload) => request('POST', '/rewards', payload);
export const apiUpdateReward = (id, payload) => request('PUT', `/rewards/${id}`, payload);
export const apiDeleteReward = (id) => request('DELETE', `/rewards/${id}`);

// --- Redemptions ---
export const apiGetRedemptions = () => request('GET', '/redemptions');
export const apiGetRedemptionsByUser = (userId) => request('GET', `/redemptions/user/${userId}`);
export const apiCreateRedemption = (payload) => request('POST', '/redemptions', payload);
export const apiUpdateRedemption = (id, payload) => request('PUT', `/redemptions/${id}`, payload);

// --- Coupons ---
export const apiGetCoupons = () => request('GET', '/coupons');
export const apiCreateCoupon = (payload) => request('POST', '/coupons', payload);
export const apiUpdateCoupon = (id, payload) => request('PUT', `/coupons/${id}`, payload);
export const apiDeleteCoupon = (id) => request('DELETE', `/coupons/${id}`);

// Save token to localStorage
export const saveToken = (token) => {
  try {
    if (token) localStorage.setItem('cpToken', token);
    else localStorage.removeItem('cpToken');
  } catch {}
};

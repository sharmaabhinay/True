import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'tf_auth';
const USERS_KEY   = 'tf_users';

function loadAuth() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
function saveAuth(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}
export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            loadAuth(),
    loginModalOpen:  false,
    signupModalOpen: false,
    redirectAfterLogin: null,
    error: null,
  },
  reducers: {
    openLoginModal(state, { payload }) {
      state.loginModalOpen  = true;
      state.signupModalOpen = false;
      state.redirectAfterLogin = payload || null;
    },
    openSignupModal(state) {
      state.signupModalOpen = true;
      state.loginModalOpen  = false;
    },
    closeAuthModals(state) {
      state.loginModalOpen  = false;
      state.signupModalOpen = false;
      state.error           = null;
    },
    switchToSignup(state) { state.loginModalOpen=false; state.signupModalOpen=true; state.error=null; },
    switchToLogin(state)  { state.signupModalOpen=false; state.loginModalOpen=true; state.error=null; },

    signup(state, { payload: { name, email, phone, password } }) {
      const users = getUsers();
      if (users.find(u => u.email === email)) { state.error = 'Email already registered.'; return; }
      const user = {
        id:         Date.now(),
        name,
        email,
        phone:      phone || '',
        password,
        address:    null,
        avatar:     name.slice(0,2).toUpperCase(),
        createdAt:  new Date().toISOString(),
        lastLogin:  new Date().toISOString(),
        orders:     [],
        wishlist:   [],
        cart:       [],
        sessions:   [{ time: new Date().toISOString(), ua: navigator.userAgent }],
      };
      users.push(user);
      saveUsers(users);
      const safeUser = { ...user }; delete safeUser.password;
      state.user           = safeUser;
      state.loginModalOpen = false;
      state.signupModalOpen= false;
      state.error          = null;
      saveAuth(safeUser);
    },

    login(state, { payload: { email, password } }) {
      const users = getUsers();
      const user  = users.find(u => u.email === email && u.password === password);
      if (!user) { state.error = 'Invalid email or password.'; return; }
      user.lastLogin = new Date().toISOString();
      if (!user.sessions) user.sessions = [];
      user.sessions.push({ time: new Date().toISOString(), ua: navigator.userAgent });
      saveUsers(users);
      const safeUser = { ...user }; delete safeUser.password;
      state.user            = safeUser;
      state.loginModalOpen  = false;
      state.signupModalOpen = false;
      state.error           = null;
      saveAuth(safeUser);
    },

    logout(state) {
      state.user = null;
      saveAuth(null);
    },

    updateProfile(state, { payload }) {
      if (!state.user) return;
      state.user = { ...state.user, ...payload };
      saveAuth(state.user);
      // sync to users list
      const users = getUsers();
      const idx   = users.findIndex(u => u.id === state.user.id);
      if (idx > -1) { users[idx] = { ...users[idx], ...payload }; saveUsers(users); }
    },

    saveAddress(state, { payload }) {
      if (!state.user) return;
      state.user.address = payload;
      saveAuth(state.user);
      const users = getUsers();
      const idx   = users.findIndex(u => u.id === state.user.id);
      if (idx > -1) { users[idx].address = payload; saveUsers(users); }
    },

    clearError(state) { state.error = null; },
  },
});

export const {
  openLoginModal, openSignupModal, closeAuthModals,
  switchToSignup, switchToLogin,
  signup, login, logout,
  updateProfile, saveAddress, clearError,
} = authSlice.actions;

export const selectUser             = s => s.auth.user;
export const selectIsLoggedIn       = s => !!s.auth.user;
export const selectLoginModalOpen   = s => s.auth.loginModalOpen;
export const selectSignupModalOpen  = s => s.auth.signupModalOpen;
export const selectAuthError        = s => s.auth.error;
export const selectRedirectAfterLogin = s => s.auth.redirectAfterLogin;

export default authSlice.reducer;

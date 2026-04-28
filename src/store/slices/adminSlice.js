import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    isAuthenticated: sessionStorage.getItem('tf_admin') === 'true',
    activePanel: 'dashboard',
    pmSearch: '',
    pmCatFilter: '',
    logFilter: 'all',
    sidebarOpen: false,
    editingProductId: null,
    toastMsg: '',
    toastVisible: false,
    toastType: 'success',
  },
  reducers: {
    login(state)  { state.isAuthenticated = true;  sessionStorage.setItem('tf_admin','true'); },
    logout(state) { state.isAuthenticated = false; sessionStorage.removeItem('tf_admin'); },
    setPanel(state, { payload })         { state.activePanel = payload; },
    setPMSearch(state, { payload })      { state.pmSearch = payload; },
    setPMCatFilter(state, { payload })   { state.pmCatFilter = payload; },
    setLogFilter(state, { payload })     { state.logFilter = payload; },
    toggleSidebar(state)                 { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar(state)                  { state.sidebarOpen = false; },
    setEditingProduct(state, { payload }){ state.editingProductId = payload; },
    clearEditing(state)                  { state.editingProductId = null; },
    showAdminToast(state, { payload: { msg, type='success' } }) {
      state.toastMsg = msg; state.toastVisible = true; state.toastType = type;
    },
    hideAdminToast(state) { state.toastVisible = false; },
  },
});

export const {
  login, logout, setPanel, setPMSearch, setPMCatFilter,
  setLogFilter, toggleSidebar, closeSidebar,
  setEditingProduct, clearEditing, showAdminToast, hideAdminToast,
} = adminSlice.actions;

export const selectAdminAuth       = s => s.admin.isAuthenticated;
export const selectActivePanel     = s => s.admin.activePanel;
export const selectPMSearch        = s => s.admin.pmSearch;
export const selectPMCatFilter     = s => s.admin.pmCatFilter;
export const selectLogFilter       = s => s.admin.logFilter;
export const selectSidebarOpen     = s => s.admin.sidebarOpen;
export const selectEditingProductId= s => s.admin.editingProductId;
export const selectAdminToast      = s => ({ msg:s.admin.toastMsg, visible:s.admin.toastVisible, type:s.admin.toastType });

export default adminSlice.reducer;

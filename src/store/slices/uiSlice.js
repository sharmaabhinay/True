import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartOpen:       false,
    quoteModalOpen: false,
    mobileNavOpen:  false,
    loaderVisible:  true,
    toastMsg:       '',
    toastVisible:   false,
    navScrolled:    false,
    locStripVisible:false,
    locCity:        'Indore & nearby cities',
    currentModel:   'sofa',
    selectedColor:  '#8B6B4A',
    selectedSize:   '2-Seater',
    selectedPrice:  38500,
    activeModelTab: 'details',
    customOBJGeo:   null,
    quotePreFill:   '',
    showQuotePopup: false,
  },
  reducers: {
    openCart(state)           { state.cartOpen = true; },
    closeCart(state)          { state.cartOpen = false; },
    openQuoteModal(state, { payload }) { state.quoteModalOpen = true; if (payload) state.quotePreFill = payload; },
    closeQuoteModal(state)    { state.quoteModalOpen = false; state.quotePreFill = ''; },
    toggleMobileNav(state)    { state.mobileNavOpen = !state.mobileNavOpen; },
    closeMobileNav(state)     { state.mobileNavOpen = false; },
    hideLoader(state)         { state.loaderVisible = false; },
    showToast(state, { payload }) { state.toastMsg = payload; state.toastVisible = true; },
    hideToast(state)          { state.toastVisible = false; },
    setNavScrolled(state, { payload }) { state.navScrolled = payload; },
    setLocStrip(state, { payload }) { state.locStripVisible = true; state.locCity = payload; },
    setCurrentModel(state, { payload }) { state.currentModel = payload; state.customOBJGeo = null; },
    setSelectedColor(state, { payload }) { state.selectedColor = payload; },
    setSelectedSize(state, { payload: { size, price } }) { state.selectedSize = size; state.selectedPrice = price; },
    setModelTab(state, { payload }) { state.activeModelTab = payload; },
    setCustomOBJ(state, { payload }) { state.customOBJGeo = payload; },
    setShowQuotePopup(state, { payload }) { state.showQuotePopup = payload; },
  },
});

export const {
  openCart, closeCart, openQuoteModal, closeQuoteModal,
  toggleMobileNav, closeMobileNav, hideLoader,
  showToast, hideToast, setNavScrolled,
  setLocStrip, setCurrentModel, setSelectedColor,
  setSelectedSize, setModelTab, setCustomOBJ, setShowQuotePopup,
} = uiSlice.actions;

export const selectCartOpen        = s => s.ui.cartOpen;
export const selectQuoteModalOpen  = s => s.ui.quoteModalOpen;
export const selectMobileNavOpen   = s => s.ui.mobileNavOpen;
export const selectLoaderVisible   = s => s.ui.loaderVisible;
export const selectToast           = s => ({ msg: s.ui.toastMsg, visible: s.ui.toastVisible });
export const selectNavScrolled     = s => s.ui.navScrolled;
export const selectLocStrip        = s => ({ visible: s.ui.locStripVisible, city: s.ui.locCity });
export const selectModelState      = s => ({
  model:    s.ui.currentModel, color: s.ui.selectedColor,
  size:     s.ui.selectedSize, price: s.ui.selectedPrice,
  tab:      s.ui.activeModelTab, customGeo: s.ui.customOBJGeo,
});
export const selectShowQuotePopup  = s => s.ui.showQuotePopup;
export const selectQuotePreFill    = s => s.ui.quotePreFill;

export default uiSlice.reducer;

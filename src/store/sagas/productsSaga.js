import { takeEvery } from 'redux-saga/effects';
import { storage } from '../../utils/localStorage';

// Persist products to localStorage whenever they change via admin actions
function syncProducts({ payload, type }) {
  // productsSlice reducers already call storage.saveProducts internally,
  // but this saga provides a hook for future API sync (e.g. PUT /api/products)
  if (import.meta.env.DEV) {
    console.debug('[productsSaga] synced:', type, payload?.id || '');
  }
}

// Reload products from localStorage (e.g. after admin update from another tab)
function handleStorageEvent(e) {
  if (e.key === 'tf_products') {
    // Dispatch to store from outside React — handled via window event listener in App
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', handleStorageEvent);
}

export function* watchProducts() {
  yield takeEvery([
    'products/addProduct',
    'products/updateProduct',
    'products/deleteProduct',
    'products/toggleProductActive',
  ], syncProducts);
}

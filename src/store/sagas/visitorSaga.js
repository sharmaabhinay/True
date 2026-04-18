import { takeEvery, delay, put } from 'redux-saga/effects';
import { hideToast } from '../slices/uiSlice';
import { hideAdminToast } from '../slices/adminSlice';
import { pushEvent } from '../slices/visitorSlice';

// Auto-dismiss store toast after 3s
function* autoHideToast() {
  yield delay(3000);
  yield put(hideToast());
}

// Auto-dismiss admin toast after 3s
function* autoHideAdminToast() {
  yield delay(3000);
  yield put(hideAdminToast());
}

// Track add-to-cart events
function* trackCartEvent({ payload }) {
  yield put(pushEvent({ type: 'add_to_cart', item: payload.name }));
}

// Track 3D view events
function* trackModelView({ payload }) {
  yield put(pushEvent({ type: 'view_3d', item: payload }));
}

export function* watchVisitor() {
  yield takeEvery('ui/showToast',           autoHideToast);
  yield takeEvery('admin/showAdminToast',   autoHideAdminToast);
  yield takeEvery('cart/addToCart',         trackCartEvent);
  yield takeEvery('TRACK_MODEL_VIEW',       trackModelView);
}

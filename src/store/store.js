import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import cartReducer     from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import uiReducer       from './slices/uiSlice';
import visitorReducer  from './slices/visitorSlice';
import adminReducer    from './slices/adminSlice';
import authReducer     from './slices/authSlice';
import orderReducer    from './slices/orderSlice';
import rootSaga        from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    cart:     cartReducer,
    products: productsReducer,
    ui:       uiReducer,
    visitors: visitorReducer,
    admin:    adminReducer,
    auth:     authReducer,
    orders:   orderReducer,
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
});

sagaMiddleware.run(rootSaga);
export default store;

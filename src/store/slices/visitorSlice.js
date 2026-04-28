import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/localStorage';

const visitorSlice = createSlice({
  name: 'visitors',
  initialState: {
    list: storage.getVisitors(),
    locationLoading: false,
  },
  reducers: {
    pushEvent(state, { payload }) {
      const entry = { ...payload, time: new Date().toISOString() };
      state.list.push(entry);
      storage.pushVisitor(payload);
    },
    setLocationLoading(state, { payload }) {
      state.locationLoading = payload;
    },
    clearAll(state) {
      state.list = [];
      storage.clearVisitors();
    },
    reloadFromStorage(state) {
      state.list = storage.getVisitors();
    },
  },
});

export const { pushEvent, setLocationLoading, clearAll, reloadFromStorage } = visitorSlice.actions;

export const selectVisitors        = s => s.visitors.list;
export const selectVisitorsByType  = (type) => s => s.visitors.list.filter(v => v.type === type);
export const selectUniqueCities    = s => [...new Set(s.visitors.list.filter(v=>v.type==='visit'&&v.city).map(v=>v.city))];
export const selectLocationLoading = s => s.visitors.locationLoading;

export default visitorSlice.reducer;

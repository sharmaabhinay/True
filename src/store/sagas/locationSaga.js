import { call, put, takeLatest } from 'redux-saga/effects';
import { setLocStrip } from '../slices/uiSlice';
import { pushEvent, setLocationLoading } from '../slices/visitorSlice';

const GEO_API = import.meta.env.VITE_GEO_API || 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('No geolocation')); return; }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
  });
}

async function reverseGeocode(lat, lon) {
  const res = await fetch(`${GEO_API}?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  if (!res.ok) throw new Error('Geocode failed');
  return res.json();
}

function* fetchLocationSaga() {
  yield put(setLocationLoading(true));
  try {
    const pos = yield call(getPosition);
    const { latitude: lat, longitude: lon } = pos.coords;
    const data = yield call(reverseGeocode, lat, lon);
    const city = data.city || data.locality || data.principalSubdivision || 'Indore';
    yield put(setLocStrip(city));
    yield put(pushEvent({
      type: 'visit',
      city,
      lat,
      lon,
      ref: document.referrer || 'direct',
      ua: navigator.userAgent,
    }));
  } catch {
    yield put(setLocStrip('Indore & nearby cities'));
  } finally {
    yield put(setLocationLoading(false));
  }
}

export function* watchLocation() {
  yield takeLatest('FETCH_LOCATION', fetchLocationSaga);
}

export const FETCH_LOCATION = { type: 'FETCH_LOCATION' };

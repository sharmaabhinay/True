import { all, fork } from 'redux-saga/effects';
import { watchLocation } from './locationSaga';
import { watchVisitor }  from './visitorSaga';
import { watchProducts } from './productsSaga';

export default function* rootSaga() {
  yield all([
    fork(watchLocation),
    fork(watchVisitor),
    fork(watchProducts),
  ]);
}

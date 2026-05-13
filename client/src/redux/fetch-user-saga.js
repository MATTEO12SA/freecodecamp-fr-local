import { put, takeEvery } from 'redux-saga/effects';
import {
  buildLocalUser,
  ensureLocalUserInitialized
} from '../utils/local-progress';
import { fetchUserComplete } from './actions';

function* fetchSessionUser() {
  ensureLocalUserInitialized();
  const user = buildLocalUser();
  yield put(fetchUserComplete({ user }));
}

function* fetchOtherUser() {
  // Profile pages are removed; this saga is a no-op kept so the action does
  // not raise a warning if dispatched.
}

export function createFetchUserSaga(types) {
  return [
    takeEvery(types.fetchUser, fetchSessionUser),
    takeEvery(types.fetchProfileForUser, fetchOtherUser)
  ];
}

import { createEpicMiddleware } from 'redux-observable';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';

import { isBrowser } from '../../utils';
import {
  examAttempts,
  examEnvironmentAuthorizationTokenApi
} from '../utils/ajax';
import rootEpic from './root-epic';
import rootReducer from './root-reducer';
import rootSaga from './root-saga';

declare const module: {
  hot?: {
    accept: (path: string, callback: () => void) => void;
  };
};

export const createStore = (preloadedState = {}) => {
  const clientSide = isBrowser();
  const sagaMiddleware = createSagaMiddleware({
    context: {
      document: clientSide ? document : {}
    }
  });
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      window: clientSide ? window : {},
      location: clientSide ? window.location : {},
      document: clientSide ? document : {}
    }
  });

  const store = configureStore({
    // @ts-expect-error RTK uses unknown, Redux uses any
    reducer: rootReducer,
    // @ts-expect-error RTK uses unknown, Redux uses any
    middleware: getDefaultMiddleware => {
      // RTK's dev-only immutability and serializability checks recurse through
      // the entire state on every action. With our local-progress payloads
      // they hit "Maximum call stack size exceeded". They are dev-only safety
      // nets and not needed in this standalone build.
      return getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
      })
        .concat(examAttempts.middleware)
        .concat(examEnvironmentAuthorizationTokenApi.middleware)
        .concat(sagaMiddleware)
        .concat(epicMiddleware);
    },
    preloadedState
  });
  sagaMiddleware.run(rootSaga);
  epicMiddleware.run(rootEpic);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./root-reducer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      const nextRootReducer = require('./root-reducer');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};

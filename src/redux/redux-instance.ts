import { useDispatch } from 'react-redux';
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { auth } from '~/redux/features/auth/auth-slice';

const authReducer = auth.reducer;

export const rootReducer = combineReducers({
  auth: authReducer,
});

// Create a transformed reducer for redux-persist
const persistedReducer = persistReducer(
  {
    storage: localStorage,
    key: 'root',
    whitelist: ['auth', 'authCometChat', 'userTrace'],
  },
  rootReducer,
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});
const persistor = persistStore(store);

// Hooks for typed dispatch:
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export { store, persistor };

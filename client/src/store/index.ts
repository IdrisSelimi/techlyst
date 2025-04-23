import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import listingsReducer from './slices/listingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    listings: listingsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
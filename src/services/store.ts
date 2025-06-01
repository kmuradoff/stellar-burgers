import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { ingredientSlice } from './slices/Ingredients-slice';
import { constructorSlice } from './slices/constructor-slice';
import { feedSlice } from './slices/feed-slice';
import { orderSlice } from './slices/order-slice';
import { userSlice } from './slices/user-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  [ingredientSlice.name]: ingredientSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [userSlice.name]: userSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

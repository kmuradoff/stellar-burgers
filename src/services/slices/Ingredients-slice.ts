import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { INGREDIENTS_SLICE_NAME } from '../../utils/constants';

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

export interface IIngredirntsSlice {
  ingredients: TIngredient[];
  error: string | undefined;
  isLoading: boolean;
}

const initialState: IIngredirntsSlice = {
  ingredients: [],
  error: undefined,
  isLoading: false
};

export const ingredientSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    ingredientSelector: (state) => state.ingredients,
    ingredientSelectorIsLoading: (state) => state.isLoading
  }
});

export const { ingredientSelector, ingredientSelectorIsLoading } =
  ingredientSlice.selectors;

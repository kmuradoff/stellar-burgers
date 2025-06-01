import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import {
  TIngredient,
  TConstructorIngredient,
  TMoveIngredient
} from '@utils-types';
import { CONSTRUCTOR_SLICE_NAME } from '../../utils/constants';

export interface IconstrustorSlise {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IconstrustorSlise = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: CONSTRUCTOR_SLICE_NAME,
  initialState,
  reducers: {
    addToBurger: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type == 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveIngredient: (state, action: PayloadAction<TMoveIngredient>) => {
      const { index, direction } = action.payload;
      const ingredients = [...state.ingredients];

      if (direction === 'up') {
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      } else if (direction === 'down') {
        [ingredients[index + 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index + 1]
        ];
      }

      state.ingredients = ingredients;
    },

    removeIngredients: (state) => {
      (state.bun = null), (state.ingredients = []);
    }
  },
  selectors: {
    burgerSelector: (state) => state
  }
});

export const { burgerSelector } = constructorSlice.selectors;

export const {
  addToBurger,
  removeIngredients,
  removeIngredient,
  moveIngredient
} = constructorSlice.actions;

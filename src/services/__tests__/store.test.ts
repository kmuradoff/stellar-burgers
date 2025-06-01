import store from '../store';
import { constructorSlice } from '../slices/constructor-slice';
import { ingredientSlice, fetchIngredients } from '../slices/Ingredients-slice';
import { orderSlice, fetchOrder } from '../slices/order-slice';
import {
  userSlice,
  loginUser,
  registerUser,
  logout,
  updateUser
} from '../slices/user-slice';
import { feedSlice, fetchFeed } from '../slices/feed-slice';
import { TIngredient, TMoveIngredient, TOrdersData } from '../../utils/types';

describe('Redux Store', () => {
  it('should handle unknown action', () => {
    const initialState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    expect(store.getState()).toEqual(initialState);
  });

  describe('Constructor Slice', () => {
    const mockIngredient: TIngredient = {
      _id: '1',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'test.jpg',
      image_mobile: 'test-mobile.jpg',
      image_large: 'test-large.jpg'
    };

    it('should handle addToBurger', () => {
      store.dispatch(constructorSlice.actions.addToBurger(mockIngredient));
      const state = store.getState().constructorBurger;
      expect(state.ingredients).toContainEqual(
        expect.objectContaining({ _id: '1' })
      );
    });

    it('should handle removeIngredient', () => {
      store.dispatch(constructorSlice.actions.removeIngredients());
      store.dispatch(constructorSlice.actions.addToBurger(mockIngredient));
      const added = store.getState().constructorBurger.ingredients[0];
      store.dispatch(constructorSlice.actions.removeIngredient(added.id));
      const state = store.getState().constructorBurger;
      expect(state.ingredients).not.toContainEqual(
        expect.objectContaining({ _id: '1' })
      );
    });

    it('should handle moveIngredient', () => {
      store.dispatch(constructorSlice.actions.addToBurger(mockIngredient));
      store.dispatch(
        constructorSlice.actions.addToBurger({ ...mockIngredient, _id: '2' })
      );
      const mockMove = { index: 0, direction: 'down' };
      store.dispatch(constructorSlice.actions.moveIngredient(mockMove));
      const state = store.getState().constructorBurger;
      expect(state.ingredients[1]._id).toEqual('1');
    });

    it('should handle removeIngredients', () => {
      store.dispatch(constructorSlice.actions.addToBurger(mockIngredient));
      store.dispatch(constructorSlice.actions.removeIngredients());
      const state = store.getState().constructorBurger;
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Ingredient Slice', () => {
    it('should handle fetchIngredients.pending', () => {
      store.dispatch(fetchIngredients.pending(''));
      const state = store.getState().ingredients;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const mockIngredients = [
        {
          _id: '1',
          name: 'Test Ingredient',
          type: 'main',
          proteins: 10,
          fat: 10,
          carbohydrates: 10,
          calories: 100,
          price: 100,
          image: 'test.jpg',
          image_mobile: 'test-mobile.jpg',
          image_large: 'test-large.jpg'
        }
      ];
      store.dispatch(
        fetchIngredients.fulfilled(mockIngredients, '', undefined)
      );
      const state = store.getState().ingredients;
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeUndefined();
    });

    it('should handle fetchIngredients.rejected', () => {
      const error = 'Failed to fetch ingredients';
      store.dispatch(
        fetchIngredients.rejected(new Error(error), '', undefined)
      );
      const state = store.getState().ingredients;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('Order Slice', () => {
    it('should handle fetchOrder.pending', () => {
      store.dispatch(fetchOrder.pending('', []));
      const state = store.getState().order;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeUndefined();
    });
  });

  describe('Auth Slice', () => {
    it('should handle login.pending', () => {
      store.dispatch(loginUser.pending('', { email: '', password: '' }));
      const state = store.getState().user;
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeUndefined();
    });

    it('should handle login.fulfilled', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User'
      };
      store.dispatch(
        loginUser.fulfilled(mockUser, '', { email: '', password: '' })
      );
      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('should handle login.rejected', () => {
      const error = 'Failed to login';
      store.dispatch(
        loginUser.rejected(new Error(error), '', { email: '', password: '' })
      );
      const state = store.getState().user;
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(error);
    });

    it('should handle register.pending', () => {
      store.dispatch(
        registerUser.pending('', { email: '', password: '', name: '' })
      );
      const state = store.getState().user;
      expect(state.isAuthChecked).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeUndefined();
    });

    it('should handle register.fulfilled', () => {
      const mockUser = {
        success: true,
        refreshToken: 'mock-refresh-token',
        accessToken: 'mock-access-token',
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      };
      store.dispatch(
        registerUser.fulfilled(mockUser, '', {
          email: '',
          password: '',
          name: ''
        })
      );
      const state = store.getState().user;
      expect(state.user).toEqual(mockUser.user);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('should handle register.rejected', () => {
      const error = 'Failed to register';
      store.dispatch(
        registerUser.rejected(new Error(error), '', {
          email: '',
          password: '',
          name: ''
        })
      );
      const state = store.getState().user;
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe(error);
    });

    it('should handle logout', () => {
      store.dispatch(logout.pending(''));
      let state = store.getState().user;
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeUndefined();
      store.dispatch(logout.fulfilled(undefined, ''));
      state = store.getState().user;
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });

    it('should handle updateUser.pending', () => {
      store.dispatch(updateUser.pending('', { email: '', name: '' }));
      const state = store.getState().user;
      expect(state.error).toBeUndefined();
    });

    it('should handle updateUser.fulfilled', () => {
      const mockUser = {
        success: true,
        user: {
          email: 'updated@example.com',
          name: 'Updated User'
        }
      };
      store.dispatch(
        updateUser.fulfilled(mockUser, '', { email: '', name: '' })
      );
      const state = store.getState().user;
      expect(state.user).toEqual(mockUser.user);
    });

    it('should handle updateUser.rejected', () => {
      const error = 'Failed to update user';
      store.dispatch(
        updateUser.rejected(new Error(error), '', { email: '', name: '' })
      );
      const state = store.getState().user;
      expect(state.error).toBe(error);
    });
  });

  describe('Feed Slice', () => {
    it('should handle fetchFeed.pending', () => {
      store.dispatch(fetchFeed.pending(''));
      const state = store.getState().feed;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('should handle fetchFeed.fulfilled', () => {
      const mockFeed: any = {
        success: true,
        orders: [
          {
            _id: '1',
            ingredients: ['1', '2'],
            status: 'done',
            name: 'Test Order',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:00:00.000Z',
            number: 12345
          }
        ],
        total: 1,
        totalToday: 1
      };
      store.dispatch(fetchFeed.fulfilled(mockFeed, '', undefined));
      const state = store.getState().feed;
      expect(state.feed.orders).toEqual(mockFeed.orders);
      expect(state.feed.total).toBe(mockFeed.total);
      expect(state.feed.totalToday).toBe(mockFeed.totalToday);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeUndefined();
    });

    it('should handle fetchFeed.rejected', () => {
      const error = 'Failed to fetch feed';
      store.dispatch(fetchFeed.rejected(new Error(error), '', undefined));
      const state = store.getState().feed;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error);
    });
  });
});

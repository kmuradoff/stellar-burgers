import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { ORDER_SLICE_NAME } from '../../utils/constants';

export const fetchOrder = createAsyncThunk(
  'order/post',
  async (data: string[], { rejectWithValue }) => {
    const reply = await orderBurgerApi(data);
    if (!reply.success) {
      return rejectWithValue(reply);
    }
    return reply;
  }
);

export const getOrders = createAsyncThunk('orders/getAll', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/get',
  async (number: number, { rejectWithValue }) => {
    const reply = await getOrderByNumberApi(number);
    if (!reply.success) {
      return rejectWithValue(reply);
    }
    return reply;
  }
);

export interface IOrderSlice {
  orders: TOrder[];
  order: TOrder | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IOrderSlice = {
  orders: [],
  order: null,
  isLoading: false,
  error: undefined
};

export const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  reducers: {
    removeBurger: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        (state.isLoading = false), (state.order = action.payload.order);
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        (state.isLoading = false), (state.orders = action.payload);
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        (state.isLoading = false), (state.order = action.payload.orders[0]);
      });
  },
  selectors: {
    orderSelector: (state) => state.order,
    ordersSelector: (state) => state.orders,
    isLoadingSelector: (state) => state.isLoading
  }
});

export const { orderSelector, ordersSelector, isLoadingSelector } =
  orderSlice.selectors;

export const { removeBurger } = orderSlice.actions;

import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { FEED_SLICE_NAME } from '../../utils/constants';

export const fetchFeed = createAsyncThunk(
  'feed/getAll',
  async (_, { rejectWithValue }) => {
    const reply = await getFeedsApi();
    if (!reply.success) {
      rejectWithValue(reply);
    }
    return reply;
  }
);

export interface IFeedSlice {
  feed: TOrdersData;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: IFeedSlice = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: undefined
};

export const feedSlice = createSlice({
  name: FEED_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        (state.isLoading = false), (state.feed = action.payload);
      });
  },
  selectors: {
    ordersSelected: (state) => state.feed.orders,
    feedSelected: (state) => state.feed,
    isLoadingSelected: (state) => state.isLoading
  }
});

export const { ordersSelected, isLoadingSelected, feedSelected } =
  feedSlice.selectors;

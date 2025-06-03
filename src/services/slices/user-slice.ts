import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';
import { USER_SLICE_NAME } from '../../utils/constants';

export const registerUser = createAsyncThunk(
  'register/post',
  async (data: TRegisterData, { rejectWithValue }) => {
    const reply = await registerUserApi(data);
    if (!reply.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', reply.accessToken);
    localStorage.setItem('refreshToken', reply.refreshToken);
    return reply;
  }
);

export const loginUser = createAsyncThunk(
  'loginUser/post',
  async (data: TLoginData, { rejectWithValue }) => {
    const info = await loginUserApi(data);
    if (!info.success) {
      return rejectWithValue(info);
    }
    setCookie('accessToken', info.accessToken);
    localStorage.setItem('refreshToken', info.refreshToken);
    return info.user;
  }
);

export const getUser = createAsyncThunk(
  'getUser/get',
  async (_, { rejectWithValue }) => {
    const reply = await getUserApi();
    if (!reply.success) {
      return rejectWithValue(reply);
    }
    return reply;
  }
);

export const updateUser = createAsyncThunk(
  'updateUser/post',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    const reply = await updateUserApi(user);
    if (!reply.success) {
      return rejectWithValue(reply);
    }
    return reply;
  }
);

export const logout = createAsyncThunk(
  'logout/post',
  async (_, { rejectWithValue }) => {
    const reply = await logoutApi();
    if (!reply.success) {
      return rejectWithValue(reply);
    }

    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export interface IUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  error: string | undefined;
}

const initialState: IUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  error: undefined
};

export const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = false;
        state.isAuthenticated = false;
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = false;
        state.isAuthenticated = false;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = undefined;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message;
      });
  },
  selectors: {
    getUserSelector: (state) => state.user,
    getIsAuthenticatedSelector: (state) => state.isAuthenticated,
    getErrorSelector: (state) => state.error,
    getIsAuthCheckedSelector: (state) => state.isAuthChecked
  }
});

export const {
  getErrorSelector,
  getIsAuthCheckedSelector,
  getIsAuthenticatedSelector,
  getUserSelector
} = userSlice.selectors;

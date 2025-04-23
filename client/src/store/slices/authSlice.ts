import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, UserRegistration } from '../../types';
import { auth } from '../../utils/api';
import { AxiosError } from 'axios';

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await auth.login(email, password);
      const userData = response.data;
      
      // Store token in localStorage
      if (userData.token) {
        localStorage.setItem('userToken', userData.token);
      }
      
      return userData;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: UserRegistration, { rejectWithValue }) => {
    try {
      const response = await auth.register(userData);
      const user = response.data;
      
      // Store token in localStorage
      if (user.token) {
        localStorage.setItem('userToken', user.token);
      }
      
      return user;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Registration failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      
      const response = await auth.getProfile();
      return { ...response.data, token };
    } catch (error) {
      localStorage.removeItem('userToken');
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Authentication failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await auth.updateProfile(userData);
      const updatedUser = response.data;
      
      // Update token if returned
      if (updatedUser.token) {
        localStorage.setItem('userToken', updatedUser.token);
      }
      
      return updatedUser;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Profile update failed');
    }
  }
);

export const upgradeToSeller = createAsyncThunk(
  'auth/upgradeToSeller',
  async (_, { rejectWithValue }) => {
    try {
      const response = await auth.upgradeToSeller();
      const updatedUser = response.data;
      
      // Update token if returned
      if (updatedUser.token) {
        localStorage.setItem('userToken', updatedUser.token);
      }
      
      return updatedUser;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Upgrade to seller failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken');
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Upgrade to seller
      .addCase(upgradeToSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(upgradeToSeller.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(upgradeToSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer; 
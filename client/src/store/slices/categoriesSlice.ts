import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';
import { categories as categoriesApi } from '../../utils/api';
import { AxiosError } from 'axios';

interface CategoriesState {
  items: Category[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CategoriesState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getAll();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: Partial<Category>, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.create(categoryData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: number; data: Partial<Category> }, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.update(id, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoriesApi.delete(id);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not delete category');
    }
  }
);

// Categories slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoriesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        const index = state.items.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.items = state.items.filter(category => category.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoriesError } = categoriesSlice.actions;

export default categoriesSlice.reducer; 
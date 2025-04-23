import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Listing, ListingSearchParams, ListingResponse } from '../../types';
import { listings as listingsApi } from '../../utils/api';
import { AxiosError } from 'axios';

interface ListingsState {
  items: Listing[];
  selectedListing: Listing | null;
  totalPages: number;
  currentPage: number;
  totalListings: number;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ListingsState = {
  items: [],
  selectedListing: null,
  totalPages: 0,
  currentPage: 1,
  totalListings: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (params: ListingSearchParams = {}, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getAll(params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not fetch listings');
    }
  }
);

export const fetchListingsByCategory = createAsyncThunk(
  'listings/fetchListingsByCategory',
  async ({ categorySlug, params = {} }: { categorySlug: string; params?: ListingSearchParams }, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getByCategory(categorySlug, params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not fetch listings by category');
    }
  }
);

export const fetchListingsBySeller = createAsyncThunk(
  'listings/fetchListingsBySeller',
  async ({ sellerId, params = {} }: { sellerId: number; params?: ListingSearchParams }, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getBySeller(sellerId, params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not fetch listings by seller');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchListingById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await listingsApi.getById(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not fetch listing details');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/createListing',
  async (listingData: Partial<Listing>, { rejectWithValue }) => {
    try {
      const response = await listingsApi.create(listingData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not create listing');
    }
  }
);

export const updateListing = createAsyncThunk(
  'listings/updateListing',
  async ({ id, data }: { id: number; data: Partial<Listing> }, { rejectWithValue }) => {
    try {
      const response = await listingsApi.update(id, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not update listing');
    }
  }
);

export const deleteListing = createAsyncThunk(
  'listings/deleteListing',
  async (id: number, { rejectWithValue }) => {
    try {
      await listingsApi.delete(id);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not delete listing');
    }
  }
);

export const uploadListingImages = createAsyncThunk(
  'listings/uploadListingImages',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await listingsApi.uploadImages(id, formData);
      return { id, images: response.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Could not upload images');
    }
  }
);

// Listings slice
const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearListingsError: (state) => {
      state.error = null;
    },
    clearSelectedListing: (state) => {
      state.selectedListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch listings
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action: PayloadAction<ListingResponse>) => {
        state.isLoading = false;
        state.items = action.payload.listings;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
        state.totalListings = action.payload.total;
        state.error = null;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch listings by category
      .addCase(fetchListingsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListingsByCategory.fulfilled, (state, action: PayloadAction<ListingResponse>) => {
        state.isLoading = false;
        state.items = action.payload.listings;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
        state.totalListings = action.payload.total;
        state.error = null;
      })
      .addCase(fetchListingsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch listings by seller
      .addCase(fetchListingsBySeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListingsBySeller.fulfilled, (state, action: PayloadAction<ListingResponse>) => {
        state.isLoading = false;
        state.items = action.payload.listings;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.pages;
        state.totalListings = action.payload.total;
        state.error = null;
      })
      .addCase(fetchListingsBySeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch listing by ID
      .addCase(fetchListingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.isLoading = false;
        state.selectedListing = action.payload;
        state.error = null;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create listing
      .addCase(createListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update listing
      .addCase(updateListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.isLoading = false;
        
        // Update in items array
        const index = state.items.findIndex(listing => listing.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        
        // Update selected listing if it's the one being edited
        if (state.selectedListing && state.selectedListing.id === action.payload.id) {
          state.selectedListing = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete listing
      .addCase(deleteListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.items = state.items.filter(listing => listing.id !== action.payload);
        
        // Clear selected listing if it's the one being deleted
        if (state.selectedListing && state.selectedListing.id === action.payload) {
          state.selectedListing = null;
        }
        
        state.error = null;
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Upload listing images
      .addCase(uploadListingImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadListingImages.fulfilled, (state, action: PayloadAction<{ id: number; images: any }>) => {
        state.isLoading = false;
        
        // Update images in items array
        const index = state.items.findIndex(listing => listing.id === action.payload.id);
        if (index !== -1) {
          state.items[index].images = [
            ...(state.items[index].images || []),
            ...action.payload.images
          ];
        }
        
        // Update selected listing if it's the one being edited
        if (state.selectedListing && state.selectedListing.id === action.payload.id) {
          state.selectedListing.images = [
            ...(state.selectedListing.images || []),
            ...action.payload.images
          ];
        }
        
        state.error = null;
      })
      .addCase(uploadListingImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearListingsError, clearSelectedListing } = listingsSlice.actions;

export default listingsSlice.reducer; 
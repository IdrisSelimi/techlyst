import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { User, UserRegistration, Category, Listing, ListingSearchParams, ListingResponse } from '../types';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const auth = {
  register: (userData: UserRegistration) => 
    api.post<User>('/users', userData),
  
  login: (email: string, password: string) => 
    api.post<User>('/users/login', { email, password }),
  
  getProfile: () => 
    api.get<User>('/users/profile'),
  
  updateProfile: (userData: Partial<User>) => 
    api.put<User>('/users/profile', userData),
  
  upgradeToSeller: () => 
    api.put<User>('/users/upgrade-to-seller'),
};

// Categories API endpoints
export const categories = {
  getAll: () => 
    api.get<Category[]>('/categories'),
  
  getById: (id: number) => 
    api.get<Category>(`/categories/${id}`),
  
  create: (categoryData: Partial<Category>) => 
    api.post<Category>('/categories', categoryData),
  
  update: (id: number, categoryData: Partial<Category>) => 
    api.put<Category>(`/categories/${id}`, categoryData),
  
  delete: (id: number) => 
    api.delete(`/categories/${id}`),
};

// Listings API endpoints
export const listings = {
  getAll: (params?: ListingSearchParams) => 
    api.get<ListingResponse>('/listings', { params }),
  
  getById: (id: number) => 
    api.get<Listing>(`/listings/${id}`),
  
  getByCategory: (categorySlug: string, params?: ListingSearchParams) => 
    api.get<ListingResponse>('/listings', { 
      params: { ...params, category: categorySlug } 
    }),
  
  getBySeller: (sellerId: number, params?: ListingSearchParams) => 
    api.get<ListingResponse>(`/listings/seller/${sellerId}`, { params }),
  
  create: (listingData: Partial<Listing>) => 
    api.post<Listing>('/listings', listingData),
  
  update: (id: number, listingData: Partial<Listing>) => 
    api.put<Listing>(`/listings/${id}`, listingData),
  
  delete: (id: number) => 
    api.delete(`/listings/${id}`),
  
  uploadImages: (id: number, formData: FormData) => {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post<any>(`/listings/${id}/images`, formData, config);
  },
};

export default api; 
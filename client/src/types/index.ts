// User types
export interface User {
  id: number;
  email: string;
  username: string;
  role: 'buyer' | 'seller' | 'admin';
  is_verified?: boolean;
  reputation_score?: number;
  created_at?: string;
  token?: string;
}

export interface UserRegistration extends Pick<User, 'email' | 'username'> {
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Listing types
export interface Listing {
  id: number;
  title: string;
  description?: string;
  price: number;
  condition?: 'new' | 'used';
  status: 'active' | 'hidden' | 'expired';
  category_id: number;
  seller_id: number;
  contact_info: string;
  country?: string;
  city?: string;
  postal_code?: string;
  specs?: any;
  expires_at?: string;
  renewed_at?: string;
  is_flagged?: boolean;
  is_approved?: boolean;
  created_at: string;
  category?: Category;
  seller?: User;
  images?: ListingImage[];
}

export interface ListingImage {
  id: number;
  listing_id: number;
  url: string;
  is_primary: boolean;
}

export interface ListingSearchParams {
  page?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  condition?: 'new' | 'used';
}

export interface ListingResponse {
  listings: Listing[];
  page: number;
  pages: number;
  total: number;
} 
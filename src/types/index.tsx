export interface ProductOption {
  color: string;
  quantity: number;
  imageUrls: string[];
  price: number;
  _id: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  colorCode: string;    
  images: string[];
  quantity: number;
  price: number;
}

export interface ProductSpecifications {
  material: string;
  color: string;
  style: string;
  length: string;
  blousePiece: string;
  designNo: string;
}

export interface Product {
  _id: string;
  name: string;
  subcategory: { _id: string; name: string };
  category: { _id: string; name: string };
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  options: ProductOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  images?: string[];
  variants?: ProductVariant[];
  specifications?: ProductSpecifications;
  fullDescription?: string;
  material?: string;
  style?: string;
  length?: string;
  blousePiece?: string;
  designNo?: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  categoryImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubCategory {
  _id: string;
  name: string;
  parentCategory: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  filters?: { subCategories: string[] };
  pagination?: Pagination;
  message?: string;
  imageUrl?: string;
}


export interface Enquiry {
  productId: string;
  productName: string;
  variant?: string; // Selected color or "Default",
  whatsappNumber: string;
  quantity: number;
  productImage: string;
  userName: string;
  userEmail: string;
  message?: string;
  buyOption: 'Personal' | 'Wholesale' | 'Other';
  location: string;
  companyName?: string;
}

export interface Reel {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  price?: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Banner {
  _id: string;
  title?: string;
  description?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BannerResponse {
  data: Banner[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
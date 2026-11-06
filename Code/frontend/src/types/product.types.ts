export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: number | null;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductSpec {
  id: number;
  specGroup: string;
  specKey: string;
  specValue: string;
  sortOrder: number;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  stockQuantity: number;
  thumbnail?: string | null;
  status: ProductStatus;
  categoryId?: number | null;
  categoryName?: string | null;
  brandId?: number | null;
  brandName?: string | null;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  stockQuantity: number;
  thumbnail?: string | null;
  status: ProductStatus;
  createdAt: string;
  category?: Category | null;
  brand?: Brand | null;
  images: ProductImage[];
  specs: ProductSpec[];
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductFilterParams {
  categoryId?: number | string;
  brandId?: number | string;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | string;
}


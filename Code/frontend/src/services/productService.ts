import { api } from './api';
import {
  Category,
  Brand,
  ProductSummary,
  ProductDetail,
  ProductFilterParams,
  PageResponse,
} from '@/types/product.types';

export const productService = {
  /**
   * Lấy danh sách tất cả danh mục sản phẩm
   */
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Lấy chi tiết danh mục theo slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${encodeURIComponent(slug)}`);
    return response.data;
  },

  /**
   * Lấy danh sách tất cả thương hiệu
   */
  async getBrands(): Promise<Brand[]> {
    const response = await api.get<Brand[]>('/brands');
    return response.data;
  },

  /**
   * Lấy chi tiết thương hiệu theo slug
   */
  async getBrandBySlug(slug: string): Promise<Brand> {
    const response = await api.get<Brand>(`/brands/${encodeURIComponent(slug)}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm có bộ lọc và phân trang
   */
  async getProducts(params?: ProductFilterParams): Promise<PageResponse<ProductSummary>> {
    const response = await api.get<PageResponse<ProductSummary>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm nổi bật cho Trang chủ
   */
  async getFeaturedProducts(): Promise<ProductSummary[]> {
    const response = await api.get<ProductSummary[]>('/products/featured');
    return response.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo ID (kèm gallery ảnh & thông số specs)
   */
  async getProductById(id: number | string): Promise<ProductDetail> {
    const response = await api.get<ProductDetail>(`/products/${id}`);
    return response.data;
  },

  /**
   * Lấy chi tiết sản phẩm theo Slug chuẩn SEO
   */
  async getProductBySlug(slug: string): Promise<ProductDetail> {
    const response = await api.get<ProductDetail>(`/products/slug/${encodeURIComponent(slug)}`);
    return response.data;
  },

  /**
   * Lấy danh sách sản phẩm liên quan cùng danh mục
   */
  async getRelatedProducts(id: number | string, categoryId: number | string): Promise<ProductSummary[]> {
    const response = await api.get<ProductSummary[]>(`/products/${id}/related`, {
      params: { categoryId },
    });
    return response.data;
  },
};

